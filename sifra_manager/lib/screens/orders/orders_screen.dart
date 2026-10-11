import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/orders_service.dart';
import '../../models/order_history.dart';
import '../../theme/sifra_theme.dart';
import 'order_history_card.dart';

enum DateFilter { all, today, week, month }

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  bool _loading = true;
  String? _error;
  List<OrderHistory> _all = [];
  DateFilter _filter = DateFilter.all;

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
      final orders = await OrdersService.list();
      if (!mounted) return;
      setState(() {
        _all = orders;
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

  /// Filter in memory — backend untouched (Option B)
  List<OrderHistory> get _filtered {
    if (_filter == DateFilter.all) return _all;
    final now = DateTime.now();
    DateTime start;
    switch (_filter) {
      case DateFilter.today:
        start = DateTime(now.year, now.month, now.day);
        break;
      case DateFilter.week:
        // Monday as start of week
        final monday = now.subtract(Duration(days: now.weekday - 1));
        start = DateTime(monday.year, monday.month, monday.day);
        break;
      case DateFilter.month:
        start = DateTime(now.year, now.month, 1);
        break;
      case DateFilter.all:
        return _all;
    }
    return _all.where((o) => !o.orderDate.isBefore(start)).toList();
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
    final orders = _filtered;
    return RefreshIndicator(
      onRefresh: _load,
      color: SifraColors.gold,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        children: [
          Text(
            'Café Order History',
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(height: 4),
          const Text(
            'All-time record of café orders processed.',
            style: TextStyle(color: SifraColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 16),

          // Filter segment
          _filterBar(),

          const SizedBox(height: 16),

          if (orders.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 60),
              child: Center(
                child: Text(
                  _all.isEmpty
                      ? 'No orders found.'
                      : 'No orders in this period.',
                  style: const TextStyle(
                    color: SifraColors.muted,
                    fontSize: 13,
                  ),
                ),
              ),
            )
          else
            ...orders.map((o) => OrderHistoryCard(order: o)),
        ],
      ),
    );
  }

  Widget _filterBar() {
    return Container(
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: SifraColors.border),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: [
          _filterBtn('All', DateFilter.all),
          _filterBtn('Today', DateFilter.today),
          _filterBtn('Week', DateFilter.week),
          _filterBtn('Month', DateFilter.month),
        ],
      ),
    );
  }

  Widget _filterBtn(String label, DateFilter f) {
    final selected = _filter == f;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _filter = f),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? SifraColors.brown : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected ? Colors.white : SifraColors.brown,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }
}
