import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/books_service.dart';
import '../../core/borrowings_service.dart';
import '../../models/book.dart';
import '../../theme/sifra_theme.dart';
import 'available_copy.dart';

class NewBorrowingScreen extends StatefulWidget {
  const NewBorrowingScreen({super.key});

  @override
  State<NewBorrowingScreen> createState() => _NewBorrowingScreenState();
}

class _NewBorrowingScreenState extends State<NewBorrowingScreen> {
  bool _loading = true;
  String? _loadError;

  List<AvailableCopy> _allAvailable = [];
  List<String> _categories = [];

  String _search = '';
  String _selectedCategory = 'All';
  AvailableCopy? _selectedCopy;

  final _emailCtrl = TextEditingController();
  late DateTime _startTime;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _startTime = _floorTo15(DateTime.now());
    _load();
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  /// Match the backend: round down to nearest 15 minutes
  DateTime _floorTo15(DateTime d) {
    final m = (d.minute ~/ 15) * 15;
    return DateTime(d.year, d.month, d.day, d.hour, m);
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _loadError = null;
    });
    try {
      final books = await BooksService.list();
      if (!mounted) return;
      final available = AvailableCopy.fromBooks(books);
      final cats = <String>{};
      for (final c in available) {
        if (c.categoryName.isNotEmpty) cats.add(c.categoryName);
      }
      setState(() {
        _allAvailable = available;
        _categories = (cats.toList()..sort());
        _loading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _loadError = e.message;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loadError = 'Network error. Check your connection.';
        _loading = false;
      });
    }
  }

  List<AvailableCopy> get _filtered {
    final q = _search.trim().toLowerCase();
    return _allAvailable.where((c) {
      final matchesSearch =
          q.isEmpty ||
          c.bookTitle.toLowerCase().contains(q) ||
          c.author.toLowerCase().contains(q);
      final matchesCat =
          _selectedCategory == 'All' || c.categoryName == _selectedCategory;
      return matchesSearch && matchesCat;
    }).toList();
  }

  Future<void> _pickStartTime() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _startTime,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(
            primary: SifraColors.brown,
            onPrimary: Colors.white,
            onSurface: SifraColors.brown,
          ),
        ),
        child: child!,
      ),
    );
    if (date == null) return;
    if (!mounted) return;
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_startTime),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(
            primary: SifraColors.brown,
            onPrimary: Colors.white,
            onSurface: SifraColors.brown,
          ),
        ),
        child: child!,
      ),
    );
    if (time == null) return;
    setState(() {
      final picked = DateTime(
        date.year,
        date.month,
        date.day,
        time.hour,
        time.minute,
      );
      _startTime = _floorTo15(picked);
    });
  }

  Future<void> _submit() async {
    if (_selectedCopy == null) {
      _toast('Please select a book copy.');
      return;
    }
    setState(() => _saving = true);
    try {
      await BorrowingsService.create(
        copyId: _selectedCopy!.copyId,
        customerEmail: _emailCtrl.text,
        startTime: _startTime,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Borrowing session started successfully.'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/borrowings');
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to start checkout.');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: SifraColors.danger,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SifraColors.cream,
      appBar: AppBar(
        backgroundColor: SifraColors.brown,
        foregroundColor: Colors.white,
        title: Text(
          'New Borrowing',
          style: TextStyle(
            fontFamily: Theme.of(context).textTheme.displaySmall?.fontFamily,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(child: _body()),
    );
  }

  Widget _body() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: SifraColors.gold),
      );
    }
    if (_loadError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 48, color: SifraColors.muted),
              const SizedBox(height: 12),
              Text(
                _loadError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: SifraColors.muted),
              ),
              const SizedBox(height: 16),
              OutlinedButton(onPressed: _load, child: const Text('Retry')),
            ],
          ),
        ),
      );
    }

    final results = _filtered;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        _label('Search & Select Book'),
        const SizedBox(height: 8),

        // Search
        TextField(
          decoration: const InputDecoration(
            hintText: 'Search by title or author…',
            prefixIcon: Icon(Icons.search, size: 20),
          ),
          onChanged: (v) => setState(() => _search = v),
        ),
        const SizedBox(height: 10),

        // Category filter
        DropdownButtonFormField<String>(
          value: _selectedCategory,
          isExpanded: true,
          decoration: const InputDecoration(),
          items: [
            const DropdownMenuItem(value: 'All', child: Text('All Categories')),
            ..._categories.map(
              (c) => DropdownMenuItem(
                value: c,
                child: Text(c, overflow: TextOverflow.ellipsis),
              ),
            ),
          ],
          onChanged: (v) => setState(() => _selectedCategory = v ?? 'All'),
        ),
        const SizedBox(height: 10),

        // Copy picker
        _copyPicker(results),
        const SizedBox(height: 16),

        // Selected copy preview
        if (_selectedCopy != null) ...[
          _previewCard(_selectedCopy!),
          const SizedBox(height: 16),
        ],

        // Customer Email
        _label('Customer Email (Optional)'),
        TextField(
          controller: _emailCtrl,
          keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(
            hintText: 'Enter customer email if applicable',
          ),
        ),
        const SizedBox(height: 16),

        // Start Time
        _label('Start Time Override'),
        InkWell(
          onTap: _pickStartTime,
          borderRadius: BorderRadius.circular(12),
          child: InputDecorator(
            decoration: const InputDecoration(
              suffixIcon: Icon(Icons.event, color: SifraColors.gold),
            ),
            child: Text(
              _fmtDateTime(_startTime),
              style: const TextStyle(fontSize: 14, color: SifraColors.brown),
            ),
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Time will be automatically rounded down to the nearest 15-minute interval upon saving.',
          style: TextStyle(fontSize: 11, color: SifraColors.muted),
        ),
        const SizedBox(height: 24),

        // Actions
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: _saving ? null : () => context.go('/borrowings'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: const BorderSide(color: SifraColors.border),
                  foregroundColor: SifraColors.muted,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Cancel'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(
                onPressed: (_saving || _selectedCopy == null) ? null : _submit,
                child: _saving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Start Session'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _copyPicker(List<AvailableCopy> results) {
    if (_allAvailable.isEmpty) {
      return const InputDecorator(
        decoration: InputDecoration(),
        child: Text(
          'No available copies in the library.',
          style: TextStyle(fontSize: 13, color: SifraColors.muted),
        ),
      );
    }
    if (results.isEmpty) {
      return InputDecorator(
        decoration: const InputDecoration(),
        child: Text(
          'No copies match your search (${_allAvailable.length} total available).',
          style: const TextStyle(fontSize: 13, color: SifraColors.muted),
        ),
      );
    }
    return DropdownButtonFormField<String>(
      value: _selectedCopy?.copyId,
      isExpanded: true,
      decoration: const InputDecoration(),
      hint: Text(
        'Select an available copy from results (${results.length})',
        style: const TextStyle(fontSize: 13),
      ),
      items: results
          .map(
            (c) => DropdownMenuItem<String>(
              value: c.copyId,
              child: Text(
                '${c.bookTitle} — ${c.author} (Barcode: ${c.barcode})',
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12),
              ),
            ),
          )
          .toList(),
      onChanged: (id) {
        if (id == null) return;
        setState(() {
          _selectedCopy = _allAvailable.firstWhere((c) => c.copyId == id);
        });
      },
    );
  }

  Widget _previewCard(AvailableCopy c) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: SifraColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Mini 9:16 cover
          SizedBox(
            width: 56,
            child: AspectRatio(
              aspectRatio: 9 / 16,
              child: Container(
                decoration: BoxDecoration(
                  color: SifraColors.cream,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: SifraColors.border),
                ),
                clipBehavior: Clip.antiAlias,
                child: c.coverImage != null && c.coverImage!.isNotEmpty
                    ? Image.network(
                        c.coverImage!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(
                          Icons.menu_book_outlined,
                          color: SifraColors.gold,
                          size: 18,
                        ),
                      )
                    : const Icon(
                        Icons.menu_book_outlined,
                        color: SifraColors.gold,
                        size: 18,
                      ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  c.bookTitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                    color: SifraColors.brown,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  c.author,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: SifraColors.muted,
                  ),
                ),
                if (c.categoryName.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: SifraColors.cream,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      c.categoryName,
                      style: const TextStyle(
                        fontSize: 10,
                        color: SifraColors.gold,
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 6),
                Text(
                  'Barcode: ${c.barcode}',
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: SifraColors.muted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Text(
      text,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        fontSize: 13,
        color: SifraColors.brown,
      ),
    ),
  );

  /// 10/12/2026, 01:15 AM — matches the format users expect on Android
  String _fmtDateTime(DateTime d) {
    final hour12 = d.hour % 12 == 0 ? 12 : d.hour % 12;
    final minute = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour < 12 ? 'AM' : 'PM';
    return '${d.month}/${d.day}/${d.year}, '
        '${hour12.toString().padLeft(2, '0')}:$minute $ampm';
  }
}
