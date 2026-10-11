class Category {
  final String categoryId;
  final String categoryName;

  Category({required this.categoryId, required this.categoryName});

  factory Category.fromJson(Map<String, dynamic> j) => Category(
    categoryId: j['CategoryID'] as String,
    categoryName: j['CategoryName'] as String,
  );
}
