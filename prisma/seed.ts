import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BookMe Badminton database...");

  // Clear demo data
  await prisma.booking.deleteMany();
  await prisma.court.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------
  // Demo user
  // ---------------------------------------------

  const user = await prisma.user.create({
    data: {
      name: "Demo Player",
      email: "player@bookme.test",
    },
  });

  // ---------------------------------------------
  // Smash Arena
  // ---------------------------------------------

  const smashArena = await prisma.venue.create({
    data: {
      name: "Smash Arena",
      location: "Hanoi",
      description:
        "Premium badminton venue with professional courts and modern facilities.",
      rating: 4.9,
      reviewCount: 128,
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
      courts: {
        create: [
          {
            name: "Court 01",
            priceHour: 100000,
          },
          {
            name: "Court 02",
            priceHour: 100000,
          },
          {
            name: "Court 03",
            priceHour: 120000,
          },
          {
            name: "Court 04",
            priceHour: 120000,
          },
        ],
      },
    },
  });

  // ---------------------------------------------
  // Victory Club
  // ---------------------------------------------

  const victoryClub = await prisma.venue.create({
    data: {
      name: "Victory Club",
      location: "Hanoi",
      description:
        "Spacious badminton club designed for casual and competitive players.",
      rating: 4.8,
      reviewCount: 96,
      imageUrl:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
      courts: {
        create: [
          {
            name: "Court 01",
            priceHour: 110000,
          },
          {
            name: "Court 02",
            priceHour: 110000,
          },
          {
            name: "Court 03",
            priceHour: 130000,
          },
        ],
      },
    },
  });

  // ---------------------------------------------
  // Pro Court
  // ---------------------------------------------

  const proCourt = await prisma.venue.create({
    data: {
      name: "Pro Court",
      location: "Hanoi",
      description:
        "Professional-grade badminton facility with high-quality flooring.",
      rating: 4.7,
      reviewCount: 74,
      imageUrl:
        "https://images.unsplash.com/photo-1613918431703-aa50889e3be3?auto=format&fit=crop&w=1200&q=80",
      courts: {
        create: [
          {
            name: "Court 01",
            priceHour: 130000,
          },
          {
            name: "Court 02",
            priceHour: 130000,
          },
          {
            name: "Court 03",
            priceHour: 150000,
          },
        ],
      },
    },
  });

  console.log("✅ Created demo user:", user.email);
  console.log("✅ Created venue:", smashArena.name);
  console.log("✅ Created venue:", victoryClub.name);
  console.log("✅ Created venue:", proCourt.name);

  console.log("🎉 Seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });