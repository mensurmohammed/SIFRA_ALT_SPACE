import '../models/book.dart';
import 'api_client.dart';
import '../models/category.dart';

class BooksService {
  /// GET /api/books — all books (search is client-side to match the website)
  static Future<List<Book>> list() async {
    final res = await ApiClient.getRawList('/api/books');
    return res.map((e) => Book.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// DELETE /api/books/{id}
  static Future<void> delete(String id) async {
    await ApiClient.delete('/api/books/$id');
  }

  /// GET /api/categories
  static Future<List<Category>> listCategories() async {
    final res = await ApiClient.getRawList('/api/categories');
    return res
        .map((e) => Category.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /api/books/{id} — returns raw JSON for the form to prefill
  static Future<Map<String, dynamic>> getById(String id) async {
    return await ApiClient.get('/api/books/$id');
  }

  /// PUT /api/books/{id}
  /// The website's PUT body uses lowercase keys, same shape as POST
  static Future<void> updateBook({
    required String id,
    required String title,
    required String author,
    String? isbn,
    String? categoryId,
    String? year,
    String? language,
    String? edition,
    String? description,
    String? location,
    String? cover,
  }) async {
    await ApiClient.put('/api/books/$id', {
      'title': title,
      'author': author,
      'isbn': (isbn?.isEmpty ?? true) ? null : isbn,
      'categoryId': categoryId,
      'year': (year?.isEmpty ?? true) ? null : year,
      'language': (language?.isEmpty ?? true) ? null : language,
      'edition': (edition?.isEmpty ?? true) ? null : edition,
      'description': (description?.isEmpty ?? true) ? null : description,
      'location': (location?.isEmpty ?? true) ? null : location,
      'cover': (cover?.isEmpty ?? true) ? null : cover,
    });
  }

  /// POST /api/books
  /// The website's POST body uses lowercase keys + `categoryId`
  static Future<void> createBook({
    required String title,
    required String author,
    String? isbn,
    String? categoryId,
    String? year,
    String? description,
    String? cover,
    required int copies,
  }) async {
    await ApiClient.post('/api/books', {
      'title': title,
      'author': author,
      'isbn': (isbn?.isEmpty ?? true) ? null : isbn,
      'categoryId': categoryId,
      'year': (year?.isEmpty ?? true) ? null : year,
      'description': (description?.isEmpty ?? true) ? null : description,
      'cover': (cover?.isEmpty ?? true) ? null : cover,
      'copies': copies,
    });
  }
}
