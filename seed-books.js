// Seed script: add books + categories from CSV data
// Run with: node seed-books.js
const { PrismaClient } = require("@prisma/client");
// Use direct connection (bypasses pooler) for seeding
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ohhribezauhdvrisicmm:8z%21kMq2%21Y%3Fxc%3FAr@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
    },
  },
});

const books = [
  // FICTION
  { isbn: "9780451524935", title: "1984", author: "George Orwell", image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", category: "Fiction" },
  { isbn: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee", image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", category: "Fiction" },
  { isbn: "9780451526342", title: "Animal Farm", author: "George Orwell", image: "https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg", category: "Fiction" },
  { isbn: "9780743273565", title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", category: "Fiction" },
  { isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen", image: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg", category: "Fiction" },
  { isbn: "9780316769488", title: "The Catcher in the Rye", author: "J.D. Salinger", image: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg", category: "Fiction" },
  { isbn: "9780618640157", title: "The Hobbit", author: "J.R.R. Tolkien", image: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg", category: "Fiction" },
  { isbn: "9780544003415", title: "The Lord of the Rings", author: "J.R.R. Tolkien", image: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg", category: "Fiction" },
  { isbn: "9780142437230", title: "Don Quixote", author: "Miguel de Cervantes", image: "https://covers.openlibrary.org/b/isbn/9780142437230-L.jpg", category: "Fiction" },
  { isbn: "9780679720201", title: "The Stranger", author: "Albert Camus", image: "https://covers.openlibrary.org/b/isbn/9780679720201-L.jpg", category: "Fiction" },
  { isbn: "9780345391803", title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", image: "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg", category: "Fiction" },
  { isbn: "9780062315007", title: "The Alchemist", author: "Paulo Coelho", image: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg", category: "Fiction" },
  { isbn: "9780446310789", title: "To Kill a Mockingbird (Alt Ed.)", author: "Harper Lee", image: "https://covers.openlibrary.org/b/isbn/9780446310789-L.jpg", category: "Fiction" },
  { isbn: "9780307474278", title: "The Da Vinci Code", author: "Dan Brown", image: "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg", category: "Fiction" },
  { isbn: "9781400033416", title: "Chronicle of a Death Foretold", author: "Gabriel García Márquez", image: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg", category: "Fiction" },
  { isbn: "9780060883287", title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", image: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg", category: "Fiction" },
  { isbn: "9780451528827", title: "Jane Eyre", author: "Charlotte Brontë", image: "https://covers.openlibrary.org/b/isbn/9780451528827-L.jpg", category: "Fiction" },
  { isbn: "9780141439556", title: "Wuthering Heights", author: "Emily Brontë", image: "https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg", category: "Fiction" },
  { isbn: "9780141439600", title: "Great Expectations", author: "Charles Dickens", image: "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg", category: "Fiction" },
  { isbn: "9780451532008", title: "A Tale of Two Cities", author: "Charles Dickens", image: "https://covers.openlibrary.org/b/isbn/9780451532008-L.jpg", category: "Fiction" },
  // SELF HELP
  { isbn: "9780743272451", title: "How to Win Friends and Influence People", author: "Dale Carnegie", image: "https://covers.openlibrary.org/b/isbn/9780743272451-L.jpg", category: "Self Help" },
  { isbn: "9781451639612", title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", image: "https://covers.openlibrary.org/b/isbn/9781451639612-L.jpg", category: "Self Help" },
  { isbn: "9780307465351", title: "The 4-Hour Workweek", author: "Timothy Ferriss", image: "https://covers.openlibrary.org/b/isbn/9780307465351-L.jpg", category: "Self Help" },
  { isbn: "9781582701707", title: "The Secret", author: "Rhonda Byrne", image: "https://covers.openlibrary.org/b/isbn/9781582701707-L.jpg", category: "Self Help" },
  { isbn: "9780062515674", title: "The Four Agreements", author: "Don Miguel Ruiz", image: "https://covers.openlibrary.org/b/isbn/9780062515674-L.jpg", category: "Self Help" },
  { isbn: "9781594484803", title: "Drive", author: "Daniel H. Pink", image: "https://covers.openlibrary.org/b/isbn/9781594484803-L.jpg", category: "Self Help" },
  { isbn: "9780061766329", title: "Good to Great", author: "Jim Collins", image: "https://covers.openlibrary.org/b/isbn/9780061766329-L.jpg", category: "Self Help" },
  { isbn: "9781401938093", title: "You Are a Badass", author: "Jen Sincero", image: "https://covers.openlibrary.org/b/isbn/9781401938093-L.jpg", category: "Self Help" },
  { isbn: "9780062457714", title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", image: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg", category: "Self Help" },
  { isbn: "9783426292839", title: "The Courage to Be Disliked", author: "Ichiro Kishimi", image: "https://covers.openlibrary.org/b/isbn/9783426292839-L.jpg", category: "Self Help" },
  { isbn: "9780593189641", title: "Atomic Habits", author: "James Clear", image: "https://covers.openlibrary.org/b/isbn/9780593189641-L.jpg", category: "Self Help" },
  { isbn: "9781501110368", title: "The 5 AM Club", author: "Robin Sharma", image: "https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg", category: "Self Help" },
  { isbn: "9780062386342", title: "Daring Greatly", author: "Brené Brown", image: "https://covers.openlibrary.org/b/isbn/9780062386342-L.jpg", category: "Self Help" },
  { isbn: "9781501124181", title: "Can't Hurt Me", author: "David Goggins", image: "https://covers.openlibrary.org/b/isbn/9781501124181-L.jpg", category: "Self Help" },
  { isbn: "9781847941831", title: "Ikigai", author: "Héctor García", image: "https://covers.openlibrary.org/b/isbn/9781847941831-L.jpg", category: "Self Help" },
  { isbn: "9781501171994", title: "The Mountain Is You", author: "Brianna Wiest", image: "https://covers.openlibrary.org/b/isbn/9781501171994-L.jpg", category: "Self Help" },
  { isbn: "9781473668942", title: "Mindset", author: "Carol S. Dweck", image: "https://covers.openlibrary.org/b/isbn/9781473668942-L.jpg", category: "Self Help" },
  { isbn: "9780143115267", title: "The Power of Now", author: "Eckhart Tolle", image: "https://covers.openlibrary.org/b/isbn/9780143115267-L.jpg", category: "Self Help" },
  { isbn: "9780399185045", title: "The 5 Second Rule", author: "Mel Robbins", image: "https://covers.openlibrary.org/b/isbn/9780399185045-L.jpg", category: "Self Help" },
  { isbn: "9781501144166", title: "The Power of Habit", author: "Charles Duhigg", image: "https://covers.openlibrary.org/b/isbn/9781501144166-L.jpg", category: "Self Help" },
  // PHILOSOPHY
  { isbn: "9780140449136", title: "The Republic", author: "Plato", image: "https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg", category: "Philosophy" },
  { isbn: "9780140449495", title: "Meditations", author: "Marcus Aurelius", image: "https://covers.openlibrary.org/b/isbn/9780140449495-L.jpg", category: "Philosophy" },
  { isbn: "9780140441048", title: "Beyond Good and Evil", author: "Friedrich Nietzsche", image: "https://covers.openlibrary.org/b/isbn/9780140441048-L.jpg", category: "Philosophy" },
  { isbn: "9780140445343", title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", image: "https://covers.openlibrary.org/b/isbn/9780140445343-L.jpg", category: "Philosophy" },
  { isbn: "9780140449266", title: "Critique of Pure Reason", author: "Immanuel Kant", image: "https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg", category: "Philosophy" },
  { isbn: "9780140440393", title: "The Social Contract", author: "Jean-Jacques Rousseau", image: "https://covers.openlibrary.org/b/isbn/9780140440393-L.jpg", category: "Philosophy" },
  { isbn: "9780140441819", title: "Leviathan", author: "Thomas Hobbes", image: "https://covers.openlibrary.org/b/isbn/9780140441819-L.jpg", category: "Philosophy" },
  { isbn: "9780486249087", title: "The Ethics", author: "Benedict de Spinoza", image: "https://covers.openlibrary.org/b/isbn/9780486249087-L.jpg", category: "Philosophy" },
  { isbn: "9780140440461", title: "The Prince", author: "Niccolò Machiavelli", image: "https://covers.openlibrary.org/b/isbn/9780140440461-L.jpg", category: "Philosophy" },
  { isbn: "9780061122415", title: "The Art of War", author: "Sun Tzu", image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg", category: "Philosophy" },
  { isbn: "9780486284736", title: "Enchiridion", author: "Epictetus", image: "https://covers.openlibrary.org/b/isbn/9780486284736-L.jpg", category: "Philosophy" },
  { isbn: "9780140447477", title: "Letters from a Stoic", author: "Seneca", image: "https://covers.openlibrary.org/b/isbn/9780140447477-L.jpg", category: "Philosophy" },
  { isbn: "9780671201586", title: "A History of Western Philosophy", author: "Bertrand Russell", image: "https://covers.openlibrary.org/b/isbn/9780671201586-L.jpg", category: "Philosophy" },
  { isbn: "9780060930219", title: "Sophie's World", author: "Jostein Gaarder", image: "https://covers.openlibrary.org/b/isbn/9780060930219-L.jpg", category: "Philosophy" },
  { isbn: "9780679724292", title: "The Myth of Sisyphus", author: "Albert Camus", image: "https://covers.openlibrary.org/b/isbn/9780679724292-L.jpg", category: "Philosophy" },
  { isbn: "9780806509044", title: "Being and Nothingness", author: "Jean-Paul Sartre", image: "https://covers.openlibrary.org/b/isbn/9780806509044-L.jpg", category: "Philosophy" },
  { isbn: "9780140442441", title: "The Nicomachean Ethics", author: "Aristotle", image: "https://covers.openlibrary.org/b/isbn/9780140442441-L.jpg", category: "Philosophy" },
  { isbn: "9780140446173", title: "Tao Te Ching", author: "Lao Tzu", image: "https://covers.openlibrary.org/b/isbn/9780140446173-L.jpg", category: "Philosophy" },
  { isbn: "9780140445145", title: "Candide", author: "Voltaire", image: "https://covers.openlibrary.org/b/isbn/9780140445145-L.jpg", category: "Philosophy" },
  { isbn: "9780465030248", title: "I and Thou", author: "Martin Buber", image: "https://covers.openlibrary.org/b/isbn/9780465030248-L.jpg", category: "Philosophy" },
  // HISTORY
  { isbn: "9780062316097", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg", category: "History" },
  { isbn: "9780307278159", title: "The Guns of August", author: "Barbara W. Tuchman", image: "https://covers.openlibrary.org/b/isbn/9780307278159-L.jpg", category: "History" },
  { isbn: "9780684826967", title: "Team of Rivals", author: "Doris Kearns Goodwin", image: "https://covers.openlibrary.org/b/isbn/9780684826967-L.jpg", category: "History" },
  { isbn: "9780393312836", title: "The People's History of the United States", author: "Howard Zinn", image: "https://covers.openlibrary.org/b/isbn/9780393312836-L.jpg", category: "History" },
  { isbn: "9780375714498", title: "The Rise and Fall of the Third Reich", author: "William L. Shirer", image: "https://covers.openlibrary.org/b/isbn/9780375714498-L.jpg", category: "History" },
  { isbn: "9780618056866", title: "The Battle Cry of Freedom", author: "James M. McPherson", image: "https://covers.openlibrary.org/b/isbn/9780618056866-L.jpg", category: "History" },
  { isbn: "9781439190142", title: "1776", author: "David McCullough", image: "https://covers.openlibrary.org/b/isbn/9781439190142-L.jpg", category: "History" },
  { isbn: "9780307274939", title: "The Looming Tower", author: "Lawrence Wright", image: "https://covers.openlibrary.org/b/isbn/9780307274939-L.jpg", category: "History" },
  { isbn: "9781101901403", title: "SPQR: A History of Ancient Rome", author: "Mary Beard", image: "https://covers.openlibrary.org/b/isbn/9781101901403-L.jpg", category: "History" },
  { isbn: "9780393047516", title: "Guns, Germs, and Steel", author: "Jared Diamond", image: "https://covers.openlibrary.org/b/isbn/9780393047516-L.jpg", category: "History" },
  { isbn: "9780140449273", title: "The Histories", author: "Herodotus", image: "https://covers.openlibrary.org/b/isbn/9780140449273-L.jpg", category: "History" },
  { isbn: "9780140440355", title: "History of the Peloponnesian War", author: "Thucydides", image: "https://covers.openlibrary.org/b/isbn/9780140440355-L.jpg", category: "History" },
  { isbn: "9780679640820", title: "The History of the Decline and Fall of the Roman Empire", author: "Edward Gibbon", image: "https://covers.openlibrary.org/b/isbn/9780679640820-L.jpg", category: "History" },
  { isbn: "9780525557012", title: "The Silk Roads", author: "Peter Frankopan", image: "https://covers.openlibrary.org/b/isbn/9780525557012-L.jpg", category: "History" },
  { isbn: "9780307389565", title: "The Warmth of Other Suns", author: "Isabel Wilkerson", image: "https://covers.openlibrary.org/b/isbn/9780307389565-L.jpg", category: "History" },
  { isbn: "9780345386236", title: "The Civil War: A Narrative", author: "Shelby Foote", image: "https://covers.openlibrary.org/b/isbn/9780345386236-L.jpg", category: "History" },
  { isbn: "9781416551812", title: "A World Lit Only by Fire", author: "William Manchester", image: "https://covers.openlibrary.org/b/isbn/9781416551812-L.jpg", category: "History" },
  { isbn: "9780743224542", title: "John Adams", author: "David McCullough", image: "https://covers.openlibrary.org/b/isbn/9780743224542-L.jpg", category: "History" },
  { isbn: "9780671454944", title: "The Story of Civilization", author: "Will Durant", image: "https://covers.openlibrary.org/b/isbn/9780671454944-L.jpg", category: "History" },
  { isbn: "9780395659953", title: "Churchill: A Life", author: "Martin Gilbert", image: "https://covers.openlibrary.org/b/isbn/9780395659953-L.jpg", category: "History" },
  // NON FICTION
  { isbn: "9780374157067", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", image: "https://covers.openlibrary.org/b/isbn/9780374157067-L.jpg", category: "Non Fiction" },
  { isbn: "9780316017923", title: "Outliers", author: "Malcolm Gladwell", image: "https://covers.openlibrary.org/b/isbn/9780316017923-L.jpg", category: "Non Fiction" },
  { isbn: "9780062316110", title: "Homo Deus", author: "Yuval Noah Harari", image: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg", category: "Non Fiction" },
  { isbn: "9781400052189", title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", image: "https://covers.openlibrary.org/b/isbn/9781400052189-L.jpg", category: "Non Fiction" },
  { isbn: "9781501168000", title: "Educated", author: "Tara Westover", image: "https://covers.openlibrary.org/b/isbn/9781501168000-L.jpg", category: "Non Fiction" },
  { isbn: "9781982181284", title: "Steve Jobs", author: "Walter Isaacson", image: "https://covers.openlibrary.org/b/isbn/9781982181284-L.jpg", category: "Non Fiction" },
  { isbn: "9780143111603", title: "The Omnivore's Dilemma", author: "Michael Pollan", image: "https://covers.openlibrary.org/b/isbn/9780143111603-L.jpg", category: "Non Fiction" },
  { isbn: "9780399590505", title: "Bad Blood", author: "John Carreyrou", image: "https://covers.openlibrary.org/b/isbn/9780399590505-L.jpg", category: "Non Fiction" },
  { isbn: "9781451648546", title: "Quiet", author: "Susan Cain", image: "https://covers.openlibrary.org/b/isbn/9781451648546-L.jpg", category: "Non Fiction" },
  { isbn: "9780345472328", title: "The Black Swan", author: "Nassim Nicholas Taleb", image: "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg", category: "Non Fiction" },
  { isbn: "9780812973815", title: "The Tipping Point", author: "Malcolm Gladwell", image: "https://covers.openlibrary.org/b/isbn/9780812973815-L.jpg", category: "Non Fiction" },
  { isbn: "9780393062243", title: "The Great Derangement", author: "Amitav Ghosh", image: "https://covers.openlibrary.org/b/isbn/9780393062243-L.jpg", category: "Non Fiction" },
  { isbn: "9780143112709", title: "The Shock Doctrine", author: "Naomi Klein", image: "https://covers.openlibrary.org/b/isbn/9780143112709-L.jpg", category: "Non Fiction" },
  { isbn: "9780385534635", title: "The Signal and the Noise", author: "Nate Silver", image: "https://covers.openlibrary.org/b/isbn/9780385534635-L.jpg", category: "Non Fiction" },
  { isbn: "9781400031702", title: "Behind the Beautiful Forevers", author: "Katherine Boo", image: "https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg", category: "Non Fiction" },
  { isbn: "9781594200090", title: "The Emperor of All Maladies", author: "Siddhartha Mukherjee", image: "https://covers.openlibrary.org/b/isbn/9781594200090-L.jpg", category: "Non Fiction" },
  { isbn: "9780062316011", title: "Blink", author: "Malcolm Gladwell", image: "https://covers.openlibrary.org/b/isbn/9780062316011-L.jpg", category: "Non Fiction" },
  { isbn: "9780812968255", title: "Reading Lolita in Tehran", author: "Azar Nafisi", image: "https://covers.openlibrary.org/b/isbn/9780812968255-L.jpg", category: "Non Fiction" },
  { isbn: "9780525559474", title: "Factfulness", author: "Hans Rosling", image: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg", category: "Non Fiction" },
  { isbn: "9781501160349", title: "Born a Crime", author: "Trevor Noah", image: "https://covers.openlibrary.org/b/isbn/9781501160349-L.jpg", category: "Non Fiction" },
];

async function main() {
  console.log(`\n📚 Starting book import — ${books.length} books\n`);

  // 1. Collect unique category names from the CSV
  const uniqueCategories = [...new Set(books.map((b) => b.category))];

  // 2. Get or create categories
  const categoryMap = {};
  for (const name of uniqueCategories) {
    let cat = await prisma.bookCategory.findFirst({ where: { CategoryName: name } });
    if (!cat) {
      cat = await prisma.bookCategory.create({ data: { CategoryName: name } });
      console.log(`  ✅ Created category: ${name}`);
    } else {
      console.log(`  ♻️  Existing category: ${name}`);
    }
    categoryMap[name] = cat.CategoryID;
  }

  // 3. Insert books + one copy each
  let created = 0;
  let skipped = 0;

  for (const b of books) {
    const categoryID = categoryMap[b.category];

    // Skip if ISBN already exists
    const existing = await prisma.book.findFirst({ where: { ISBN: b.isbn } });
    if (existing) {
      console.log(`  ⏭  Skipped (already exists): ${b.title}`);
      skipped++;
      continue;
    }

    const book = await prisma.book.create({
      data: {
        ISBN: b.isbn,
        Title: b.title,
        Author: b.author,
        CoverImage: b.image,
        CategoryID: categoryID,
        Language: "English",
      },
    });

    // Create one Available copy with barcode = ISBN
    await prisma.bookCopy.create({
      data: {
        BookID: book.BookID,
        Barcode: b.isbn,
        Condition: "Good",
        Status: "Available",
      },
    });

    console.log(`  📖 Created: ${b.title} (${b.author})`);
    created++;
  }

  console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
