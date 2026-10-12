import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/borrowings_service.dart';
import '../../models/borrowing.dart';
import '../../theme/sifra_theme.dart';

class ReturnBorrowingScreen extends StatefulWidget {
  final Borrowing borrowing;
  const ReturnBorrowingScreen({super.key, required this.borrowing});

  @override
  State<ReturnBorrowingScreen> createState() => _ReturnBorrowingScreenState();
}

class _ReturnBorrowingScreenState extends State<ReturnBorrowingScreen> {
  // Matches the website's hardcoded preview rate.
  // The server reads borrowing_rate_quarter_hour; if it's customized,
  // the preview will be slightly off — but the authoritative fee
  // is what the server writes back, which we display after refresh.
  static const int _previewRate = 15;

  late DateTime _endTime;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _endTime = _floorTo15(DateTime.now());
  }

  /// Match the backend: round down to nearest 15 minutes (used for
  /// the default end-time value only; the picker honors what the user picks)
  DateTime _floorTo15(DateTime d) {
    final m = (d.minute ~/ 15) * 15;
    return DateTime(d.year, d.month, d.day, d.hour, m);
  }

  /// Same formula the website preview uses:
  /// intervals = max(1, ceil(minutes / 15)); fee = intervals * rate
  int get _previewFee {
    final start = widget.borrowing.borrowedAt;
    final durationMs = _endTime.difference(start).inMilliseconds;
    if (durationMs < 0) return 0;
    final minutes = durationMs / (1000 * 60);
    final intervals = (minutes / 15).ceil();
    final safe = intervals < 1 ? 1 : intervals;
    return safe * _previewRate;
  }

  String? get _validationError {
    final start = widget.borrowing.borrowedAt;
    final diff = _endTime.difference(start);
    if (diff.isNegative) return 'End time cannot be before start time';
    if (diff.inHours >= 24 && diff.inMinutes > 24 * 60)
      return 'Borrow session exceeds maximum allowed 24 hours';
    if (diff.inMinutes > 24 * 60)
      return 'Borrow session exceeds maximum allowed 24 hours';
    return null;
  }

  Future<void> _pickEndTime() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _endTime,
      firstDate: widget.borrowing.borrowedAt,
      lastDate: widget.borrowing.borrowedAt.add(const Duration(days: 1)),
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
      initialTime: TimeOfDay.fromDateTime(_endTime),
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
      _endTime = DateTime(
        date.year,
        date.month,
        date.day,
        time.hour,
        time.minute,
      );
    });
  }

  Future<void> _submit() async {
    final err = _validationError;
    if (err != null) {
      _toast(err);
      return;
    }
    setState(() => _saving = true);
    try {
      await BorrowingsService.returnBook(
        borrowingId: widget.borrowing.borrowingId,
        endTime: _endTime,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Book returned and fee calculated successfully.'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/borrowings');
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to return book.');
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
    final b = widget.borrowing;
    final fee = _previewFee;
    final err = _validationError;

    return Scaffold(
      backgroundColor: SifraColors.cream,
      appBar: AppBar(
        backgroundColor: SifraColors.brown,
        foregroundColor: Colors.white,
        title: Text(
          'Return & Pay',
          style: TextStyle(
            fontFamily: Theme.of(context).textTheme.displaySmall?.fontFamily,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          children: [
            Text(
              'Complete Borrowing Session',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),

            // Book / start info
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: SifraColors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: SifraColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    b.copy.book.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: SifraColors.brown,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Barcode: ${b.copy.barcode}',
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: SifraColors.muted,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Started: ${_fmtDateTime(b.borrowedAt)}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: SifraColors.muted,
                    ),
                  ),
                  if (b.customerDisplay.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Customer: ${b.customerDisplay}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: SifraColors.muted,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),

            // End time
            _label('End Time Override'),
            InkWell(
              onTap: _pickEndTime,
              borderRadius: BorderRadius.circular(12),
              child: InputDecorator(
                decoration: const InputDecoration(
                  suffixIcon: Icon(Icons.event, color: SifraColors.gold),
                ),
                child: Text(
                  _fmtDateTime(_endTime),
                  style: const TextStyle(
                    fontSize: 14,
                    color: SifraColors.brown,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Fee preview
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(color: SifraColors.border),
                  bottom: BorderSide(color: SifraColors.border),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Estimated Fee',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                      color: SifraColors.brown,
                    ),
                  ),
                  Text(
                    '$fee Birr',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                      color: SifraColors.gold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'The final fee is recalculated by the server when you confirm.',
              style: TextStyle(fontSize: 11, color: SifraColors.muted),
            ),

            if (err != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: SifraColors.danger.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.warning_amber_outlined,
                      color: SifraColors.danger,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        err,
                        style: const TextStyle(
                          color: SifraColors.danger,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 24),
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
                    onPressed: (_saving || err != null) ? null : _submit,
                    style: FilledButton.styleFrom(
                      backgroundColor: SifraColors.gold,
                      foregroundColor: SifraColors.brown,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: _saving
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: SifraColors.brown,
                            ),
                          )
                        : const Text(
                            'Confirm Return',
                            style: TextStyle(fontWeight: FontWeight.w700),
                          ),
                  ),
                ),
              ],
            ),
          ],
        ),
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

  String _fmtDateTime(DateTime d) {
    final hour12 = d.hour % 12 == 0 ? 12 : d.hour % 12;
    final minute = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour < 12 ? 'AM' : 'PM';
    return '${d.month}/${d.day}/${d.year}, '
        '${hour12.toString().padLeft(2, '0')}:$minute $ampm';
  }
}
