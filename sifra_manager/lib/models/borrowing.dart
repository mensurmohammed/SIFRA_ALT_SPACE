class BorrowingUser {
  final String userId;
  final String firstName;
  final String lastName;
  final String email;

  BorrowingUser({
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
  });

  factory BorrowingUser.fromJson(Map<String, dynamic> j) => BorrowingUser(
    userId: (j['UserID'] as String?) ?? '',
    firstName: (j['FirstName'] as String?) ?? '',
    lastName: (j['LastName'] as String?) ?? '',
    email: (j['Email'] as String?) ?? '',
  );

  String get fullName => '$firstName $lastName'.trim();
}

class BorrowingBook {
  final String bookId;
  final String title;
  final String author;
  final String? coverImage;

  BorrowingBook({
    required this.bookId,
    required this.title,
    required this.author,
    this.coverImage,
  });

  factory BorrowingBook.fromJson(Map<String, dynamic> j) => BorrowingBook(
    bookId: (j['BookID'] as String?) ?? '',
    title: (j['Title'] as String?) ?? 'Untitled',
    author: (j['Author'] as String?) ?? 'Unknown',
    coverImage: j['CoverImage'] as String?,
  );
}

class BorrowingCopy {
  final String copyId;
  final String barcode;
  final String status;
  final BorrowingBook book;

  BorrowingCopy({
    required this.copyId,
    required this.barcode,
    required this.status,
    required this.book,
  });

  factory BorrowingCopy.fromJson(Map<String, dynamic> j) => BorrowingCopy(
    copyId: j['CopyID'] as String,
    barcode: (j['Barcode'] as String?) ?? '',
    status: (j['Status'] as String?) ?? 'Available',
    book: BorrowingBook.fromJson(j['Book'] as Map<String, dynamic>),
  );
}

class Borrowing {
  final String borrowingId;
  final DateTime borrowedAt;
  final DateTime? returnedAt;
  final double? amountCharged;
  final String status; // "Active" | "Returned"
  final String? customerEmail;
  final BorrowingUser? user;
  final BorrowingCopy copy;

  Borrowing({
    required this.borrowingId,
    required this.borrowedAt,
    this.returnedAt,
    this.amountCharged,
    required this.status,
    this.customerEmail,
    this.user,
    required this.copy,
  });

  factory Borrowing.fromJson(Map<String, dynamic> j) => Borrowing(
    borrowingId: j['BorrowingID'] as String,
    borrowedAt: DateTime.parse(j['BorrowedAt'] as String).toLocal(),
    returnedAt: j['ReturnedAt'] != null
        ? DateTime.parse(j['ReturnedAt'] as String).toLocal()
        : null,
    amountCharged: (j['AmountCharged'] as num?)?.toDouble(),
    status: (j['Status'] as String?) ?? 'Active',
    customerEmail: j['CustomerEmail'] as String?,
    user: j['User'] != null
        ? BorrowingUser.fromJson(j['User'] as Map<String, dynamic>)
        : null,
    copy: BorrowingCopy.fromJson(j['Copy'] as Map<String, dynamic>),
  );

  bool get isActive => status == 'Active';

  /// Same 3-way fallback as the website
  String get customerDisplay {
    if (user != null && user!.fullName.isNotEmpty) return user!.fullName;
    if (customerEmail != null && customerEmail!.isNotEmpty)
      return customerEmail!;
    return 'Walk-in Guest';
  }
}
