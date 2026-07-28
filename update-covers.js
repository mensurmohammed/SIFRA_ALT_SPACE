// Update book cover image URLs from Open Library
// Run with: node update-covers.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ohhribezauhdvrisicmm:8z%21kMq2%21Y%3Fxc%3FAr@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
    },
  },
});

// ISBN -> new Open Library cover URL
const coverUpdates = [
  { isbn: "9780451524935", image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg" },
  { isbn: "9780061120084", image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg" },
  { isbn: "9780451526342", image: "https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg" },
  { isbn: "9780743273565", image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg" },
  { isbn: "9780141439518", image: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" },
  { isbn: "9780316769488", image: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg" },
  { isbn: "9780618640157", image: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg" },
  { isbn: "9780544003415", image: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg" },
  { isbn: "9780142437230", image: "https://covers.openlibrary.org/b/isbn/9780142437230-L.jpg" },
  { isbn: "9780679720201", image: "https://covers.openlibrary.org/b/isbn/9780679720201-L.jpg" },
  { isbn: "9780345391803", image: "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg" },
  { isbn: "9780062315007", image: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg" },
  { isbn: "9780446310789", image: "https://covers.openlibrary.org/b/isbn/9780446310789-L.jpg" },
  { isbn: "9780307474278", image: "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg" },
  { isbn: "9781400033416", image: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg" },
  { isbn: "9780060883287", image: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg" },
  { isbn: "9780451528827", image: "https://covers.openlibrary.org/b/isbn/9780451528827-L.jpg" },
  { isbn: "9780141439556", image: "https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg" },
  { isbn: "9780141439600", image: "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg" },
  { isbn: "9780451532008", image: "https://covers.openlibrary.org/b/isbn/9780451532008-L.jpg" },
  // Self Help
  { isbn: "9780743272451", image: "https://covers.openlibrary.org/b/isbn/9780743272451-L.jpg" },
  { isbn: "9781451639612", image: "https://covers.openlibrary.org/b/isbn/9781451639612-L.jpg" },
  { isbn: "9780307465351", image: "https://covers.openlibrary.org/b/isbn/9780307465351-L.jpg" },
  { isbn: "9781582701707", image: "https://covers.openlibrary.org/b/isbn/9781582701707-L.jpg" },
  { isbn: "9780062515674", image: "https://covers.openlibrary.org/b/isbn/9780062515674-L.jpg" },
  { isbn: "9781594484803", image: "https://covers.openlibrary.org/b/isbn/9781594484803-L.jpg" },
  { isbn: "9780061766329", image: "https://covers.openlibrary.org/b/isbn/9780061766329-L.jpg" },
  { isbn: "9781401938093", image: "https://covers.openlibrary.org/b/isbn/9781401938093-L.jpg" },
  { isbn: "9780062457714", image: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg" },
  { isbn: "9783426292839", image: "https://covers.openlibrary.org/b/isbn/9783426292839-L.jpg" },
  { isbn: "9780593189641", image: "https://covers.openlibrary.org/b/isbn/9780593189641-L.jpg" },
  { isbn: "9781501110368", image: "https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg" },
  { isbn: "9780062386342", image: "https://covers.openlibrary.org/b/isbn/9780062386342-L.jpg" },
  { isbn: "9781501124181", image: "https://covers.openlibrary.org/b/isbn/9781501124181-L.jpg" },
  { isbn: "9781847941831", image: "https://covers.openlibrary.org/b/isbn/9781847941831-L.jpg" },
  { isbn: "9781501171994", image: "https://covers.openlibrary.org/b/isbn/9781501171994-L.jpg" },
  { isbn: "9781473668942", image: "https://covers.openlibrary.org/b/isbn/9781473668942-L.jpg" },
  { isbn: "9780143115267", image: "https://covers.openlibrary.org/b/isbn/9780143115267-L.jpg" },
  { isbn: "9780399185045", image: "https://covers.openlibrary.org/b/isbn/9780399185045-L.jpg" },
  { isbn: "9781501144166", image: "https://covers.openlibrary.org/b/isbn/9781501144166-L.jpg" },
  // Philosophy
  { isbn: "9780140449136", image: "https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg" },
  { isbn: "9780140449495", image: "https://covers.openlibrary.org/b/isbn/9780140449495-L.jpg" },
  { isbn: "9780140441048", image: "https://covers.openlibrary.org/b/isbn/9780140441048-L.jpg" },
  { isbn: "9780140445343", image: "https://covers.openlibrary.org/b/isbn/9780140445343-L.jpg" },
  { isbn: "9780140449266", image: "https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg" },
  { isbn: "9780140440393", image: "https://covers.openlibrary.org/b/isbn/9780140440393-L.jpg" },
  { isbn: "9780140441819", image: "https://covers.openlibrary.org/b/isbn/9780140441819-L.jpg" },
  { isbn: "9780486249087", image: "https://covers.openlibrary.org/b/isbn/9780486249087-L.jpg" },
  { isbn: "9780140440461", image: "https://covers.openlibrary.org/b/isbn/9780140440461-L.jpg" },
  { isbn: "9780061122415", image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg" },
  { isbn: "9780486284736", image: "https://covers.openlibrary.org/b/isbn/9780486284736-L.jpg" },
  { isbn: "9780140447477", image: "https://covers.openlibrary.org/b/isbn/9780140447477-L.jpg" },
  { isbn: "9780671201586", image: "https://covers.openlibrary.org/b/isbn/9780671201586-L.jpg" },
  { isbn: "9780060930219", image: "https://covers.openlibrary.org/b/isbn/9780060930219-L.jpg" },
  { isbn: "9780679724292", image: "https://covers.openlibrary.org/b/isbn/9780679724292-L.jpg" },
  { isbn: "9780806509044", image: "https://covers.openlibrary.org/b/isbn/9780806509044-L.jpg" },
  { isbn: "9780140442441", image: "https://covers.openlibrary.org/b/isbn/9780140442441-L.jpg" },
  { isbn: "9780140446173", image: "https://covers.openlibrary.org/b/isbn/9780140446173-L.jpg" },
  { isbn: "9780140445145", image: "https://covers.openlibrary.org/b/isbn/9780140445145-L.jpg" },
  { isbn: "9780465030248", image: "https://covers.openlibrary.org/b/isbn/9780465030248-L.jpg" },
  // History
  { isbn: "9780062316097", image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg" },
  { isbn: "9780307278159", image: "https://covers.openlibrary.org/b/isbn/9780307278159-L.jpg" },
  { isbn: "9780684826967", image: "https://covers.openlibrary.org/b/isbn/9780684826967-L.jpg" },
  { isbn: "9780393312836", image: "https://covers.openlibrary.org/b/isbn/9780393312836-L.jpg" },
  { isbn: "9780375714498", image: "https://covers.openlibrary.org/b/isbn/9780375714498-L.jpg" },
  { isbn: "9780618056866", image: "https://covers.openlibrary.org/b/isbn/9780618056866-L.jpg" },
  { isbn: "9781439190142", image: "https://covers.openlibrary.org/b/isbn/9781439190142-L.jpg" },
  { isbn: "9780307274939", image: "https://covers.openlibrary.org/b/isbn/9780307274939-L.jpg" },
  { isbn: "9781101901403", image: "https://covers.openlibrary.org/b/isbn/9781101901403-L.jpg" },
  { isbn: "9780393047516", image: "https://covers.openlibrary.org/b/isbn/9780393047516-L.jpg" },
  { isbn: "9780140449273", image: "https://covers.openlibrary.org/b/isbn/9780140449273-L.jpg" },
  { isbn: "9780140440355", image: "https://covers.openlibrary.org/b/isbn/9780140440355-L.jpg" },
  { isbn: "9780679640820", image: "https://covers.openlibrary.org/b/isbn/9780679640820-L.jpg" },
  { isbn: "9780525557012", image: "https://covers.openlibrary.org/b/isbn/9780525557012-L.jpg" },
  { isbn: "9780307389565", image: "https://covers.openlibrary.org/b/isbn/9780307389565-L.jpg" },
  { isbn: "9780345386236", image: "https://covers.openlibrary.org/b/isbn/9780345386236-L.jpg" },
  { isbn: "9781416551812", image: "https://covers.openlibrary.org/b/isbn/9781416551812-L.jpg" },
  { isbn: "9780743224542", image: "https://covers.openlibrary.org/b/isbn/9780743224542-L.jpg" },
  { isbn: "9780671454944", image: "https://covers.openlibrary.org/b/isbn/9780671454944-L.jpg" },
  { isbn: "9780395659953", image: "https://covers.openlibrary.org/b/isbn/9780395659953-L.jpg" },
  // Non Fiction
  { isbn: "9780374157067", image: "https://covers.openlibrary.org/b/isbn/9780374157067-L.jpg" },
  { isbn: "9780316017923", image: "https://covers.openlibrary.org/b/isbn/9780316017923-L.jpg" },
  { isbn: "9780062316110", image: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg" },
  { isbn: "9781400052189", image: "https://covers.openlibrary.org/b/isbn/9781400052189-L.jpg" },
  { isbn: "9781501168000", image: "https://covers.openlibrary.org/b/isbn/9781501168000-L.jpg" },
  { isbn: "9781982181284", image: "https://covers.openlibrary.org/b/isbn/9781982181284-L.jpg" },
  { isbn: "9780143111603", image: "https://covers.openlibrary.org/b/isbn/9780143111603-L.jpg" },
  { isbn: "9780399590505", image: "https://covers.openlibrary.org/b/isbn/9780399590505-L.jpg" },
  { isbn: "9781451648546", image: "https://covers.openlibrary.org/b/isbn/9781451648546-L.jpg" },
  { isbn: "9780345472328", image: "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg" },
  { isbn: "9780812973815", image: "https://covers.openlibrary.org/b/isbn/9780812973815-L.jpg" },
  { isbn: "9780393062243", image: "https://covers.openlibrary.org/b/isbn/9780393062243-L.jpg" },
  { isbn: "9780143112709", image: "https://covers.openlibrary.org/b/isbn/9780143112709-L.jpg" },
  { isbn: "9780385534635", image: "https://covers.openlibrary.org/b/isbn/9780385534635-L.jpg" },
  { isbn: "9781400031702", image: "https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg" },
  { isbn: "9781594200090", image: "https://covers.openlibrary.org/b/isbn/9781594200090-L.jpg" },
  { isbn: "9780062316011", image: "https://covers.openlibrary.org/b/isbn/9780062316011-L.jpg" },
  { isbn: "9780812968255", image: "https://covers.openlibrary.org/b/isbn/9780812968255-L.jpg" },
  { isbn: "9780525559474", image: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg" },
  { isbn: "9781501160349", image: "https://covers.openlibrary.org/b/isbn/9781501160349-L.jpg" },
];

async function main() {
  console.log(`\n🖼️  Updating cover images for ${coverUpdates.length} books...\n`);

  let updated = 0;
  let notFound = 0;

  for (const entry of coverUpdates) {
    const result = await prisma.book.updateMany({
      where: { ISBN: entry.isbn },
      data: { CoverImage: entry.image },
    });

    if (result.count > 0) {
      console.log(`  ✅ Updated: ISBN ${entry.isbn} (${result.count} row(s))`);
      updated += result.count;
    } else {
      console.log(`  ⚠️  Not found: ISBN ${entry.isbn}`);
      notFound++;
    }
  }

  console.log(`\n✅ Done! Updated: ${updated} books, Not found: ${notFound}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
