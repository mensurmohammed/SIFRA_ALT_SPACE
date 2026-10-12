import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/reports_service.dart';
import '../../models/report.dart';
import '../../models/order_history.dart';
import '../../models/borrowing.dart';
import '../../models/inventory_item.dart';
import '../../models/event.dart';
import '../../theme/sifra_theme.dart';
import 'csv_export_helper.dart';
import 'report_metric_card.dart';
import 'reports_tabs.dart';

enum _Range { all, today, week, month }
enum _Tab { overview, sales, borrowings, inventory, events }

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  bool _loading = true;
  String? _error;
  ReportData? _data;

  _Range _range = _Range.all;
  _Tab _tab = _Tab.overview;
  String _search = '';

  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
    _searchCtrl.addListener(
      () => setState(() => _search = _searchCtrl.text.trim().toLowerCase()),
    );
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final d = await ReportsService.fetch();
      if (!mounted) return;
      setState(() {
        _data = d;
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

  // ---- Time filter (rolling windows, matching website) ----
  bool _inRange(DateTime? d) {
    if (_range == _Range.all || d == null) return true;
    final now = DateTime.now();
    switch (_range) {
      case _Range.today:
        return d.year == now.year && d.month == now.month && d.day == now.day;
      case _Range.week:
        return d.isAfter(now.subtract(const Duration(days: 7)));
      case _Range.month:
        return d.isAfter(DateTime(now.year, now.month - 1, now.day));
      case _Range.all:
        return true;
    }
  }

  List<OrderHistory> get _filteredOrders {
    if (_data == null) return [];
    return _data!.orders.where((o) {
      if (!_inRange(o.orderDate)) return false;
      if (_search.isEmpty) return true;
      return (o.orderName ?? '').toLowerCase().contains(_search) ||
          o.orderId.toLowerCase().contains(_search) ||
          o.status.toLowerCase().contains(_search);
    }).toList();
  }

  List<Borrowing> get _filteredBorrowings {
    if (_data == null) return [];
    return _data!.borrowings.where((b) {
      if (!_inRange(b.borrowedAt)) return false;
      if (_search.isEmpty) return true;
      final name = b.customerDisplay.toLowerCase();
      final title = b.copy.book.title.toLowerCase();
      return name.contains(_search) ||
          title.contains(_search) ||
          b.status.toLowerCase().contains(_search);
    }).toList();
  }

  List<InventoryItem> get _filteredInventory {
    if (_data == null) return [];
    return _data!.inventory.where((i) {
      if (_search.isEmpty) return true;
      return i.name.toLowerCase().contains(_search) ||
          'general'.contains(_search);
    }).toList();
  }

  List<Event> get _filteredEvents {
    if (_data == null) return [];
    return _data!.events.where((e) {
      if (!_inRange(e.eventDate)) return false;
      if (_search.isEmpty) return true;
      return e.title.toLowerCase().contains(_search) ||
          e.status.toLowerCase().contains(_search);
    }).toList();
  }

  // ---- Metrics ----
  double get _totalRevenue =>
      _filteredOrders.fold(0.0, (s, o) => s + o.totalAmount);

  int get _avgOrderValue => _filteredOrders.isEmpty
      ? 0
      : (_totalRevenue / _filteredOrders.length).round();

  int get _activeBorrowings =>
      _filteredBorrowings.where((b) => b.status == 'Active').length;

  int get _lowStockCount =>
      (_data?.inventory ?? []).where((i) => i.currentStock < 20).length;

  int get _eventAttendees => _filteredEvents.fold(
      0, (s, e) => s + e.activeRegistrations);

  String get _rangeLabel => switch (_range) {
        _Range.all => 'All Time',
        _Range.today => 'Today',
        _Range.week => 'This Week',
        _Range.month => 'This Month',
      };

  Future<void> _export() async {
    final d = _data;
    if (d == null) return;
    try {
      switch (_tab) {
        case _Tab.sales:
          await CsvExportHelper.exportSales(d, _filteredOrders);
          break;
        case _Tab.borrowings:
          await CsvExportHelper.exportBorrowings(d, _filteredBorrowings);
          break;
        case _Tab.inventory:
          await CsvExportHelper.exportInventory(d);
          break;
        case _Tab.overview:
        case _Tab.events:
          await CsvExportHelper.exportSales(d, _filteredOrders);
          break;
      }
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Failed to export CSV'),
        backgroundColor: SifraColors.danger,
        behavior: SnackBarBehavior.floating,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SifraColors.cream,
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: SifraColors.gold))
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
              Text(_error!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: SifraColors.muted)),
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
          Text('Manager Reports & Analytics',
              style: Theme.of(context).textTheme.displaySmall),
          const SizedBox(height: 4),
          const Text(
            'Operational analytics for café sales, library borrowings, inventory health, and events.',
            style: TextStyle(color: SifraColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 16),

          // Range filter row
          Row(
            children: [
              Expanded(child: _rangeBar()),
              const SizedBox(width: 8),
              IconButton(
                onPressed: _load,
                icon: const Icon(Icons.refresh, color: SifraColors.gold),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Metric cards — 2 columns
          GridView(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              mainAxisExtent: 118,
            ),
            children: [
              ReportMetricCard(
                label: 'Total Revenue',
                value: '${_totalRevenue.toStringAsFixed(0)} ETB',
                subtitle:
                    '${_filteredOrders.length} orders (Avg: $_avgOrderValue ETB)',
                icon: Icons.trending_up,
                iconColor: const Color(0xFF385723),
                iconBg: const Color(0xFFE2F0D9),
              ),
              ReportMetricCard(
                label: 'Active Borrowings',
                value: '$_activeBorrowings',
                subtitle: 'All active borrowings on schedule',
                icon: Icons.menu_book_outlined,
                iconColor: SifraColors.gold,
                iconBg: SifraColors.gold.withValues(alpha: 0.15),
              ),
              ReportMetricCard(
                label: 'Low Stock Alerts',
                value: '$_lowStockCount Items',
                subtitle: _lowStockCount > 0
                    ? 'Items require inventory restock'
                    : 'All inventory levels healthy',
                icon: Icons.warning_amber_outlined,
                iconColor:
                    _lowStockCount > 0 ? SifraColors.danger : SifraColors.muted,
                iconBg: _lowStockCount > 0
                    ? SifraColors.danger.withValues(alpha: 0.12)
                    : const Color(0x14706F6F),
                danger: _lowStockCount > 0,
              ),
              ReportMetricCard(
                label: 'Event Attendees',
                value: '$_eventAttendees',
                subtitle: 'Across ${_filteredEvents.length} events',
                icon: Icons.calendar_today_outlined,
                iconColor: SifraColors.brown,
                iconBg: const Color(0x14352214),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Tabs
          _tabBar(),
          const SizedBox(height: 12),

          // Search + Export row
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchCtrl,
                  decoration: const InputDecoration(
                    hintText: 'Search report data...',
                    prefixIcon: Icon(Icons.search, size: 18),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              FilledButton.icon(
                onPressed: _export,
                icon: const Icon(Icons.download, size: 16),
                label: const Text('Export',
                    style: TextStyle(fontSize: 12)),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Tab content
          _tabContent(),
        ],
      ),
    );
  }

  Widget _rangeBar() {
    return Container(
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: SifraColors.border),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: [
          _rangeBtn('All', _Range.all),
          _rangeBtn('Today', _Range.today),
          _rangeBtn('Week', _Range.week),
          _rangeBtn('Month', _Range.month),
        ],
      ),
    );
  }

  Widget _rangeBtn(String label, _Range r) {
    final selected = _range == r;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _range = r),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: selected ? SifraColors.brown : Colors.transparent,
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected ? Colors.white : SifraColors.brown,
              fontWeight: FontWeight.w600,
              fontSize: 11,
            ),
          ),
        ),
      ),
    );
  }

  Widget _tabBar() {
    final tabs = [
      (_Tab.overview, 'Overview', Icons.inventory_2_outlined),
      (_Tab.sales, 'Café Sales', Icons.coffee_outlined),
      (_Tab.borrowings, 'Borrowings', Icons.menu_book_outlined),
      (_Tab.inventory, 'Inventory', Icons.warning_amber_outlined),
      (_Tab.events, 'Events', Icons.calendar_today_outlined),
    ];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: tabs.map((t) {
          final selected = _tab == t.$1;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => setState(() => _tab = t.$1),
              child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: selected ? SifraColors.gold : Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: selected
                          ? SifraColors.gold
                          : SifraColors.border),
                ),
                child: Row(
                  children: [
                    Icon(t.$3,
                        size: 14,
                        color: selected ? Colors.white : SifraColors.muted),
                    const SizedBox(width: 6),
                    Text(
                      t.$2,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: selected ? Colors.white : SifraColors.muted,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _tabContent() {
    switch (_tab) {
      case _Tab.overview:
        return ReportsOverviewTab(
          orders: _filteredOrders,
          borrowings: _filteredBorrowings,
          onViewAllOrders: () => setState(() => _tab = _Tab.sales),
          onViewAllBorrowings: () => setState(() => _tab = _Tab.borrowings),
        );
      case _Tab.sales:
        return ReportsSalesTab(orders: _filteredOrders);
      case _Tab.borrowings:
        return ReportsBorrowingsTab(borrowings: _filteredBorrowings);
      case _Tab.inventory:
        return ReportsInventoryTab(inventory: _filteredInventory);
      case _Tab.events:
        return ReportsEventsTab(events: _filteredEvents);
    }
  }
}