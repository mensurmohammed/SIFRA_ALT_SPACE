import '../models/menu_product.dart';
import '../models/pending_order.dart';
import 'api_client.dart';

class PosService {
  // ----- Products -----
  static Future<List<MenuProduct>> loadProducts() async {
    final res = await ApiClient.getRawList('/api/cafe/products');
    return res
        .map((e) => MenuProduct.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  // ----- Pending orders -----
  static Future<List<PendingOrder>> loadPendingOrders() async {
    final res = await ApiClient.getRawList('/api/cafe/orders/pending');
    return res
        .map((e) => PendingOrder.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  static Future<PendingOrder> createOrder(String orderName) async {
    final res = await ApiClient.post('/api/cafe/orders/pending', {
      'orderName': orderName,
    });
    return PendingOrder.fromJson({
      ...res,
      'OrderItems': res['OrderItems'] ?? [],
    });
  }

  // ----- Update items on an order -----
  static Future<PendingOrder> updateOrderItems({
    required String orderId,
    required List<PendingOrderItem> items,
  }) async {
    final body = {
      'items': items
          .map(
            (i) => {
              'productId': i.productId,
              'quantity': i.quantity,
              'unitPrice': i.unitPrice,
            },
          )
          .toList(),
    };
    final res = await ApiClient.put('/api/cafe/orders/$orderId', body);
    return PendingOrder.fromJson(res);
  }

  // ----- Checkout (Cash only) -----
  static Future<void> checkoutCash(String orderId) async {
    await ApiClient.post('/api/cafe/checkout', {
      'orderId': orderId,
      'paymentMethod': 'Cash',
    });
  }
}
