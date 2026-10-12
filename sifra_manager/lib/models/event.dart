class EventRegistration {
  final String registrationId;
  final String status;
  EventRegistration({required this.registrationId, required this.status});

  factory EventRegistration.fromJson(Map<String, dynamic> j) =>
      EventRegistration(
        registrationId: (j['RegistrationID'] as String?) ?? '',
        status: (j['Status'] as String?) ?? 'Registered',
      );
}

class Event {
  final String eventId;
  final String title;
  final String? description;
  final DateTime eventDate;
  final String startTime;
  final String endTime;
  final double price;
  final int maxParticipants;
  final String? coverImage;
  final String status;
  final bool hidden;
  final List<EventRegistration> registrations;

  Event({
    required this.eventId,
    required this.title,
    this.description,
    required this.eventDate,
    required this.startTime,
    required this.endTime,
    required this.price,
    required this.maxParticipants,
    this.coverImage,
    required this.status,
    required this.hidden,
    required this.registrations,
  });

  factory Event.fromJson(Map<String, dynamic> j) => Event(
    eventId: j['EventID'] as String,
    title: (j['Title'] as String?) ?? 'Untitled',
    description: j['Description'] as String?,
    eventDate: DateTime.parse(j['EventDate'] as String).toLocal(),
    startTime: (j['StartTime'] as String?) ?? '',
    endTime: (j['EndTime'] as String?) ?? '',
    price: (j['Price'] as num?)?.toDouble() ?? 0,
    maxParticipants: (j['MaxParticipants'] as num?)?.toInt() ?? 0,
    coverImage: j['CoverImage'] as String?,
    status: (j['Status'] as String?) ?? 'Upcoming',
    hidden: (j['Hidden'] as bool?) ?? false,
    registrations: (j['Registrations'] as List<dynamic>? ?? [])
        .map((e) => EventRegistration.fromJson(e as Map<String, dynamic>))
        .toList(),
  );

  /// Matches the website: only counts Status == "Registered"
  int get activeRegistrations =>
      registrations.where((r) => r.status == 'Registered').length;

  /// "Unlimited" or the number
  String get registrationDisplay =>
      '$activeRegistrations / ${maxParticipants > 0 ? maxParticipants : 'Unlimited'}';
}
