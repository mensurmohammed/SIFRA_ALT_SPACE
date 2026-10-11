class MenuProduct {
  final String productId;
  final String productName;
  final String? description;
  final double sellingPrice;
  final String status;

  MenuProduct({
    required this.productId,
    required this.productName,
    this.description,
    required this.sellingPrice,
    required this.status,
  });

  factory MenuProduct.fromJson(Map<String, dynamic> j) => MenuProduct(
    productId: j['ProductID'] as String,
    productName: j['ProductName'] as String,
    description: j['Description'] as String?,
    sellingPrice: (j['SellingPrice'] as num).toDouble(),
    status: (j['Status'] as String?) ?? 'Available',
  );

  bool get isAvailable => status == 'Available';
}
