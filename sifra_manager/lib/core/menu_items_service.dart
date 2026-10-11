import '../models/menu_product.dart';
import 'api_client.dart';

class MenuItemsService {
  /// GET /api/cafe/products — same endpoint POS uses
  static Future<List<MenuProduct>> list() async {
    final res = await ApiClient.getRawList('/api/cafe/products');
    return res
        .map((e) => MenuProduct.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// POST /api/cafe/products
  static Future<void> create({
    required String name,
    String? description,
    required double price,
    required String status,
  }) async {
    await ApiClient.post('/api/cafe/products', {
      'name': name,
      'description': description,
      'price': price.toString(),
      'status': status,
    });
  }

  /// PUT /api/cafe/menu-items/{id}
  static Future<void> update({
    required String id,
    required String name,
    String? description,
    required double price,
    required String status,
  }) async {
    await ApiClient.put('/api/cafe/menu-items/$id', {
      'name': name,
      'description': description,
      'price': price.toString(),
      'status': status,
    });
  }

  /// DELETE /api/cafe/menu-items/{id}
  static Future<void> delete(String id) async {
    await ApiClient.delete('/api/cafe/menu-items/$id');
  }
}
