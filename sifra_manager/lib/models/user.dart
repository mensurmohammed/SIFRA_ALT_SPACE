class SifraUser {
  final String id;
  final String email;
  final String role;
  final String name;

  SifraUser({
    required this.id,
    required this.email,
    required this.role,
    required this.name,
  });

  factory SifraUser.fromJson(Map<String, dynamic> j) => SifraUser(
    id: j['id'] as String,
    email: j['email'] as String,
    role: j['role'] as String,
    name: j['name'] as String,
  );

  bool get isManager => role == 'Manager' || role == 'Administrator';
}
