import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/api_client.dart';
import '../models/overview_stats.dart';
import '../theme/sifra_theme.dart';
import '../widgets/stat_card.dart';
import '../widgets/quick_action_card.dart';

class OverviewScreen extends StatefulWidget {
  const OverviewScreen({super.key});
  @override
  State<OverviewScreen> createState() => _OverviewScreenState();
}

class _OverviewScreenState extends State<OverviewScreen> {
  Future<OverviewStats>? _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<OverviewStats> _load() async {
    final res = await ApiClient.get('/api/manager/overview');
    return OverviewStats.fromJson(res['stats'] as Map<String, dynamic>);
  }

  Future<void> _refresh() async {
    setState(() => _future = _load());
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _refresh,
      color: SifraColors.gold,
      child: FutureBuilder<OverviewStats>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: SifraColors.gold),
            );
          }

          if (snap.hasError) {
            final err = snap.error;
            final msg = err is ApiException
                ? err.message
                : 'Failed to load dashboard';
            return ListView(
              children: [
                const SizedBox(height: 80),
                const Icon(Icons.cloud_off, size: 48, color: SifraColors.muted),
                const SizedBox(height: 12),
                Center(
                  child: Text(
                    msg,
                    style: const TextStyle(
                      color: SifraColors.muted,
                      fontSize: 14,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: OutlinedButton(
                    onPressed: _refresh,
                    child: const Text('Retry'),
                  ),
                ),
              ],
            );
          }

          final s = snap.data!;
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text(
                'Manager Dashboard',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 4),
              const Text(
                "Today's snapshot and quick access to key operations.",
                style: TextStyle(color: SifraColors.muted, fontSize: 13),
              ),
              const SizedBox(height: 24),
              GridView(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  mainAxisExtent: 150, // ← fixed height per card, no stretch
                ),
                children: [
                  StatCard(
                    icon: Icons.credit_card,
                    label: "Today's Sales",
                    value: '${_fmt(s.todaySalesEtb)} ETB',
                    accentColor: SifraColors.gold,
                    accentBg: const Color(0x1AD4A359),
                  ),
                  StatCard(
                    icon: Icons.shopping_bag_outlined,
                    label: 'Orders Today',
                    value: s.ordersToday.toString(),
                    accentColor: SifraColors.brown,
                    accentBg: const Color(0x14352214),
                  ),
                  StatCard(
                    icon: Icons.menu_book_outlined,
                    label: 'Active Borrowings',
                    value: s.activeBorrowings.toString(),
                    accentColor: SifraColors.gold,
                    accentBg: const Color(0x1AD4A359),
                  ),
                  StatCard(
                    icon: Icons.warning_amber_outlined,
                    label: 'Low Stock Alerts',
                    value: s.lowStockAlerts.toString(),
                    accentColor: s.lowStockAlerts > 0
                        ? SifraColors.danger
                        : SifraColors.muted,
                    accentBg: s.lowStockAlerts > 0
                        ? const Color(0x14C65911)
                        : const Color(0x14706F6F),
                    danger: s.lowStockAlerts > 0,
                  ),
                ],
              ),

              const SizedBox(height: 28),
              Text(
                'Quick Access',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 14),

              QuickActionCard(
                icon: Icons.coffee_outlined,
                label: 'Open Café POS',
                description: 'Process orders at the café counter',
                onTap: () => context.go('/pos'),
              ),
              const SizedBox(height: 12),
              QuickActionCard(
                icon: Icons.swap_horiz,
                label: 'Checkout Desk',
                description: 'Manage book check-in and check-out',
                onTap: () => context.go('/borrowings'),
              ),
              const SizedBox(height: 12),
              QuickActionCard(
                icon: Icons.local_library_outlined,
                label: 'Library Catalog',
                description: 'Browse and manage the book collection',
                onTap: () => context.go('/books'),
              ),
            ],
          );
        },
      ),
    );
  }

  String _fmt(double v) {
    if (v == v.roundToDouble()) return v.toInt().toString();
    return v.toStringAsFixed(2);
  }
}
