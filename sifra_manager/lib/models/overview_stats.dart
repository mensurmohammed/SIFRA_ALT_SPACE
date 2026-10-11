class OverviewStats {
  final double todaySalesEtb;
  final int ordersToday;
  final int activeBorrowings;
  final int lowStockAlerts;

  OverviewStats({
    required this.todaySalesEtb,
    required this.ordersToday,
    required this.activeBorrowings,
    required this.lowStockAlerts,
  });

  factory OverviewStats.fromJson(Map<String, dynamic> j) => OverviewStats(
    todaySalesEtb: (j['todaySalesEtb'] as num).toDouble(),
    ordersToday: j['ordersToday'] as int,
    activeBorrowings: j['activeBorrowings'] as int,
    lowStockAlerts: j['lowStockAlerts'] as int,
  );
}
