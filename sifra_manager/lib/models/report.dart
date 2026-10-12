import 'order_history.dart';
import 'borrowing.dart';
import 'inventory_item.dart';
import 'event.dart';

class ReportData {
  final List<OrderHistory> orders;
  final List<Borrowing> borrowings;
  final List<InventoryItem> inventory;
  final List<Event> events;

  ReportData({
    required this.orders,
    required this.borrowings,
    required this.inventory,
    required this.events,
  });

  factory ReportData.fromJson(Map<String, dynamic> j) => ReportData(
    orders: (j['orders'] as List<dynamic>? ?? [])
        .map((e) => OrderHistory.fromJson(e as Map<String, dynamic>))
        .toList(),
    borrowings: (j['borrowings'] as List<dynamic>? ?? [])
        .map((e) => Borrowing.fromJson(e as Map<String, dynamic>))
        .toList(),
    inventory: (j['inventory'] as List<dynamic>? ?? [])
        .map((e) => InventoryItem.fromJson(e as Map<String, dynamic>))
        .toList(),
    events: (j['events'] as List<dynamic>? ?? [])
        .map((e) => Event.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}
