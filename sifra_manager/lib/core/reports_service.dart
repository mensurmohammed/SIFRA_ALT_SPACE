import '../models/report.dart';
import 'api_client.dart';

class ReportsService {
  /// GET /api/reports — requires Bearer token
  static Future<ReportData> fetch() async {
    final res = await ApiClient.get('/api/reports');
    return ReportData.fromJson(res);
  }
}