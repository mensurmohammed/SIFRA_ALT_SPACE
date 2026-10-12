import '../models/borrowing.dart';
import 'api_client.dart';

class BorrowingsService {
  /// GET /api/borrowings — requires Bearer token (auth now supported)
  static Future<List<Borrowing>> list() async {
    final res = await ApiClient.getRawList('/api/borrowings');
    return res
        .map((e) => Borrowing.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// POST /api/borrowings/{id}/return — requires Bearer token
  static Future<void> returnBook({
    required String borrowingId,
    required DateTime endTime,
  }) async {
    await ApiClient.post(
      '/api/borrowings/$borrowingId/return',
      {'endTime': endTime.toUtc().toIso8601String()},
      auth: true, // ← requires auth
    );
  }

  /// POST /api/borrowings
  /// Body: { copyId, customerEmail (optional), startTime (ISO string or null) }
  static Future<void> create({
    required String copyId,
    String? customerEmail,
    DateTime? startTime,
  }) async {
    await ApiClient.post('/api/borrowings', {
      'copyId': copyId,
      'customerEmail': (customerEmail?.trim().isEmpty ?? true)
          ? null
          : customerEmail!.trim(),
      'startTime': startTime?.toUtc().toIso8601String(),
    }, auth: true);
  }
}
