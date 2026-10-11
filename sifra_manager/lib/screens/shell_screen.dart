import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../core/auth_service.dart';
import '../theme/sifra_theme.dart';

class _NavItem {
  final String path;
  final String label;
  final IconData icon;
  const _NavItem(this.path, this.label, this.icon);
}

const _items = <_NavItem>[
  _NavItem('/', 'Overview', Icons.dashboard_outlined),
  _NavItem('/pos', 'Café POS', Icons.coffee_outlined),
  _NavItem('/menu-items', 'Menu Items', Icons.restaurant_menu),
  _NavItem('/inventory', 'Inventory', Icons.inventory_2_outlined),
  _NavItem('/orders', 'Orders History', Icons.receipt_long_outlined),
  _NavItem('/books', 'Library Books', Icons.menu_book_outlined),
  _NavItem('/borrowings', 'Borrowings', Icons.swap_horiz),
  _NavItem('/events', 'Events', Icons.calendar_today_outlined),
  _NavItem('/reports', 'Reports', Icons.bar_chart),
];

class ShellScreen extends StatelessWidget {
  final Widget child;
  const ShellScreen({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final auth = context.watch<AuthService>();

    return Scaffold(
      backgroundColor: SifraColors.cream,
      appBar: AppBar(
        backgroundColor: SifraColors.brown,
        foregroundColor: Colors.white,
        titleSpacing: 16,
        title: Row(
          children: [
            Text(
              'Sifra',
              style: TextStyle(
                fontFamily: Theme.of(
                  context,
                ).textTheme.displaySmall?.fontFamily,
                color: SifraColors.gold,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'Manager',
              style: TextStyle(
                color: Colors.white54,
                fontSize: 11,
                letterSpacing: 1.5,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Sign out',
            icon: const Icon(Icons.logout, size: 20),
            onPressed: () async {
              await auth.logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
      drawer: Drawer(
        backgroundColor: SifraColors.brown,
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Sifra',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(color: SifraColors.gold),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'MANAGER DASHBOARD',
                      style: TextStyle(
                        color: Colors.white38,
                        fontSize: 10,
                        letterSpacing: 2,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  children: _items.map((item) {
                    final selected =
                        location == item.path ||
                        (item.path != '/' && location.startsWith(item.path));
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      child: ListTile(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        selected: selected,
                        selectedTileColor: SifraColors.gold.withValues(
                          alpha: 0.15,
                        ),
                        leading: Icon(
                          item.icon,
                          size: 20,
                          color: selected ? SifraColors.gold : Colors.white70,
                        ),
                        title: Text(
                          item.label,
                          style: TextStyle(
                            color: selected ? SifraColors.gold : Colors.white70,
                            fontSize: 14,
                            fontWeight: selected
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          context.go(item.path);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
              const Divider(color: Colors.white12, height: 1),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(
                      Icons.person_outline,
                      color: Colors.white54,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        auth.user?.name ?? '',
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      body: child,
    );
  }
}
