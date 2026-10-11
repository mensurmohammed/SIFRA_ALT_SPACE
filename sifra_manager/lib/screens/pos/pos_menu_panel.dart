import 'package:flutter/material.dart';
import '../../models/menu_product.dart';
import '../../theme/sifra_theme.dart';

class PosMenuPanel extends StatelessWidget {
  final List<MenuProduct> products;
  final String? activeOrderName;
  final ValueChanged<MenuProduct> onAdd;
  final VoidCallback onOpenCart;

  const PosMenuPanel({
    super.key,
    required this.products,
    required this.activeOrderName,
    required this.onAdd,
    required this.onOpenCart,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
          child: Row(
            children: [
              const Text(
                'Menu Items',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                  color: SifraColors.brown,
                ),
              ),
              const Spacer(),
              if (activeOrderName != null)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: SifraColors.gold.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Editing: $activeOrderName',
                    style: const TextStyle(
                      color: SifraColors.brown,
                      fontWeight: FontWeight.w600,
                      fontSize: 11,
                    ),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'No order selected',
                    style: TextStyle(color: SifraColors.muted, fontSize: 11),
                  ),
                ),
            ],
          ),
        ),
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              mainAxisExtent: 100,
            ),
            itemCount: products.length,
            itemBuilder: (_, i) {
              final p = products[i];
              return InkWell(
                onTap: () => onAdd(p),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: SifraColors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: SifraColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        p.productName,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          color: SifraColors.brown,
                        ),
                      ),
                      Text(
                        '${p.sellingPrice.toStringAsFixed(0)} ETB',
                        style: const TextStyle(
                          color: SifraColors.gold,
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
