class BookCategory {
  final String categoryId;
  final String categoryName;
  BookCategory({required this.categoryId, required this.categoryName});

  factory BookCategory.fromJson(Map<String, dynamic> j) => BookCategory(
    categoryId: j['CategoryID'] as String,
    categoryName: j['CategoryName'] as String,
  );
}

class BookCopy {
  final String copyId;
  final String barcode;
  final String status;
  BookCopy({required this.copyId, required this.barcode, required this.status});

  factory BookCopy.fromJson(Map<String, dynamic> j) => BookCopy(
    copyId: j['CopyID'] as String,
    barcode: (j['Barcode'] as String?) ?? '',
    status: (j['Status'] as String?) ?? 'Available',
  );
}

class Book {
  final String bookId;
  final String title;
  final String author;
  final String? isbn;
  final String? coverImage;
  final BookCategory? category;
  final List<BookCopy> copies;
  final int availableCopies;

  Book({
    required this.bookId,
    required this.title,
    required this.author,
    this.isbn,
    this.coverImage,
    this.category,
    required this.copies,
    required this.availableCopies,
  });

  factory Book.fromJson(Map<String, dynamic> j) {
    final copiesJson = (j['Copies'] as List<dynamic>? ?? []);
    final copies = copiesJson
        .map((e) => BookCopy.fromJson(e as Map<String, dynamic>))
        .toList();
    return Book(
      bookId: j['BookID'] as String,
      title: j['Title'] as String,
      author: j['Author'] as String,
      isbn: j['ISBN'] as String?,
      coverImage: j['CoverImage'] as String?,
      category: j['Category'] != null
          ? BookCategory.fromJson(j['Category'] as Map<String, dynamic>)
          : null,
      copies: copies,
      // Trust the server's AvailableCopies if present, else compute
      availableCopies:
          (j['AvailableCopies'] as num?)?.toInt() ??
          copies.where((c) => c.status == 'Available').length,
    );
  }

  int get totalCopies => copies.length;

  /// True if the API gave us a usable URL. Both http(s) and data URLs are renderable.
  bool get hasCover =>
      coverImage != null &&
      coverImage!.isNotEmpty &&
      (coverImage!.startsWith('http://') ||
          coverImage!.startsWith('https://') ||
          coverImage!.startsWith('data:image'));
}
