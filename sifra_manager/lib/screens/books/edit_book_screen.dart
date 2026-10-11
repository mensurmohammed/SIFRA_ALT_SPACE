import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/books_service.dart';
import '../../models/category.dart';
import '../../theme/sifra_theme.dart';

class EditBookScreen extends StatefulWidget {
  final String bookId;
  const EditBookScreen({super.key, required this.bookId});

  @override
  State<EditBookScreen> createState() => _EditBookScreenState();
}

class _EditBookScreenState extends State<EditBookScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleCtrl = TextEditingController();
  final _authorCtrl = TextEditingController();
  final _isbnCtrl = TextEditingController();
  final _yearCtrl = TextEditingController();
  final _languageCtrl = TextEditingController();
  final _editionCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _coverCtrl = TextEditingController();

  List<Category> _categories = [];
  String? _selectedCategoryId;
  bool _loadingCategories = true;

  bool _loadingBook = true;
  bool _saving = false;
  String? _loadError;

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _authorCtrl.dispose();
    _isbnCtrl.dispose();
    _yearCtrl.dispose();
    _languageCtrl.dispose();
    _editionCtrl.dispose();
    _locationCtrl.dispose();
    _descCtrl.dispose();
    _coverCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadAll() async {
    // Load categories and book in parallel
    final categoriesFuture = BooksService.listCategories();
    final bookFuture = BooksService.getById(widget.bookId);

    try {
      final categories = await categoriesFuture;
      if (mounted) {
        setState(() {
          _categories = categories;
          _loadingCategories = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loadingCategories = false);
    }

    try {
      final book = await bookFuture;
      if (!mounted) return;
      setState(() {
        _titleCtrl.text = (book['Title'] as String?) ?? '';
        _authorCtrl.text = (book['Author'] as String?) ?? '';
        _isbnCtrl.text = (book['ISBN'] as String?) ?? '';
        _selectedCategoryId = book['CategoryID'] as String?;
        final y = book['PublicationYear'];
        _yearCtrl.text = y == null ? '' : y.toString();
        _languageCtrl.text = (book['Language'] as String?) ?? '';
        _editionCtrl.text = (book['Edition'] as String?) ?? '';
        _locationCtrl.text = (book['ShelfLocation'] as String?) ?? '';
        _descCtrl.text = (book['Description'] as String?) ?? '';
        _coverCtrl.text = (book['CoverImage'] as String?) ?? '';
        _loadingBook = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _loadError = e.message;
        _loadingBook = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loadError = 'Failed to load book data';
        _loadingBook = false;
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await BooksService.updateBook(
        id: widget.bookId,
        title: _titleCtrl.text.trim(),
        author: _authorCtrl.text.trim(),
        isbn: _isbnCtrl.text.trim(),
        categoryId: _selectedCategoryId,
        year: _yearCtrl.text.trim(),
        language: _languageCtrl.text.trim(),
        edition: _editionCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        location: _locationCtrl.text.trim(),
        cover: _coverCtrl.text.trim(),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Book updated successfully'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/books');
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to update book');
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
          'Edit Book',
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
    if (_loadingBook) {
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
              OutlinedButton(
                onPressed: () {
                  setState(() {
                    _loadingBook = true;
                    _loadError = null;
                  });
                  _loadAll();
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          _label('Title *'),
          TextFormField(
            controller: _titleCtrl,
            decoration: const InputDecoration(),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Title is required' : null,
          ),
          const SizedBox(height: 14),

          _label('Author *'),
          TextFormField(
            controller: _authorCtrl,
            decoration: const InputDecoration(),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Author is required' : null,
          ),
          const SizedBox(height: 14),

          _label('ISBN'),
          TextFormField(
            controller: _isbnCtrl,
            decoration: const InputDecoration(hintText: '978-…'),
          ),
          const SizedBox(height: 14),

          _label('Category'),
          _categoryField(),
          const SizedBox(height: 14),

          _label('Publication Year'),
          TextFormField(
            controller: _yearCtrl,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(hintText: '2024'),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return null;
              final n = int.tryParse(v.trim());
              if (n == null) return 'Enter a valid year';
              if (n < 1000 || n > 2100) return 'Enter a plausible year';
              return null;
            },
          ),
          const SizedBox(height: 14),

          _label('Language'),
          TextFormField(
            controller: _languageCtrl,
            decoration: const InputDecoration(hintText: 'e.g. English'),
          ),
          const SizedBox(height: 14),

          _label('Edition'),
          TextFormField(
            controller: _editionCtrl,
            decoration: const InputDecoration(hintText: 'e.g. 2nd'),
          ),
          const SizedBox(height: 14),

          _label('Shelf Location'),
          TextFormField(
            controller: _locationCtrl,
            decoration: const InputDecoration(hintText: 'e.g. A3-F2'),
          ),
          const SizedBox(height: 20),

          _label('Cover Image URL'),
          TextFormField(
            controller: _coverCtrl,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(hintText: 'https://…'),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return null;
              final u = v.trim();
              if (!u.startsWith('http://') && !u.startsWith('https://')) {
                return 'Must start with http:// or https://';
              }
              return null;
            },
          ),
          const SizedBox(height: 14),

          _label('Description'),
          TextFormField(
            controller: _descCtrl,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Brief book synopsis, themes, or overview…',
            ),
          ),
          const SizedBox(height: 24),

          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: _saving ? null : () => context.go('/books'),
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
                  onPressed: _saving ? null : _save,
                  child: _saving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Update Book'),
                ),
              ),
            ],
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

  Widget _categoryField() {
    if (_loadingCategories) {
      return const InputDecorator(
        decoration: InputDecoration(),
        child: Row(
          children: [
            SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            SizedBox(width: 10),
            Text('Loading categories…', style: TextStyle(fontSize: 13)),
          ],
        ),
      );
    }
    if (_categories.isEmpty) {
      return const InputDecorator(
        decoration: InputDecoration(),
        child: Text(
          'No categories available',
          style: TextStyle(fontSize: 13, color: SifraColors.muted),
        ),
      );
    }
    return DropdownButtonFormField<String>(
      value: _selectedCategoryId,
      decoration: const InputDecoration(),
      hint: const Text('Select a category'),
      isExpanded: true,
      items: _categories
          .map(
            (c) => DropdownMenuItem<String>(
              value: c.categoryId,
              child: Text(
                c.categoryName,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 14),
              ),
            ),
          )
          .toList(),
      onChanged: (v) => setState(() => _selectedCategoryId = v),
      validator: (v) => (v == null || v.isEmpty) ? 'Category required' : null,
    );
  }
}
