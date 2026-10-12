import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../models/report.dart';

class CsvExportHelper {
  static Future<void> exportSales(
    ReportData data,
    List<dynamic> filtered,
  ) async {
    final headers = [
      'Order ID',
      'Date',
      'Tab / Customer',
      'Total Amount (ETB)',
      'Status',
    ];
    final rows = filtered
        .map<List<String>>(
          (o) => [
            o.orderId,
            _fmtDateTime(o.orderDate),
            o.orderName ?? 'N/A',
            o.totalAmount.toStringAsFixed(0),
            o.status,
          ],
        )
        .toList();
    await _share('sales_report.csv', headers, rows);
  }

  static Future<void> exportBorrowings(
    ReportData data,
    List<dynamic> filtered,
  ) async {
    final headers = [
      'Borrowing ID',
      'Borrower Name',
      'Email',
      'Book Title',
      'Borrow Date',
      'Status',
    ];
    final rows = filtered
        .map<List<String>>(
          (b) => [
            b.borrowingId,
            b.user?.fullName ?? 'N/A',
            b.user?.email ?? 'N/A',
            b.copy.book.title,
            _fmtDate(b.borrowedAt),
            b.status,
          ],
        )
        .toList();
    await _share('borrowings_report.csv', headers, rows);
  }

  static Future<void> exportInventory(ReportData data) async {
    final headers = [
      'Item ID',
      'Item Name',
      'Category',
      'Current Stock',
      'Unit',
      'Status',
    ];
    final rows = data.inventory
        .map<List<String>>(
          (i) => [
            i.id,
            i.name,
            'General',
            i.currentStock.toString(),
            i.unit,
            i.currentStock < 20 ? 'Low Stock' : 'In Stock',
          ],
        )
        .toList();
    await _share('inventory_report.csv', headers, rows);
  }

  static Future<void> _share(
    String filename,
    List<String> headers,
    List<List<String>> rows,
  ) async {
    final buffer = StringBuffer();
    buffer.writeln(headers.join(','));
    for (final r in rows) {
      buffer.writeln(r.map(_escape).join(','));
    }
    final dir = await getTemporaryDirectory();
    final file = File('${dir.path}/$filename');
    await file.writeAsString(buffer.toString());
    await Share.shareXFiles([
      XFile(file.path, mimeType: 'text/csv'),
    ], subject: filename);
  }

  static String _escape(String v) {
    if (v.contains(',') || v.contains('"') || v.contains('\n')) {
      return '"${v.replaceAll('"', '""')}"';
    }
    return v;
  }

  static String _fmtDateTime(DateTime d) {
    final hour12 = d.hour % 12 == 0 ? 12 : d.hour % 12;
    final m = d.minute.toString().padLeft(2, '0');
    final s = d.second.toString().padLeft(2, '0');
    final ampm = d.hour < 12 ? 'AM' : 'PM';
    return '${d.month}/${d.day}/${d.year}, '
        '${hour12.toString().padLeft(2, '0')}:$m:$s $ampm';
  }

  static String _fmtDate(DateTime d) => '${d.month}/${d.day}/${d.year}';
}
