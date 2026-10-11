import 'package:flutter/foundation.dart';
import '../models/user.dart';
import 'api_client.dart';

class AuthService extends ChangeNotifier {
  SifraUser? _user;
  bool _loading = false;
  String? _error;

  SifraUser? get user => _user;
  bool get loading => _loading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<bool> tryRestoreSession() async {
    final token = await ApiClient.getToken();
    if (token == null) return false;
    try {
      final res = await ApiClient.get('/api/auth/me');
      _user = SifraUser.fromJson(res['user']);
      notifyListeners();
      return true;
    } on ApiException {
      await ApiClient.clearToken();
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await ApiClient.post('/api/auth/login', {
        'email': email,
        'password': password,
        'loginType': 'staff',
      });
      final token = res['token'] as String;
      await ApiClient.saveToken(token);
      _user = SifraUser.fromJson(res['user']);
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      return false;
    } catch (e) {
      _error = 'Network error. Check your connection.';
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      await ApiClient.post('/api/auth/logout', {}, auth: true);
    } catch (_) {}
    await ApiClient.clearToken();
    _user = null;
    notifyListeners();
  }
}
