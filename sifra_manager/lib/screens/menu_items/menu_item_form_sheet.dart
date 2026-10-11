import 'package:flutter/material.dart';
import '../../models/menu_product.dart';
import '../../theme/sifra_theme.dart';

class MenuItemFormSheet extends StatefulWidget {
  final MenuProduct? existing; // null = create mode
  const MenuItemFormSheet({super.key, this.existing});

  @override
  State<MenuItemFormSheet> createState() => _MenuItemFormSheetState();
}

class _MenuItemFormSheetState extends State<MenuItemFormSheet> {
  late final TextEditingController _nameCtrl;
  late final TextEditingController _descCtrl;
  late final TextEditingController _priceCtrl;
  late String _status;
  final _formKey = GlobalKey<FormState>();

  bool get isEdit => widget.existing != null;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.existing?.productName ?? '');
    _descCtrl = TextEditingController(text: widget.existing?.description ?? '');
    _priceCtrl = TextEditingController(
      text: widget.existing != null
          ? widget.existing!.sellingPrice.toStringAsFixed(0)
          : '',
    );
    _status = widget.existing?.status ?? 'Available';
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    _priceCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final price = double.parse(_priceCtrl.text.trim());
    Navigator.pop(context, {
      'name': _nameCtrl.text.trim(),
      'description': _descCtrl.text.trim().isEmpty
          ? null
          : _descCtrl.text.trim(),
      'price': price,
      'status': _status,
    });
  }

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width >= 600;
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
        decoration: const BoxDecoration(
          color: SifraColors.cream,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
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
                Text(
                  isEdit ? 'Edit Menu Item' : 'Add Menu Item',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 20),
                _field(
                  controller: _nameCtrl,
                  label: 'Item Name',
                  hint: 'e.g. Ethiopian Specialty Macchiato',
                  required: true,
                ),
                const SizedBox(height: 14),
                _field(
                  controller: _descCtrl,
                  label: 'Description',
                  hint: 'Freshly brewed espresso with steamed milk...',
                  multiline: true,
                ),
                const SizedBox(height: 14),
                _field(
                  controller: _priceCtrl,
                  label: 'Price (ETB)',
                  hint: '85',
                  required: true,
                  numeric: true,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Price required';
                    final n = double.tryParse(v.trim());
                    if (n == null) return 'Enter a valid number';
                    if (n <= 0) return 'Price must be greater than 0';
                    return null;
                  },
                ),
                if (isEdit) ...[
                  const SizedBox(height: 14),
                  DropdownButtonFormField<String>(
                    value: _status,
                    decoration: const InputDecoration(labelText: 'Status'),
                    items: const [
                      DropdownMenuItem(
                        value: 'Available',
                        child: Text('Available'),
                      ),
                      DropdownMenuItem(
                        value: 'Unavailable',
                        child: Text('Unavailable'),
                      ),
                    ],
                    onChanged: (v) =>
                        setState(() => _status = v ?? 'Available'),
                  ),
                ],
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(context),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          side: const BorderSide(color: SifraColors.border),
                          foregroundColor: SifraColors.muted,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Cancel'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: FilledButton(
                        onPressed: _submit,
                        child: Text(isEdit ? 'Update Item' : 'Save Item'),
                      ),
                    ),
                  ],
                ),
                if (!isWide) const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _field({
    required TextEditingController controller,
    required String label,
    String? hint,
    bool required = false,
    bool multiline = false,
    bool numeric = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: multiline ? 3 : 1,
      keyboardType: numeric
          ? const TextInputType.numberWithOptions(decimal: true)
          : TextInputType.text,
      decoration: InputDecoration(labelText: label, hintText: hint),
      validator:
          validator ??
          (required
              ? (v) =>
                    (v == null || v.trim().isEmpty) ? '$label required' : null
              : null),
    );
  }
}
