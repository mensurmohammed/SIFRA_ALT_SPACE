import 'package:flutter/material.dart';
import '../../models/event.dart';
import '../../theme/sifra_theme.dart';

class EventCard extends StatelessWidget {
  final Event event;
  final VoidCallback onEdit;
  final VoidCallback onToggleHidden;

  const EventCard({
    super.key,
    required this.event,
    required this.onEdit,
    required this.onToggleHidden,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: SifraColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D352214),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date + time
          Text(
            _fmtDate(event.eventDate),
            style: const TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 13,
              color: SifraColors.brown,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '${event.startTime} – ${event.endTime}',
            style: const TextStyle(fontSize: 11, color: SifraColors.muted),
          ),
          const SizedBox(height: 8),

          // Title
          Text(
            event.title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 15,
              color: SifraColors.brown,
            ),
          ),
          const SizedBox(height: 10),

          // Status pills
          Row(
            children: [
              _pill(event.status, _statusColors(event.status)),
              if (event.hidden) ...[
                const SizedBox(width: 6),
                _pill('Hidden', (
                  const Color(0xFFFCE4D6),
                  const Color(0xFFC65911),
                )),
              ],
            ],
          ),
          const SizedBox(height: 10),

          // Registrations
          Text(
            'Registrations: ${event.registrationDisplay}',
            style: const TextStyle(fontSize: 12, color: SifraColors.muted),
          ),
          const SizedBox(height: 12),
          const Divider(height: 1, color: SifraColors.border),
          const SizedBox(height: 10),

          // Actions
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onEdit,
                  icon: const Icon(Icons.edit_outlined, size: 14),
                  label: const Text('Edit', style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: SifraColors.gold,
                    backgroundColor: SifraColors.gold.withValues(alpha: 0.15),
                    side: BorderSide.none,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onToggleHidden,
                  icon: Icon(
                    event.hidden ? Icons.visibility : Icons.visibility_off,
                    size: 14,
                  ),
                  label: Text(
                    event.hidden ? 'Unhide' : 'Hide',
                    style: const TextStyle(fontSize: 12),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: event.hidden
                        ? const Color(0xFF385723)
                        : const Color(0xFFC65911),
                    backgroundColor: event.hidden
                        ? const Color(0xFFE2F0D9)
                        : const Color(0xFFFCE4D6),
                    side: BorderSide.none,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _pill(String text, (Color bg, Color fg) colors) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
    decoration: BoxDecoration(
      color: colors.$1,
      borderRadius: BorderRadius.circular(20),
    ),
    child: Text(
      text,
      style: TextStyle(
        color: colors.$2,
        fontWeight: FontWeight.w600,
        fontSize: 11,
      ),
    ),
  );

  (Color, Color) _statusColors(String status) {
    switch (status) {
      case 'Upcoming':
        return (const Color(0xFFE2F0D9), const Color(0xFF385723));
      case 'Completed':
        return (const Color(0xFFF7F4EE), const Color(0xFF706F6F));
      default:
        return (SifraColors.gold.withValues(alpha: 0.15), SifraColors.gold);
    }
  }

  /// "Jul 23, 2026" — matches the website's toLocaleDateString en-US format
  String _fmtDate(DateTime d) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${months[d.month - 1]} ${d.day}, ${d.year}';
  }
}
