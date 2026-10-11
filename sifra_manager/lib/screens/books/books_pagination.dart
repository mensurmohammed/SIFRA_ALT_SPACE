import 'package:flutter/material.dart';
import '../../theme/sifra_theme.dart';

class BooksPagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final int totalItems;
  final int itemsPerPage;
  final ValueChanged<int> onPageChange;

  const BooksPagination({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
    required this.itemsPerPage,
    required this.onPageChange,
  });

  @override
  Widget build(BuildContext context) {
    if (totalPages <= 1) return const SizedBox.shrink();

    final start = (currentPage - 1) * itemsPerPage + 1;
    final end = (currentPage * itemsPerPage).clamp(0, totalItems);

    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Column(
        children: [
          Text(
            'Showing $start–$end of $totalItems',
            style: const TextStyle(fontSize: 11, color: SifraColors.muted),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _iconBtn(
                Icons.chevron_left,
                currentPage > 1,
                () => onPageChange(currentPage - 1),
              ),
              const SizedBox(width: 8),
              ..._pageNumbers(),
              const SizedBox(width: 8),
              _iconBtn(
                Icons.chevron_right,
                currentPage < totalPages,
                () => onPageChange(currentPage + 1),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<Widget> _pageNumbers() {
    // Show up to 5 page chips around current page
    final pages = <int>[];
    final from = (currentPage - 2).clamp(1, totalPages);
    final to = (currentPage + 2).clamp(1, totalPages);
    for (var i = from; i <= to; i++) pages.add(i);
    return pages.map((p) {
      final selected = p == currentPage;
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2),
        child: GestureDetector(
          onTap: () => onPageChange(p),
          child: Container(
            width: 34,
            height: 34,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: selected ? SifraColors.brown : SifraColors.white,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: SifraColors.border),
            ),
            child: Text(
              '$p',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: selected ? Colors.white : SifraColors.brown,
              ),
            ),
          ),
        ),
      );
    }).toList();
  }

  Widget _iconBtn(IconData icon, bool enabled, VoidCallback onTap) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 34,
        height: 34,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: SifraColors.white,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: SifraColors.border),
        ),
        child: Icon(
          icon,
          size: 18,
          color: enabled ? SifraColors.brown : SifraColors.border,
        ),
      ),
    );
  }
}
