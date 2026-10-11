import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/inventory_service.dart';
import '../../models/inventory_item.dart';
import '../../theme/sifra_theme.dart';
import 'inventory_item_card.dart';
import 'inventory_sheets.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  bool _loading = true;
  String? _error;
  List<InventoryItem> _items = [];

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
      final items = await InventoryService.list();
      if (!mounted) return;
      setState(() {
        _items = items;
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

  Future<void> _openCreate() async {
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const InventoryCreateSheet(),
    );
    if (result == null) return;
    try {
      await InventoryService.create(
        name: result['name'] as String,
        unit: result['unit'] as String,
        stock: result['stock'] as int,
      );
      _toast('Inventory item created successfully!', success: true);
      await _load();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to create inventory item');
    }
  }

  Future<void> _openRestock(InventoryItem item) async {
    final amount = await showModalBottomSheet<int>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => InventoryRestockSheet(item: item),
    );
    if (amount == null) return;
    try {
      await InventoryService.restock(id: item.id, amount: amount);
      _toast('Inventory restocked successfully!', success: true);
      await _load();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to restock inventory');
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
          Text('Inventory', style: Theme.of(context).textTheme.displaySmall),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: _openCreate,
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Add Inventory Item'),
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 16),
          if (_items.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 60),
              child: Center(
                child: Text(
                  'No inventory items found.',
                  style: TextStyle(color: SifraColors.muted, fontSize: 13),
                ),
              ),
            )
          else
            ..._items.map(
              (item) => InventoryItemCard(
                item: item,
                onRestock: () => _openRestock(item),
              ),
            ),
        ],
      ),
    );
  }
}
