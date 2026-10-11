import 'package:flutter/material.dart';
import '../../../models/pending_order.dart';
import '../../../theme/sifra_theme.dart';

class PosCartPanel extends StatelessWidget {
  final PendingOrder? order;
  final ValueChanged<String> onRemove;
  final VoidCallback onCheckout;
  final VoidCallback onBrowseMenu;
  final VoidCallback onCreate;

  const PosCartPanel({
    super.key,
    required this.order,
    required this.onRemove,
    required this.onCheckout,
    required this.onBrowseMenu,
    required this.onCreate,
  });

  @override
  Widget build(BuildContext context) {
    if (order == null) {
      return _empty(
        icon: Icons.receipt_long_outlined,
        title: 'No Order Selected',
        body: 'Select an order from the list or create a new order.',
        ctaLabel: 'Create New Order',
        onCta: onCreate,
      );
    }
    if (order!.items.isEmpty) {
      return _empty(
        icon: Icons.shopping_cart_outlined,
        title: order!.displayName,
        body: 'Order is empty. Add items from the menu.',
        ctaLabel: 'Browse Menu',
        onCta: onBrowseMenu,
      );
    }

    final total = order!.items.fold<double>(0, (s, i) => s + i.subtotal);

    return Column(
      children: [
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
            itemCount: order!.items.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (_, i) {
              final it = order!.items[i];
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            it.product.productName,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: SifraColors.brown,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${it.unitPrice.toStringAsFixed(0)} ETB × ${it.quantity}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: SifraColors.muted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '${it.subtotal.toStringAsFixed(0)} ETB',
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: SifraColors.brown,
                      ),
                    ),
                    IconButton(
                      onPressed: () => onRemove(it.productId),
                      icon: const Icon(Icons.close, size: 18),
                      color: SifraColors.danger,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
          decoration: const BoxDecoration(
            color: SifraColors.white,
            border: Border(top: BorderSide(color: SifraColors.border)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total:',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: SifraColors.brown,
                    ),
                  ),
                  Text(
                    '${total.toStringAsFixed(0)} ETB',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: SifraColors.gold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: onCheckout,
                  child: const Text('Checkout Order'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _empty({
    required IconData icon,
    required String title,
    required String body,
    required String ctaLabel,
    required VoidCallback onCta,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 44, color: SifraColors.gold),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 16,
                color: SifraColors.brown,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              body,
              textAlign: TextAlign.center,
              style: const TextStyle(color: SifraColors.muted, fontSize: 13),
            ),
            const SizedBox(height: 20),
            OutlinedButton(onPressed: onCta, child: Text(ctaLabel)),
          ],
        ),
      ),
    );
  }
}
