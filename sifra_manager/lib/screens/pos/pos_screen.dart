import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/pos_service.dart';
import '../../models/menu_product.dart';
import '../../models/pending_order.dart';
import '../../theme/sifra_theme.dart';
import 'pos_orders_panel.dart';
import 'pos_menu_panel.dart';
import 'pos_cart_panel.dart';

enum PosTab { orders, menu, cart }

class PosScreen extends StatefulWidget {
  const PosScreen({super.key});

  @override
  State<PosScreen> createState() => _PosScreenState();
}

class _PosScreenState extends State<PosScreen> {
  bool _loading = true;
  String? _error;

  List<MenuProduct> _products = [];
  List<PendingOrder> _orders = [];
  PendingOrder? _active;

  PosTab _tab = PosTab.menu;

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait([
        PosService.loadProducts(),
        PosService.loadPendingOrders(),
      ]);
      if (!mounted) return;
      setState(() {
        _products = results[0] as List<MenuProduct>;
        _orders = results[1] as List<PendingOrder>;
        // Re-resolve active order (may have been updated)
        if (_active != null) {
          _active = _orders.firstWhere(
            (o) => o.orderId == _active!.orderId,
            orElse: () => _active!,
          );
        }
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

  Future<void> _selectOrder(PendingOrder o) async {
    setState(() {
      _active = o;
      _tab = PosTab.menu;
    });
  }

  Future<void> _createOrder(String name) async {
    try {
      final created = await PosService.createOrder(name);
      if (!mounted) return;
      setState(() {
        _orders = [..._orders, created];
        _active = created;
        _tab = PosTab.menu;
      });
      _toast('Order created', success: true);
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to create order');
    }
  }

  Future<void> _addProduct(MenuProduct p) async {
    if (_active == null) {
      _toast('Please select or create an order first');
      setState(() => _tab = PosTab.orders);
      return;
    }
    final current = List<PendingOrderItem>.from(_active!.items);
    final existingIdx = current.indexWhere((i) => i.productId == p.productId);
    if (existingIdx >= 0) {
      final old = current[existingIdx];
      current[existingIdx] = PendingOrderItem(
        productId: old.productId,
        quantity: old.quantity + 1,
        unitPrice: old.unitPrice,
        product: old.product,
      );
    } else {
      current.add(
        PendingOrderItem(
          productId: p.productId,
          quantity: 1,
          unitPrice: p.sellingPrice,
          product: p,
        ),
      );
    }
    await _syncItems(current);
  }

  Future<void> _removeProduct(String productId) async {
    if (_active == null) return;
    final current = _active!.items
        .where((i) => i.productId != productId)
        .toList();
    await _syncItems(current);
  }

  Future<void> _syncItems(List<PendingOrderItem> items) async {
    try {
      final updated = await PosService.updateOrderItems(
        orderId: _active!.orderId,
        items: items,
      );
      if (!mounted) return;
      setState(() {
        _active = updated;
        _orders = _orders
            .map((o) => o.orderId == updated.orderId ? updated : o)
            .toList();
      });
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to update order');
    }
  }

  Future<void> _checkout() async {
    if (_active == null || _active!.items.isEmpty) return;
    final confirm = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _CashCheckoutSheet(total: _active!.totalAmount),
    );
    if (confirm != true) return;
    try {
      await PosService.checkoutCash(_active!.orderId);
      if (!mounted) return;
      _toast('Order paid successfully', success: true);
      setState(() {
        _active = null;
        _tab = PosTab.orders;
      });
      await _loadAll();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Checkout failed');
    }
  }

  void _toast(String msg, {bool success = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: success ? Colors.green.shade700 : SifraColors.danger,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: SifraColors.gold),
      );
    }
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 48, color: SifraColors.muted),
              const SizedBox(height: 12),
              Text(_error!, style: const TextStyle(color: SifraColors.muted)),
              const SizedBox(height: 16),
              OutlinedButton(onPressed: _loadAll, child: const Text('Retry')),
            ],
          ),
        ),
      );
    }

    return Column(
      children: [
        // Segmented tab bar
        Container(
          color: SifraColors.cream,
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
          child: Container(
            decoration: BoxDecoration(
              color: SifraColors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: SifraColors.border),
            ),
            padding: const EdgeInsets.all(4),
            child: Row(
              children: [
                _tabButton(
                  label: 'Orders (${_orders.length})',
                  tab: PosTab.orders,
                ),
                _tabButton(
                  label: 'Menu (${_products.length})',
                  tab: PosTab.menu,
                ),
                _tabButton(
                  label: 'Cart (${_active?.items.length ?? 0})',
                  tab: PosTab.cart,
                ),
              ],
            ),
          ),
        ),

        Expanded(
          child: IndexedStack(
            index: _tab.index,
            children: [
              PosOrdersPanel(
                orders: _orders,
                activeId: _active?.orderId,
                onSelect: _selectOrder,
                onCreate: _createOrder,
                onRefresh: _loadAll,
              ),
              PosMenuPanel(
                products: _products,
                activeOrderName: _active?.displayName,
                onAdd: _addProduct,
                onOpenCart: () => setState(() => _tab = PosTab.cart),
              ),
              PosCartPanel(
                order: _active,
                onRemove: _removeProduct,
                onCheckout: _checkout,
                onBrowseMenu: () => setState(() => _tab = PosTab.menu),
                onCreate: () => setState(() => _tab = PosTab.orders),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _tabButton({required String label, required PosTab tab}) {
    final selected = _tab == tab;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _tab = tab),
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

class _CashCheckoutSheet extends StatelessWidget {
  final double total;
  const _CashCheckoutSheet({required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Complete Payment',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Total: ${total.toStringAsFixed(0)} ETB',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: SifraColors.gold,
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Confirm Cash Received'),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text(
              'Cancel',
              style: TextStyle(color: SifraColors.muted),
            ),
          ),
        ],
      ),
    );
  }
}
