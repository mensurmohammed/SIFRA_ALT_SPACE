import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class ApiException implements Exception {
  final int statusCode;
  final String message;
  ApiException(this.statusCode, this.message);
  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ApiClient {
  // 👇 your Vercel deployment
  static const String baseUrl = 'https://sifra-alt-space-uv4u.vercel.app';

  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'auth_token';

  static Future<void> saveToken(String token) =>
      _storage.write(key: _tokenKey, value: token);
  static Future<String?> getToken() => _storage.read(key: _tokenKey);
  static Future<void> clearToken() => _storage.delete(key: _tokenKey);

  static Future<Map<String, String>> _headers({bool auth = false}) async {
    final h = <String, String>{'Content-Type': 'application/json'};
    if (auth) {
      final t = await getToken();
      if (t != null) h['Authorization'] = 'Bearer $t';
    }
    return h;
  }

  // GET that returns a JSON list
  static Future<List<dynamic>> getRawList(
    String path, {
    bool auth = true,
  }) async {
    final res = await http.get(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(auth: auth),
    );
    final decoded = _handleList(res);
    return decoded;
  }

  // PUT with JSON body
  static Future<Map<String, dynamic>> put(
    String path,
    Map<String, dynamic> body, {
    bool auth = true,
  }) async {
    final res = await http.put(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _handle(res);
  }

  static List<dynamic> _handleList(http.Response res) {
    final body = res.body.isEmpty ? <dynamic>[] : jsonDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return body is List ? body : <dynamic>[];
    }
    final msg = (body is Map && body['error'] is String)
        ? body['error'] as String
        : 'Request failed';
    throw ApiException(res.statusCode, msg);
  }

  static Future<Map<String, dynamic>> get(
    String path, {
    bool auth = true,
  }) async {
    final res = await http.get(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(auth: auth),
    );
    return _handle(res);
  }

  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body, {
    bool auth = false,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _handle(res);
  }

  static Future<Map<String, dynamic>> delete(
    String path, {
    bool auth = true,
  }) async {
    final res = await http.delete(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(auth: auth),
    );
    return _handle(res);
  }

  static Map<String, dynamic> _handle(http.Response res) {
    final body = res.body.isEmpty ? <String, dynamic>{} : jsonDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return body is Map<String, dynamic> ? body : {'data': body};
    }
    final msg = (body is Map && body['error'] is String)
        ? body['error']
        : 'Request failed';
    throw ApiException(res.statusCode, msg);
  }
}
