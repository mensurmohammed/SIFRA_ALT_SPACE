class InventoryItem {
  final String id;
  final String name;
  final String unit;
  final int currentStock;

  InventoryItem({
    required this.id,
    required this.name,
    required this.unit,
    required this.currentStock,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> j) => InventoryItem(
    id: j['InventoryItemID'] as String,
    name: j['Name'] as String,
    unit: (j['Unit'] as String?) ?? 'units',
    currentStock: (j['CurrentStock'] as num).toInt(),
  );

  /// Stock status tier matching the website's color rules
  StockLevel get level {
    if (currentStock > 20) return StockLevel.healthy;
    if (currentStock > 0) return StockLevel.low;
    return StockLevel.empty;
  }
}

enum StockLevel { healthy, low, empty }
