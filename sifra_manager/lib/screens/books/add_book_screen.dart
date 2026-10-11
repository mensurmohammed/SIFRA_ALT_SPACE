import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/books_service.dart';
import '../../models/category.dart';
import '../../theme/sifra_theme.dart';

class AddBookScreen extends StatefulWidget {
  const AddBookScreen({super.key});

  @override
  State<AddBookScreen> createState() => _AddBookScreenState();
}

class _AddBookScreenState extends State<AddBookScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleCtrl = TextEditingController();
  final _authorCtrl = TextEditingController();
  final _isbnCtrl = TextEditingController();
  final _yearCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _coverCtrl = TextEditingController();
  final _copiesCtrl = TextEditingController(text: '1');

  List<Category> _categories = [];
  String? _selectedCategoryId;
  bool _loadingCategories = true;

  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _authorCtrl.dispose();
    _isbnCtrl.dispose();
    _yearCtrl.dispose();
    _descCtrl.dispose();
    _coverCtrl.dispose();
    _copiesCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    try {
      final cats = await BooksService.listCategories();
      if (!mounted) return;
      setState(() {
        _categories = cats;
        _loadingCategories = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loadingCategories = false);
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await BooksService.createBook(
        title: _titleCtrl.text.trim(),
        author: _authorCtrl.text.trim(),
        isbn: _isbnCtrl.text.trim(),
        categoryId: _selectedCategoryId,
        year: _yearCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        cover: _coverCtrl.text.trim(),
        copies: int.parse(_copiesCtrl.text.trim()),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Book added successfully'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/books');
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to save book');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: SifraColors.danger,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SifraColors.cream,
      appBar: AppBar(
        backgroundColor: SifraColors.brown,
        foregroundColor: Colors.white,
        title: Text(
          'Add New Book',
          style: TextStyle(
            fontFamily: Theme.of(context).textTheme.displaySmall?.fontFamily,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            children: [
              // ---- Title ----
              _label('Title *'),
              TextFormField(
                controller: _titleCtrl,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  hintText: 'e.g. Things Fall Apart',
                ),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Title is required'
                    : null,
              ),
              const SizedBox(height: 14),

              // ---- Author ----
              _label('Author *'),
              TextFormField(
                controller: _authorCtrl,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  hintText: 'e.g. Chinua Achebe',
                ),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Author is required'
                    : null,
              ),
              const SizedBox(height: 14),

              // ---- ISBN ----
              _label('ISBN'),
              TextFormField(
                controller: _isbnCtrl,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(hintText: '978-…'),
              ),
              const SizedBox(height: 14),

              // ---- Category ----
              _label('Category'),
              _categoryField(),
              const SizedBox(height: 14),

              // ---- Publication Year ----
              _label('Publication Year'),
              TextFormField(
                controller: _yearCtrl,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(hintText: '2024'),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return null;
                  final n = int.tryParse(v.trim());
                  if (n == null) return 'Enter a valid year';
                  if (n < 1000 || n > 2100) return 'Enter a plausible year';
                  return null;
                },
              ),
              const SizedBox(height: 14),

              // ---- Number of Copies ----
              _label('Number of Copies to Generate *'),
              TextFormField(
                controller: _copiesCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(hintText: '1'),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Required';
                  final n = int.tryParse(v.trim());
                  if (n == null) return 'Enter a whole number';
                  if (n < 1) return 'At least 1';
                  if (n > 200) return 'Too many (max 200)';
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // ---- Cover image section (URL-only, B1) ----
              _coverSection(),
              const SizedBox(height: 14),

              // ---- Description ----
              _label('Description'),
              TextFormField(
                controller: _descCtrl,
                maxLines: 4,
                decoration: const InputDecoration(
                  hintText: 'Brief book synopsis, themes, or overview…',
                ),
              ),
              const SizedBox(height: 24),

              // ---- Actions ----
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _saving ? null : () => context.go('/books'),
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
                      onPressed: _saving ? null : _save,
                      child: _saving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Save Book'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _label(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Text(
      text,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        fontSize: 13,
        color: SifraColors.brown,
      ),
    ),
  );

  Widget _categoryField() {
    if (_loadingCategories) {
      return const InputDecorator(
        decoration: InputDecoration(),
        child: Row(
          children: [
            SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            SizedBox(width: 10),
            Text('Loading categories…', style: TextStyle(fontSize: 13)),
          ],
        ),
      );
    }
    if (_categories.isEmpty) {
      return const InputDecorator(
        decoration: InputDecoration(),
        child: Text(
          'No categories available',
          style: TextStyle(fontSize: 13, color: SifraColors.muted),
        ),
      );
    }
    return DropdownButtonFormField<String>(
      value: _selectedCategoryId,
      decoration: const InputDecoration(),
      hint: const Text('Select a category'),
      isExpanded: true,
      items: _categories
          .map(
            (c) => DropdownMenuItem<String>(
              value: c.categoryId,
              child: Text(
                c.categoryName,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 14),
              ),
            ),
          )
          .toList(),
      onChanged: (v) => setState(() => _selectedCategoryId = v),
    );
  }

  Widget _coverSection() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: SifraColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Book Cover Image (9:16 Portrait Ratio)',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 13,
              color: SifraColors.brown,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: SifraColors.cream,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: SifraColors.border,
                style: BorderStyle.solid,
              ),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline, size: 16, color: SifraColors.gold),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'On Android, upload file selection is not supported in this build. '
                    'Paste a cover image URL below.',
                    style: TextStyle(fontSize: 11, color: SifraColors.muted),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Or paste an external Cover Image URL',
            style: TextStyle(fontSize: 12, color: SifraColors.muted),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: _coverCtrl,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(
              hintText: 'https://images.example.com/cover.jpg',
            ),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return null;
              final u = v.trim();
              if (!u.startsWith('http://') && !u.startsWith('https://')) {
                return 'Must start with http:// or https://';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }
}
