class OrderHistoryItem {
  final String productId;
  final String productName;
  final int quantity;
  final double unitPrice;
  final double subtotal;

  OrderHistoryItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.unitPrice,
    required this.subtotal,
  });

  factory OrderHistoryItem.fromJson(Map<String, dynamic> j) {
    final p = (j['Product'] ?? {}) as Map<String, dynamic>;
    final price =
        (j['UnitPrice'] as num?)?.toDouble() ??
        (p['SellingPrice'] as num?)?.toDouble() ??
        0;
    final qty = (j['Quantity'] as num?)?.toInt() ?? 0;
    return OrderHistoryItem(
      productId: (p['ProductID'] ?? j['MenuItemID'] ?? '') as String,
      productName: (p['ProductName'] as String?) ?? 'Item',
      quantity: qty,
      unitPrice: price,
      subtotal: (j['Subtotal'] as num?)?.toDouble() ?? (price * qty),
    );
  }
}

class OrderHistory {
  final String orderId;
  final String? orderName;
  final DateTime orderDate;
  final String status;
  final double totalAmount;
  final List<OrderHistoryItem> items;

  OrderHistory({
    required this.orderId,
    this.orderName,
    required this.orderDate,
    required this.status,
    required this.totalAmount,
    required this.items,
  });

  factory OrderHistory.fromJson(Map<String, dynamic> j) => OrderHistory(
    orderId: j['OrderID'] as String,
    orderName: j['OrderName'] as String?,
    orderDate: DateTime.parse(j['OrderDate'] as String).toLocal(),
    status: (j['Status'] as String?) ?? 'Completed',
    totalAmount: (j['TotalAmount'] as num).toDouble(),
    items: (j['OrderItems'] as List<dynamic>? ?? [])
        .map((e) => OrderHistoryItem.fromJson(e as Map<String, dynamic>))
        .toList(),
  );

  String get shortId => orderId.length >= 8 ? orderId.substring(0, 8) : orderId;

  String get itemsSummary {
    if (items.isEmpty) return 'No items';
    return items.map((i) => '${i.quantity}× ${i.productName}').join(', ');
  }
}
