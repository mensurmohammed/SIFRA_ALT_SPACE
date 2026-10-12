import 'package:flutter/material.dart';
import '../../models/report.dart';
import '../../models/order_history.dart';
import '../../models/borrowing.dart';
import '../../models/inventory_item.dart';
import '../../models/event.dart';
import '../../theme/sifra_theme.dart';

// ---------------- Overview Tab ----------------
class ReportsOverviewTab extends StatelessWidget {
  final List<OrderHistory> orders;
  final List<Borrowing> borrowings;
  final VoidCallback onViewAllOrders;
  final VoidCallback onViewAllBorrowings;

  const ReportsOverviewTab({
    super.key,
    required this.orders,
    required this.borrowings,
    required this.onViewAllOrders,
    required this.onViewAllBorrowings,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _section(
          context,
          title: 'Recent Orders Summary',
          viewAllLabel: 'View All (${orders.length})',
          onViewAll: onViewAllOrders,
          icon: Icons.coffee_outlined,
          iconColor: SifraColors.gold,
          emptyText: 'No orders found in this period.',
          children: orders
              .take(5)
              .map((o) => _orderMini(o))
              .toList(),
        ),
        const SizedBox(height: 16),
        _section(
          context,
          title: 'Active & Recent Borrowings',
          viewAllLabel: 'View All (${borrowings.length})',
          onViewAll: onViewAllBorrowings,
          icon: Icons.menu_book_outlined,
          iconColor: const Color(0xFF385723),
          emptyText: 'No borrowings found in this period.',
          children: borrowings
              .take(5)
              .map((b) => _borrowMini(b))
              .toList(),
        ),
      ],
    );
  }

  Widget _section(
    BuildContext context, {
    required String title,
    required String viewAllLabel,
    required VoidCallback onViewAll,
    required IconData icon,
    required Color iconColor,
    required String emptyText,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF9F6),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: SifraColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: iconColor),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: SifraColors.brown,
                  ),
                ),
              ),
              GestureDetector(
                onTap: onViewAll,
                child: Text(
                  viewAllLabel,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: SifraColors.gold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (children.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Center(
                child: Text(emptyText,
                    style: const TextStyle(
                        fontSize: 12, color: SifraColors.muted)),
              ),
            )
          else
            ...children,
        ],
      ),
    );
  }

  Widget _orderMini(OrderHistory o) {
    final done = o.status == 'Completed';
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: SifraColors.border.withValues(alpha: 0.6)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  o.orderName?.isNotEmpty == true
                      ? o.orderName!
                      : 'Order #${o.shortId}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                      color: SifraColors.brown),
                ),
                const SizedBox(height: 2),
                Text(
                  _time(o.orderDate),
                  style: const TextStyle(
                      fontSize: 10, color: SifraColors.muted),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${o.totalAmount.toStringAsFixed(0)} ETB',
                style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                    color: SifraColors.brown),
              ),
              const SizedBox(height: 2),
              _miniPill(o.status,
                  done ? const Color(0xFFE2F0D9) : const Color(0xFFFEF3C7),
                  done ? const Color(0xFF385723) : const Color(0xFF92400E)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _borrowMini(Borrowing b) {
    final returned = b.status == 'Returned';
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: SifraColors.border.withValues(alpha: 0.6)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  b.copy.book.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                      color: SifraColors.brown),
                ),
                const SizedBox(height: 2),
                Text(
                  b.customerDisplay,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 10, color: SifraColors.muted),
                ),
              ],
            ),
          ),
          _miniPill(
            b.status,
            returned ? const Color(0xFFF3F4F6) : const Color(0xFFFEF3C7),
            returned ? const Color(0xFF374151) : const Color(0xFF92400E),
          ),
        ],
      ),
    );
  }

  Widget _miniPill(String text, Color bg, Color fg) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          text,
          style: TextStyle(
              fontSize: 9, fontWeight: FontWeight.w700, color: fg),
        ),
      );

  String _time(DateTime d) {
    final hour12 = d.hour % 12 == 0 ? 12 : d.hour % 12;
    final m = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour < 12 ? 'AM' : 'PM';
    return '${hour12.toString().padLeft(2, '0')}:$m $ampm';
  }
}

// ---------------- Sales Tab ----------------
class ReportsSalesTab extends StatelessWidget {
  final List<OrderHistory> orders;
  const ReportsSalesTab({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 40),
        child: Center(
          child: Text('No orders match your criteria.',
              style: TextStyle(fontSize: 12, color: SifraColors.muted)),
        ),
      );
    }
    return Column(
      children: orders.map((o) {
        final done = o.status == 'Completed';
        return _row(
          left: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '#${o.shortId}',
                style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: SifraColors.muted),
              ),
              const SizedBox(height: 3),
              Text(
                o.orderName?.isNotEmpty == true ? o.orderName! : 'Walk-in Customer',
                style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                    color: SifraColors.brown),
              ),
              const SizedBox(height: 2),
              Text(_fmtFull(o.orderDate),
                  style: const TextStyle(
                      fontSize: 11, color: SifraColors.muted)),
            ],
          ),
          right: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${o.totalAmount.toStringAsFixed(0)} ETB',
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: SifraColors.brown)),
              const SizedBox(height: 4),
              _pill(
                  o.status,
                  done ? const Color(0xFFE2F0D9) : const Color(0xFFFEF3C7),
                  done ? const Color(0xFF385723) : const Color(0xFF92400E)),
            ],
          ),
        );
      }).toList(),
    );
  }
}

// ---------------- Borrowings Tab ----------------
class ReportsBorrowingsTab extends StatelessWidget {
  final List<Borrowing> borrowings;
  const ReportsBorrowingsTab({super.key, required this.borrowings});

  @override
  Widget build(BuildContext context) {
    if (borrowings.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 40),
        child: Center(
          child: Text('No borrowings match your criteria.',
              style: TextStyle(fontSize: 12, color: SifraColors.muted)),
        ),
      );
    }
    return Column(
      children: borrowings.map((b) {
        final returned = b.status == 'Returned';
        return _row(
          left: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(b.customerDisplay,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: SifraColors.brown)),
              if (b.user?.email.isNotEmpty == true)
                Text(b.user!.email,
                    style: const TextStyle(
                        fontSize: 11, color: SifraColors.muted)),
              const SizedBox(height: 4),
              Text(b.copy.book.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 12, color: SifraColors.brown)),
              const SizedBox(height: 4),
              Text('Borrowed: ${_fmtDate(b.borrowedAt)}',
                  style: const TextStyle(
                      fontSize: 11, color: SifraColors.muted)),
              const Text('Due: N/A',
                  style: TextStyle(
                      fontSize: 11, color: SifraColors.muted)),
            ],
          ),
          right: _pill(
            b.status,
            returned ? const Color(0xFFF3F4F6) : const Color(0xFFFEF3C7),
            returned ? const Color(0xFF374151) : const Color(0xFF92400E),
          ),
        );
      }).toList(),
    );
  }
}

// ---------------- Inventory Tab ----------------
class ReportsInventoryTab extends StatelessWidget {
  final List<InventoryItem> inventory;
  const ReportsInventoryTab({super.key, required this.inventory});

  @override
  Widget build(BuildContext context) {
    if (inventory.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 40),
        child: Center(
          child: Text('No inventory items match your search.',
              style: TextStyle(fontSize: 12, color: SifraColors.muted)),
        ),
      );
    }
    return Column(
      children: inventory.map((i) {
        final low = i.currentStock < 20;
        return _row(
          left: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(i.name,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: SifraColors.brown)),
              const SizedBox(height: 2),
              Text('Category: General',
                  style: const TextStyle(
                      fontSize: 11, color: SifraColors.muted)),
              const SizedBox(height: 2),
              Text('Stock: ${i.currentStock} ${i.unit}',
                  style: const TextStyle(
                      fontSize: 12, color: SifraColors.brown)),
            ],
          ),
          right: _pill(
            low ? 'Low Stock Warning' : 'In Stock',
            low ? const Color(0xFFFEE2E2) : const Color(0xFFE2F0D9),
            low ? const Color(0xFF991B1B) : const Color(0xFF385723),
          ),
        );
      }).toList(),
    );
  }
}

// ---------------- Events Tab ----------------
class ReportsEventsTab extends StatelessWidget {
  final List<Event> events;
  const ReportsEventsTab({super.key, required this.events});

  @override
  Widget build(BuildContext context) {
    if (events.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 40),
        child: Center(
          child: Text('No events match your criteria.',
              style: TextStyle(fontSize: 12, color: SifraColors.muted)),
        ),
      );
    }
    return Column(
      children: events.map((e) {
        final regs = e.activeRegistrations;
        final cap = e.maxParticipants > 0 ? e.maxParticipants.toString() : '∞';
        return _row(
          left: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(e.title,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: SifraColors.brown)),
              const SizedBox(height: 3),
              Text(_fmtFull(e.eventDate),
                  style: const TextStyle(
                      fontSize: 11, color: SifraColors.muted)),
              const SizedBox(height: 3),
              Text('Registrations: $regs / $cap',
                  style: const TextStyle(
                      fontSize: 12, color: SifraColors.brown)),
            ],
          ),
          right: _pill(
            e.status,
            const Color(0xFFDBEAFE),
            const Color(0xFF1E40AF),
          ),
        );
      }).toList(),
    );
  }
}

// ---------------- Shared ----------------
Widget _row({required Widget left, required Widget right}) {
  return Container(
    margin: const EdgeInsets.only(bottom: 10),
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: SifraColors.white,
      borderRadius: BorderRadius.circular(10),
      border: Border.all(color: SifraColors.border),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(child: left),
        const SizedBox(width: 10),
        right,
      ],
    ),
  );
}

Widget _pill(String text, Color bg, Color fg) => Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
      child: Text(
        text,
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: fg),
      ),
    );

String _fmtFull(DateTime d) {
  final hour12 = d.hour % 12 == 0 ? 12 : d.hour % 12;
  final m = d.minute.toString().padLeft(2, '0');
  final s = d.second.toString().padLeft(2, '0');
  final ampm = d.hour < 12 ? 'AM' : 'PM';
  return '${d.month}/${d.day}/${d.year}, '
      '${hour12.toString().padLeft(2, '0')}:$m:$s $ampm';
}

String _fmtDate(DateTime d) => '${d.month}/${d.day}/${d.year}';