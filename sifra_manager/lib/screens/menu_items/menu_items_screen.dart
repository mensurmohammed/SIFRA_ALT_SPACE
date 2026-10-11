import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/menu_items_service.dart';
import '../../models/menu_product.dart';
import '../../theme/sifra_theme.dart';
import 'menu_item_card.dart';
import 'menu_item_form_sheet.dart';

class MenuItemsScreen extends StatefulWidget {
  const MenuItemsScreen({super.key});

  @override
  State<MenuItemsScreen> createState() => _MenuItemsScreenState();
}

class _MenuItemsScreenState extends State<MenuItemsScreen> {
  bool _loading = true;
  String? _error;
  List<MenuProduct> _items = [];

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
      final items = await MenuItemsService.list();
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
      builder: (_) => const MenuItemFormSheet(),
    );
    if (result == null) return;
    try {
      await MenuItemsService.create(
        name: result['name'] as String,
        description: result['description'] as String?,
        price: result['price'] as double,
        status: 'Available',
      );
      _toast('Menu item created successfully!', success: true);
      await _load();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to create menu item');
    }
  }

  Future<void> _openEdit(MenuProduct item) async {
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => MenuItemFormSheet(existing: item),
    );
    if (result == null) return;
    try {
      await MenuItemsService.update(
        id: item.productId,
        name: result['name'] as String,
        description: result['description'] as String?,
        price: result['price'] as double,
        status: result['status'] as String,
      );
      _toast('Menu item updated successfully!', success: true);
      await _load();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to update menu item');
    }
  }

  Future<void> _confirmDelete(MenuProduct item) async {
    final yes = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: SifraColors.white,
        title: const Text('Delete menu item?'),
        content: Text(
          'Are you sure you want to delete "${item.productName}"?',
          style: const TextStyle(fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(backgroundColor: SifraColors.danger),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (yes != true) return;
    try {
      await MenuItemsService.delete(item.productId);
      _toast('Menu item deleted successfully!', success: true);
      await _load();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to delete menu item');
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

  Widget _errorView() {
    return Center(
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
  }

  Widget _body() {
    return RefreshIndicator(
      onRefresh: _load,
      color: SifraColors.gold,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        children: [
          Text('Menu Items', style: Theme.of(context).textTheme.displaySmall),
          const SizedBox(height: 4),
          const Text(
            'Manage food, beverages, and pricing for Sifra Café',
            style: TextStyle(color: SifraColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: _openCreate,
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Add Menu Item'),
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
                  'No menu items found.',
                  style: TextStyle(color: SifraColors.muted, fontSize: 13),
                ),
              ),
            )
          else
            ..._items.map(
              (item) => MenuItemCard(
                item: item,
                onEdit: () => _openEdit(item),
                onDelete: () => _confirmDelete(item),
              ),
            ),
        ],
      ),
    );
  }
}
