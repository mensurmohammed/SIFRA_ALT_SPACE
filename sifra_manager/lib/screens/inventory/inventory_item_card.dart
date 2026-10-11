import 'package:flutter/material.dart';
import '../../models/inventory_item.dart';
import '../../theme/sifra_theme.dart';

class InventoryItemCard extends StatelessWidget {
  final InventoryItem item;
  final VoidCallback onRestock;

  const InventoryItemCard({
    super.key,
    required this.item,
    required this.onRestock,
  });

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _pillColors(item.level);

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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                        color: SifraColors.brown,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Unit: ${item.unit}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: SifraColors.muted,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${item.currentStock} ${item.unit}',
                  style: TextStyle(
                    color: fg,
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: onRestock,
              icon: const Icon(Icons.add_circle_outline, size: 18),
              label: const Text('Restock Item'),
              style: OutlinedButton.styleFrom(
                foregroundColor: SifraColors.brown,
                backgroundColor: SifraColors.gold.withValues(alpha: 0.1),
                side: BorderSide.none,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                textStyle: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  (Color bg, Color fg) _pillColors(StockLevel level) {
    switch (level) {
      case StockLevel.healthy:
        return (const Color(0xFFE2F0D9), const Color(0xFF385723));
      case StockLevel.low:
        return (const Color(0xFFFEF3C7), const Color(0xFF92400E));
      case StockLevel.empty:
        return (const Color(0xFFFEE2E2), const Color(0xFF991B1B));
    }
  }
}
