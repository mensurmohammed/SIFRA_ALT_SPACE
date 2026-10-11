import '../models/inventory_item.dart';
import 'api_client.dart';

class InventoryService {
  /// GET /api/cafe/inventory
  static Future<List<InventoryItem>> list() async {
    final res = await ApiClient.getRawList('/api/cafe/inventory');
    return res
        .map((e) => InventoryItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// POST /api/cafe/inventory
  static Future<void> create({
    required String name,
    required String unit,
    required int stock,
  }) async {
    await ApiClient.post('/api/cafe/inventory', {
      'name': name,
      'unit': unit,
      'stock': stock.toString(),
    });
  }

  /// POST /api/cafe/inventory/{id}/restock
  static Future<void> restock({required String id, required int amount}) async {
    await ApiClient.post('/api/cafe/inventory/$id/restock', {'amount': amount});
  }
}
