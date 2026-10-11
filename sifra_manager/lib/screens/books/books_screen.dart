import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/books_service.dart';
import '../../models/book.dart';
import '../../theme/sifra_theme.dart';
import 'book_card.dart';
import 'books_pagination.dart';

class BooksScreen extends StatefulWidget {
  const BooksScreen({super.key});

  @override
  State<BooksScreen> createState() => _BooksScreenState();
}

class _BooksScreenState extends State<BooksScreen> {
  static const int _perPage = 20;

  bool _loading = true;
  String? _error;
  List<Book> _all = [];
  final _searchCtrl = TextEditingController();
  String _search = '';
  int _page = 1;

  @override
  void initState() {
    super.initState();
    _load();
    _searchCtrl.addListener(() {
      setState(() {
        _search = _searchCtrl.text.trim().toLowerCase();
        _page = 1;
      });
    });
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
      final books = await BooksService.list();
      if (!mounted) return;
      setState(() {
        _all = books;
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

  /// Same filter logic as the website:
  /// title, author, ISBN, category name
  List<Book> get _filtered {
    if (_search.isEmpty) return _all;
    return _all.where((b) {
      return b.title.toLowerCase().contains(_search) ||
          b.author.toLowerCase().contains(_search) ||
          (b.isbn?.toLowerCase().contains(_search) ?? false) ||
          (b.category?.categoryName.toLowerCase().contains(_search) ?? false);
    }).toList();
  }

  List<Book> get _paged {
    final f = _filtered;
    final start = (_page - 1) * _perPage;
    if (start >= f.length) return [];
    final end = (start + _perPage).clamp(0, f.length);
    return f.sublist(start, end);
  }

  int get _totalPages => (_filtered.length / _perPage).ceil();

  Future<void> _confirmDelete(Book b) async {
    final yes = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: SifraColors.white,
        title: const Text('Confirm Deletion'),
        content: Text(
          'Are you sure you want to delete "${b.title}"? This action cannot be undone.',
          style: const TextStyle(fontSize: 13),
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
      await BooksService.delete(b.bookId);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Book deleted successfully'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      await _load();
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to delete book');
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
    final pageBooks = _paged;
    return RefreshIndicator(
      onRefresh: _load,
      color: SifraColors.gold,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        children: [
          Text(
            'Book Management',
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(height: 4),
          const Text(
            "Manage the library's book catalog and copies.",
            style: TextStyle(color: SifraColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 16),

          // Add New Book button (placeholder → coming in Task 06b)
          FilledButton.icon(
            onPressed: () => context.go('/books/add'),
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Add New Book'),
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 16),

          // Search
          TextField(
            controller: _searchCtrl,
            decoration: const InputDecoration(
              hintText: 'Filter catalog by title, author, category, or ISBN...',
              prefixIcon: Icon(Icons.search, size: 20),
            ),
          ),
          const SizedBox(height: 16),

          if (pageBooks.isEmpty)
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
                  Text(
                    _all.isEmpty
                        ? 'No books found in catalog.'
                        : 'No books match your search.',
                    style: const TextStyle(
                      color: SifraColors.muted,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            )
          else
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.52, // roughly 9:16 cover + info
              ),
              itemCount: pageBooks.length,
              itemBuilder: (_, i) {
                final b = pageBooks[i];
                return BookCard(
                  book: b,
                  onEdit: () => context.go('/books/${b.bookId}'),
                  onDelete: () => _confirmDelete(b),
                );
              },
            ),

          BooksPagination(
            currentPage: _page,
            totalPages: _totalPages,
            totalItems: _filtered.length,
            itemsPerPage: _perPage,
            onPageChange: (p) => setState(() => _page = p),
          ),
        ],
      ),
    );
  }
}
