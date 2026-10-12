import '../../models/book.dart';

class AvailableCopy {
  final String copyId;
  final String barcode;
  final String bookTitle;
  final String author;
  final String categoryName;
  final String? coverImage;

  AvailableCopy({
    required this.copyId,
    required this.barcode,
    required this.bookTitle,
    required this.author,
    required this.categoryName,
    this.coverImage,
  });

  /// Flatten all books → only copies with Status == "Available"
  static List<AvailableCopy> fromBooks(List<Book> books) {
    final result = <AvailableCopy>[];
    for (final b in books) {
      for (final c in b.copies) {
        if (c.status == 'Available') {
          result.add(
            AvailableCopy(
              copyId: c.copyId,
              barcode: c.barcode,
              bookTitle: b.title,
              author: b.author,
              categoryName: b.category?.categoryName ?? '',
              coverImage: b.coverImage,
            ),
          );
        }
      }
    }
    return result;
  }
}
