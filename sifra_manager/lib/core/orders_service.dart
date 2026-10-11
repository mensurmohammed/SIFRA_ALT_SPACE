import '../models/order_history.dart';
import 'api_client.dart';

class OrdersService {
  /// GET /api/cafe/orders — all orders, sorted newest first (server-side)
  static Future<List<OrderHistory>> list() async {
    final res = await ApiClient.getRawList('/api/cafe/orders');
    return res
        .map((e) => OrderHistory.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
