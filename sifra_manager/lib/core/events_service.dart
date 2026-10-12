import '../models/event.dart';
import 'api_client.dart';

class EventsService {
  /// GET /api/events — with Bearer → sees hidden events too
  static Future<List<Event>> list() async {
    final res = await ApiClient.getRawList('/api/events');
    return res.map((e) => Event.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// PATCH /api/events/{id} — toggles Hidden; returns updated event
  static Future<Event> toggleHidden(String id) async {
    final res = await ApiClient.patch('/api/events/$id', {});
    return Event.fromJson(res);
  }

  /// GET /api/events/{id}
  static Future<Event> getById(String id) async {
    final res = await ApiClient.get('/api/events/$id');
    return Event.fromJson(res);
  }

  /// PUT /api/events/{id} — requires Bearer
  static Future<void> update({
    required String id,
    required String title,
    String? description,
    required DateTime date,
    required String startTime,
    required String endTime,
    required int maxParticipants,
    required double price,
    required String status,
    required bool hidden,
  }) async {
    await ApiClient.put('/api/events/$id', {
      'title': title,
      'description': (description?.isEmpty ?? true) ? null : description,
      'date': date.toUtc().toIso8601String(),
      'startTime': startTime,
      'endTime': endTime,
      'maxParticipants': maxParticipants.toString(),
      'price': price.toString(),
      'status': status,
      'hidden': hidden,
    }, auth: true);
  }

  /// POST /api/events — requires Bearer
  /// Sends `cover` even though the current website source doesn't read it;
  /// the deployed version likely supports it, and unused fields are harmless.
  static Future<void> create({
    required String title,
    String? description,
    required DateTime date,
    required String startTime,
    required String endTime,
    required int maxParticipants,
    required double price,
    String? cover,
  }) async {
    await ApiClient.post('/api/events', {
      'title': title,
      'description': (description?.isEmpty ?? true) ? null : description,
      'date': date.toUtc().toIso8601String(),
      'startTime': startTime,
      'endTime': endTime,
      'maxParticipants': maxParticipants.toString(),
      'price': price.toString(),
      'cover': (cover?.isEmpty ?? true) ? null : cover,
    }, auth: true);
  }
}
