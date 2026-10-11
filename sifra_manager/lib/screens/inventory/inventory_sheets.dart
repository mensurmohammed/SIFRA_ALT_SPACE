import 'package:flutter/material.dart';
import '../../models/inventory_item.dart';
import '../../theme/sifra_theme.dart';

/// ---------- Create Sheet ----------
class InventoryCreateSheet extends StatefulWidget {
  const InventoryCreateSheet({super.key});

  @override
  State<InventoryCreateSheet> createState() => _InventoryCreateSheetState();
}

class _InventoryCreateSheetState extends State<InventoryCreateSheet> {
  final _nameCtrl = TextEditingController();
  final _unitCtrl = TextEditingController(text: 'units');
  final _stockCtrl = TextEditingController(text: '0');
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _unitCtrl.dispose();
    _stockCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.pop(context, {
      'name': _nameCtrl.text.trim(),
      'unit': _unitCtrl.text.trim().isEmpty ? 'units' : _unitCtrl.text.trim(),
      'stock': int.parse(_stockCtrl.text.trim()),
    });
  }

  @override
  Widget build(BuildContext context) {
    return _sheetWrapper(
      context,
      title: 'New Inventory Item',
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(labelText: 'Item Name'),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Name required' : null,
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _unitCtrl,
              decoration: const InputDecoration(
                labelText: 'Unit',
                helperText: 'e.g. kg, units, pieces, bags',
              ),
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _stockCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Initial Stock'),
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Stock required';
                final n = int.tryParse(v.trim());
                if (n == null) return 'Enter a whole number';
                if (n < 0) return 'Cannot be negative';
                return null;
              },
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: _cancelStyle(),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _submit,
                    child: const Text('Save'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- Restock Sheet ----------
class InventoryRestockSheet extends StatefulWidget {
  final InventoryItem item;
  const InventoryRestockSheet({super.key, required this.item});

  @override
  State<InventoryRestockSheet> createState() => _InventoryRestockSheetState();
}

class _InventoryRestockSheetState extends State<InventoryRestockSheet> {
  final _amountCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.pop(context, int.parse(_amountCtrl.text.trim()));
  }

  @override
  Widget build(BuildContext context) {
    return _sheetWrapper(
      context,
      title: 'Restock Inventory',
      subtitle: widget.item.name,
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: _amountCtrl,
              autofocus: true,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Amount to Add'),
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Amount required';
                final n = int.tryParse(v.trim());
                if (n == null) return 'Enter a whole number';
                if (n <= 0) return 'Must be greater than 0';
                return null;
              },
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: _cancelStyle(),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _submit,
                    child: const Text('Restock'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- Shared helpers ----------
Widget _sheetWrapper(
  BuildContext context, {
  required String title,
  String? subtitle,
  required Widget child,
}) {
  return Padding(
    padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
    child: Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
      decoration: const BoxDecoration(
        color: SifraColors.cream,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: SifraColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Text(title, style: Theme.of(context).textTheme.headlineSmall),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  color: SifraColors.brown,
                  fontSize: 14,
                ),
              ),
            ],
            const SizedBox(height: 20),
            child,
          ],
        ),
      ),
    ),
  );
}

ButtonStyle _cancelStyle() => OutlinedButton.styleFrom(
  padding: const EdgeInsets.symmetric(vertical: 14),
  side: const BorderSide(color: SifraColors.border),
  foregroundColor: SifraColors.muted,
  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
);
