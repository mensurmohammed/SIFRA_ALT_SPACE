import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/borrowings_service.dart';
import '../../models/borrowing.dart';
import '../../theme/sifra_theme.dart';
import 'borrowing_card.dart';

class BorrowingsScreen extends StatefulWidget {
  const BorrowingsScreen({super.key});

  @override
  State<BorrowingsScreen> createState() => _BorrowingsScreenState();
}

class _BorrowingsScreenState extends State<BorrowingsScreen> {
  bool _loading = true;
  String? _error;
  List<Borrowing> _borrowings = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final list = await BorrowingsService.list();
      if (!mounted) return;
      setState(() {
        _borrowings = list;
        _loading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Network error. Check your connection.';
        _loading = false;
      });
    }
  }

  void _openNewBorrowing() {
    // 07b will replace this placeholder with the real New Borrowing flow
    context.go('/borrowings/new');
  }

  void _openReturn(Borrowing b) {
    context.go('/borrowings/${b.borrowingId}/return', extra: b);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SifraColors.cream,
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: SifraColors.gold),
            )
          : _error != null
          ? _errorView()
          : _body(),
    );
  }

  Widget _errorView() => Center(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.cloud_off, size: 48, color: SifraColors.muted),
          const SizedBox(height: 12),
          Text(
            _error!,
            textAlign: TextAlign.center,
            style: const TextStyle(color: SifraColors.muted),
          ),
          const SizedBox(height: 16),
          OutlinedButton(onPressed: _load, child: const Text('Retry')),
        ],
      ),
    ),
  );

  Widget _body() {
    return RefreshIndicator(
      onRefresh: _load,
      color: SifraColors.gold,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        children: [
          Text(
            'Checkout Desk',
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(height: 4),
          const Text(
            'Manage book borrowings and returns.',
            style: TextStyle(color: SifraColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 16),

          FilledButton.icon(
            onPressed: _openNewBorrowing,
            icon: const Icon(Icons.swap_horiz, size: 18),
            label: const Text('New Borrowing'),
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 16),

          if (_borrowings.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 60),
              child: Column(
                children: [
                  Icon(
                    Icons.menu_book_outlined,
                    size: 48,
                    color: SifraColors.border,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'No borrowing records found.',
                    style: TextStyle(color: SifraColors.muted, fontSize: 13),
                  ),
                ],
              ),
            )
          else
            ..._borrowings.map(
              (b) =>
                  BorrowingCard(borrowing: b, onReturn: () => _openReturn(b)),
            ),
        ],
      ),
    );
  }
}
