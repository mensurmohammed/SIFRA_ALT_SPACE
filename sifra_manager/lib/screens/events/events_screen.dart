import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/events_service.dart';
import '../../models/event.dart';
import '../../theme/sifra_theme.dart';
import 'event_card.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  bool _loading = true;
  String? _error;
  List<Event> _events = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final events = await EventsService.list();
      if (!mounted) return;
      setState(() {
        _events = events;
        _loading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Network error. Check your connection.';
        _loading = false;
      });
    }
  }

  Future<void> _toggleHidden(Event event) async {
    try {
      final updated = await EventsService.toggleHidden(event.eventId);
      if (!mounted) return;
      setState(() {
        _events = _events
            .map((e) => e.eventId == updated.eventId ? updated : e)
            .toList();
      });
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to update event');
    }
  }

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: SifraColors.danger,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SifraColors.cream,
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: SifraColors.gold),
            )
          : _error != null
          ? _errorView()
          : _body(),
    );
  }

  Widget _errorView() => Center(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.cloud_off, size: 48, color: SifraColors.muted),
          const SizedBox(height: 12),
          Text(
            _error!,
            textAlign: TextAlign.center,
            style: const TextStyle(color: SifraColors.muted),
          ),
          const SizedBox(height: 16),
          OutlinedButton(onPressed: _load, child: const Text('Retry')),
        ],
      ),
    ),
  );

  Widget _body() {
    return RefreshIndicator(
      onRefresh: _load,
      color: SifraColors.gold,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        children: [
          Text(
            'Event Management',
            style: Theme.of(context).textTheme.displaySmall,
          ),
          const SizedBox(height: 4),
          const Text(
            'Manage upcoming and past events.',
            style: TextStyle(color: SifraColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 16),

          FilledButton.icon(
            onPressed: () => context.go('/events/add'),
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Create Event'),
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 16),

          if (_events.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 60),
              child: Column(
                children: [
                  Icon(
                    Icons.calendar_today_outlined,
                    size: 48,
                    color: SifraColors.border,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'No events found.',
                    style: TextStyle(color: SifraColors.muted, fontSize: 13),
                  ),
                ],
              ),
            )
          else
            ..._events.map(
              (e) => EventCard(
                event: e,
                onEdit: () => context.go('/events/${e.eventId}'),
                onToggleHidden: () => _toggleHidden(e),
              ),
            ),
        ],
      ),
    );
  }
}
