import 'package:flutter/material.dart';
import '../../models/pending_order.dart';
import '../../theme/sifra_theme.dart';

class PosOrdersPanel extends StatelessWidget {
  final List<PendingOrder> orders;
  final String? activeId;
  final ValueChanged<PendingOrder> onSelect;
  final Future<void> Function(String name) onCreate;
  final Future<void> Function() onRefresh;

  const PosOrdersPanel({
    super.key,
    required this.orders,
    required this.activeId,
    required this.onSelect,
    required this.onCreate,
    required this.onRefresh,
  });

  Future<void> _showNewOrderDialog(BuildContext context) async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: SifraColors.white,
        title: const Text('Create New Order'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Customer or Table Name',
            hintText: 'e.g. Table 4',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              final v = controller.text.trim();
              if (v.isNotEmpty) Navigator.pop(ctx, v);
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
    if (name != null && name.isNotEmpty) {
      await onCreate(name);
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: SifraColors.gold,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
        children: [
          FilledButton(
            onPressed: () => _showNewOrderDialog(context),
            child: const Text('+ New Order'),
          ),
          const SizedBox(height: 12),
          if (orders.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 40),
              child: Center(
                child: Text(
                  'No active orders',
                  style: TextStyle(color: SifraColors.muted, fontSize: 13),
                ),
              ),
            )
          else
            ...orders.map((o) {
              final selected = o.orderId == activeId;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: InkWell(
                  onTap: () => onSelect(o),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: selected
                          ? SifraColors.gold.withValues(alpha: 0.12)
                          : SifraColors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: selected ? SifraColors.gold : SifraColors.border,
                        width: selected ? 1.5 : 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          o.displayName,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 15,
                            color: SifraColors.brown,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${o.totalAmount.toStringAsFixed(0)} ETB • ${o.items.length} items',
                          style: const TextStyle(
                            fontSize: 12,
                            color: SifraColors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
        ],
      ),
    );
  }
}
