import 'menu_product.dart';

class PendingOrderItem {
  final String productId;
  final int quantity;
  final double unitPrice;
  final MenuProduct product;

  PendingOrderItem({
    required this.productId,
    required this.quantity,
    required this.unitPrice,
    required this.product,
  });

  factory PendingOrderItem.fromJson(Map<String, dynamic> j) {
    final p = j['Product'] as Map<String, dynamic>;
    return PendingOrderItem(
      productId: (j['MenuItemID'] ?? j['ProductID']) as String,
      quantity: j['Quantity'] as int,
      unitPrice: (j['UnitPrice'] as num).toDouble(),
      product: MenuProduct(
        productId: p['ProductID'] as String,
        productName: p['ProductName'] as String,
        description: null,
        sellingPrice: (p['SellingPrice'] as num).toDouble(),
        status: 'Available',
      ),
    );
  }

  double get subtotal => unitPrice * quantity;
}

class PendingOrder {
  final String orderId;
  final String? orderName;
  final double totalAmount;
  final String status;
  final List<PendingOrderItem> items;

  PendingOrder({
    required this.orderId,
    this.orderName,
    required this.totalAmount,
    required this.status,
    required this.items,
  });

  factory PendingOrder.fromJson(Map<String, dynamic> j) => PendingOrder(
    orderId: j['OrderID'] as String,
    orderName: j['OrderName'] as String?,
    totalAmount: (j['TotalAmount'] as num).toDouble(),
    status: j['Status'] as String,
    items: (j['OrderItems'] as List<dynamic>? ?? [])
        .map((e) => PendingOrderItem.fromJson(e as Map<String, dynamic>))
        .toList(),
  );

  String get displayName =>
      orderName?.isNotEmpty == true ? orderName! : 'Untitled';
  int get itemCount => items.fold(0, (sum, i) => sum + i.quantity);
}
