import 'package:flutter/material.dart';
import '../../models/borrowing.dart';
import '../../theme/sifra_theme.dart';

class BorrowingCard extends StatelessWidget {
  final Borrowing borrowing;
  final VoidCallback onReturn; // → placeholder in 07a
  const BorrowingCard({
    super.key,
    required this.borrowing,
    required this.onReturn,
  });

  @override
  Widget build(BuildContext context) {
    final active = borrowing.isActive;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: SifraColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D352214),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Customer + status pill
          Row(
            children: [
              Expanded(
                child: Text(
                  borrowing.customerDisplay,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: SifraColors.brown,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 3,
                ),
                decoration: BoxDecoration(
                  color: active
                      ? const Color(0xFFFCE4D6)
                      : const Color(0xFFE2F0D9),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  borrowing.status,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: active
                        ? const Color(0xFFC65911)
                        : const Color(0xFF385723),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Book info
          Text(
            borrowing.copy.book.title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 13,
              color: SifraColors.brown,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            'Barcode: ${borrowing.copy.barcode}',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontFamily: 'monospace',
              fontSize: 11,
              color: SifraColors.muted,
            ),
          ),
          const SizedBox(height: 10),

          // Time + fee box
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: SifraColors.cream,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: SifraColors.border.withValues(alpha: 0.6),
              ),
            ),
            child: Column(
              children: [
                _row('Start:', _time(borrowing.borrowedAt)),
                if (borrowing.returnedAt != null) ...[
                  const SizedBox(height: 4),
                  _row('Returned:', _time(borrowing.returnedAt!)),
                ],
                if (borrowing.amountCharged != null) ...[
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.only(top: 6),
                    decoration: const BoxDecoration(
                      border: Border(
                        top: BorderSide(color: SifraColors.border, width: 1),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Fee:',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                            color: SifraColors.brown,
                          ),
                        ),
                        Text(
                          '${_fmtFee(borrowing.amountCharged!)} Birr',
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                            color: SifraColors.gold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Action row
          if (active)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onReturn,
                style: ElevatedButton.styleFrom(
                  backgroundColor: SifraColors.gold,
                  foregroundColor: SifraColors.brown,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  textStyle: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
                child: const Text('Return & Pay'),
              ),
            )
          else
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 4),
                child: Text(
                  'Session Completed',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: SifraColors.muted,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _row(String label, String value) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Text(
        label,
        style: const TextStyle(fontSize: 12, color: SifraColors.muted),
      ),
      Text(
        value,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: SifraColors.brown,
        ),
      ),
    ],
  );

  /// "03:15 PM" — matches the website's toLocaleTimeString 2-digit hour/minute
  String _time(DateTime d) {
    final hour12 = d.hour % 12 == 0 ? 12 : d.hour % 12;
    final minute = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour < 12 ? 'AM' : 'PM';
    return '${hour12.toString().padLeft(2, '0')}:$minute $ampm';
  }

  String _fmtFee(double v) {
    if (v == v.roundToDouble()) return v.toInt().toString();
    return v.toStringAsFixed(2);
  }
}
