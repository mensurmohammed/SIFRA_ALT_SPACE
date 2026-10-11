import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'screens/books/edit_book_screen.dart';

import 'core/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/overview_screen.dart';
import 'screens/placeholder_screen.dart';
import 'screens/shell_screen.dart';
import 'screens/menu_items/menu_items_screen.dart';
import 'theme/sifra_theme.dart';
import 'screens/pos/pos_screen.dart';
import 'screens/inventory/inventory_screen.dart';
import 'screens/orders/orders_screen.dart';
import 'screens/books/books_screen.dart';
// import 'screens/books/add_book_placeholder.dart'; // small helper — see below
// import 'screens/books/edit_book_placeholder.dart';
import 'screens/books/add_book_screen.dart';

void main() {
  runApp(const SifraApp());
}

class SifraApp extends StatelessWidget {
  const SifraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthService(),
      child: const _Root(),
    );
  }
}

class _BookAddPlaceholder extends StatelessWidget {
  const _BookAddPlaceholder();
  @override
  Widget build(BuildContext context) =>
      const PlaceholderScreen(title: 'Add Book');
}

class _BookEditPlaceholder extends StatelessWidget {
  const _BookEditPlaceholder();
  @override
  Widget build(BuildContext context) =>
      const PlaceholderScreen(title: 'Edit Book');
}

class _Root extends StatefulWidget {
  const _Root();
  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  late final GoRouter _router;
  bool _bootstrapping = true;

  @override
  void initState() {
    super.initState();
    _router = _buildRouter();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await context.read<AuthService>().tryRestoreSession();
    if (mounted) setState(() => _bootstrapping = false);
  }

  GoRouter _buildRouter() {
    return GoRouter(
      initialLocation: '/',
      refreshListenable: context.read<AuthService>(),
      redirect: (context, state) {
        if (_bootstrapping) return null;
        final auth = context.read<AuthService>();
        final loggingIn = state.uri.path == '/login';
        if (!auth.isAuthenticated && !loggingIn) return '/login';
        if (auth.isAuthenticated && loggingIn) return '/';
        return null;
      },
      routes: [
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
        ShellRoute(
          builder: (context, state, child) => ShellScreen(child: child),
          routes: [
            GoRoute(path: '/', builder: (_, __) => const OverviewScreen()),
            GoRoute(path: '/pos', builder: (_, __) => const PosScreen()),
            GoRoute(
              path: '/menu-items',
              builder: (_, __) => const MenuItemsScreen(),
            ),
            GoRoute(
              path: '/inventory',
              builder: (_, __) => const InventoryScreen(),
            ),
            GoRoute(path: '/orders', builder: (_, __) => const OrdersScreen()),
            GoRoute(path: '/books', builder: (_, __) => const BooksScreen()),
            GoRoute(
              path: '/books/add',
              builder: (_, __) => const AddBookScreen(),
            ),
            GoRoute(
              path: '/books/:id',
              builder: (_, state) =>
                  EditBookScreen(bookId: state.pathParameters['id']!),
            ),
            GoRoute(
              path: '/borrowings',
              builder: (_, __) => const PlaceholderScreen(title: 'Borrowings'),
            ),
            GoRoute(
              path: '/events',
              builder: (_, __) => const PlaceholderScreen(title: 'Events'),
            ),
            GoRoute(
              path: '/reports',
              builder: (_, __) => const PlaceholderScreen(title: 'Reports'),
            ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_bootstrapping) {
      return MaterialApp(
        theme: SifraTheme.light(),
        home: const Scaffold(
          backgroundColor: SifraColors.cream,
          body: Center(
            child: CircularProgressIndicator(color: SifraColors.gold),
          ),
        ),
      );
    }
    return MaterialApp.router(
      title: 'Sifra Manager',
      debugShowCheckedModeBanner: false,
      theme: SifraTheme.light(),
      routerConfig: _router,
    );
  }
}
