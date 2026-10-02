
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  Clock,
  Heart,
  X,
  Check,
} from "lucide-react";

const courts = [
  {
    id: 1,
    name: "Smash Arena",
    location: "Thanh Xuan, Hanoi",
    rating: 4.9,
    reviews: 128,
    price: 6,
    courts: 8,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=85",
    available: true,
    tags: ["Premium", "Air-conditioned"],
  },
  {
    id: 2,
    name: "Victory Badminton Club",
    location: "Cau Giay, Hanoi",
    rating: 4.8,
    reviews: 96,
    price: 5,
    courts: 6,
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=85",
    available: true,
    tags: ["Popular", "Parking"],
  },
  {
    id: 3,
    name: "Pro Court",
    location: "Dong Da, Hanoi",
    rating: 4.7,
    reviews: 84,
    price: 7,
    courts: 10,
    image:
      "https://images.unsplash.com/photo-1613918431703-aa50889e3be8?auto=format&fit=crop&w=1000&q=85",
    available: true,
    tags: ["Professional", "Premium"],
  },
  {
    id: 4,
    name: "Green Shuttle",
    location: "Thanh Xuan, Hanoi",
    rating: 4.6,
    reviews: 72,
    price: 4,
    courts: 5,
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=85",
    available: false,
    tags: ["Affordable", "Parking"],
  },
  {
    id: 5,
    name: "Ace Sports Center",
    location: "Cau Giay, Hanoi",
    rating: 4.9,
    reviews: 156,
    price: 8,
    courts: 12,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=85",
    available: true,
    tags: ["Premium", "Professional"],
  },
  {
    id: 6,
    name: "Shuttle House",
    location: "Dong Da, Hanoi",
    rating: 4.5,
    reviews: 54,
    price: 5,
    courts: 4,
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=85",
    available: true,
    tags: ["Affordable", "Parking"],
  },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [maxPrice, setMaxPrice] = useState("All prices");
  const [sort, setSort] = useState("recommended");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredCourts = useMemo(() => {
    let result = courts.filter((court) => {
      const matchesSearch =
        court.name.toLowerCase().includes(search.toLowerCase()) ||
        court.location.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        location === "All locations" ||
        court.location.includes(location);

      const matchesPrice =
        maxPrice === "All prices" ||
        court.price <= Number(maxPrice);

      const matchesAvailability =
        !availableOnly || court.available;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPrice &&
        matchesAvailability
      );
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, location, maxPrice, sort, availableOnly]);

  function toggleFavorite(id: number) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#17201c]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-[#e1e7df] bg-[#f7f8f4]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#a8e63d]">
              B
            </span>
            BookMe<span className="text-[#78a72b]">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/explore" className="text-sm font-semibold text-[#17201c]">
              Explore
            </Link>
            <Link href="/bookings" className="text-sm text-[#7c867f] hover:text-[#17201c]">
              My Bookings
            </Link>
            <Link href="/favorites" className="text-sm text-[#7c867f] hover:text-[#17201c]">
              Favorites
            </Link>
          </div>

          <button className="rounded-full bg-[#17201c] px-5 py-2.5 text-sm font-semibold text-white">
            Log in
          </button>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-6 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-4 flex items-center gap-2 text-sm text-[#87918a]">
            <Link href="/" className="hover:text-[#17201c]">Home</Link>
            <span>/</span>
            <span className="font-medium text-[#17201c]">Explore</span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#78a72b]">
                Find your game
              </span>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                Explore courts<span className="text-[#a8d94d]">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#7c867f] sm:text-base">
                Discover places to play, compare prices, and find
                the perfect time for your next match.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#dfe6dc] bg-white px-4 py-2.5 text-sm">
              <MapPin className="h-4 w-4 text-[#80b52e]" />
              <span className="font-medium">Hanoi, Vietnam</span>
              <span className="text-[#a3aca5]">⌄</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="rounded-[24px] border border-[#e1e7df] bg-white p-4 shadow-[0_8px_35px_rgba(35,55,35,.04)] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-[14px] bg-[#f5f7f3] px-4">
              <Search className="h-5 w-5 shrink-0 text-[#929c95]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search venue or district..."
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#a0aaa2]"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search">
                  <X className="h-4 w-4 text-[#929c95]" />
                </button>
              )}
            </div>

            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="rounded-[14px] border border-[#e5eae3] bg-white px-4 py-4 text-sm outline-none"
            >
              <option>All locations</option>
              <option>Thanh Xuan</option>
              <option>Cau Giay</option>
              <option>Dong Da</option>
            </select>

            <select
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="rounded-[14px] border border-[#e5eae3] bg-white px-4 py-4 text-sm outline-none"
            >
              <option value="All prices">All prices</option>
              <option value="5">Under $5/hour</option>
              <option value="6">Under $6/hour</option>
              <option value="8">Under $8/hour</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0eb] pt-4">
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${
                availableOnly
                  ? "border-[#a8e63d] bg-[#eff9df] text-[#547d1c]"
                  : "border-[#e3e8e1] bg-white text-[#69746c]"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full ${
                availableOnly ? "bg-[#a8e63d]" : "border border-[#bdc6be]"
              }`}>
                {availableOnly && <Check className="h-3 w-3" />}
              </span>
              Available courts only
            </button>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#87918a]" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="bg-transparent text-xs font-semibold text-[#58635b] outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Available venues
            </h2>
            <p className="mt-1 text-sm text-[#89938c]">
              {filteredCourts.length} venues found
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-[#89938c] sm:flex">
            <SlidersHorizontal className="h-4 w-4" />
            Refine your search
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourts.map((court, index) => (
            <motion.article
              key={court.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="group overflow-hidden rounded-[25px] border border-[#e0e6de] bg-white shadow-[0_7px_28px_rgba(35,55,35,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,55,35,.10)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={court.image}
                  alt={court.name}
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-[11px] font-semibold text-[#456a20] shadow-sm backdrop-blur">
                  <span className={`h-2 w-2 rounded-full ${court.available ? "bg-[#8dcf36]" : "bg-[#e1a15d]"}`} />
                  {court.available ? "Availability shown in demo" : "No demo availability"}
                </div>

                <button
                  onClick={() => toggleFavorite(court.id)}
                  aria-label="Toggle favorite"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(court.id)
                        ? "fill-[#ed7181] text-[#ed7181]"
                        : "text-[#69746c]"
                    }`}
                  />
                </button>

                <div className="absolute bottom-4 left-4 flex gap-2">
                  {court.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold">{court.name}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#8a948d]">
                      <MapPin className="h-3.5 w-3.5" />
                      {court.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-[#f2bd48] text-[#f2bd48]" />
                    {court.rating}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-[#89938c]">
                  <span>{court.reviews} reviews</span>
                  <span>·</span>
                  <span>{court.courts} courts</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#edf0eb] pt-4">
                  <div>
                    <span className="text-[11px] text-[#929c95]">From</span>
                    <p className="text-lg font-bold">
                      ${court.price}
                      <span className="ml-1 text-xs font-normal text-[#929c95]">/ hour</span>
                    </p>
                  </div>

                  <Link
                    href={`/courts/${court.id}`}
                    className="flex items-center gap-2 rounded-full bg-[#a8e63d] px-4 py-2.5 text-xs font-bold text-[#17201c] transition hover:bg-[#b8ef59]"
                  >
                    View court
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredCourts.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#d7dfd5] bg-white py-20 text-center">
            <Search className="mx-auto h-8 w-8 text-[#aab5ac]" />
            <h3 className="mt-4 font-bold">No courts found</h3>
            <p className="mt-2 text-sm text-[#89938c]">
              Try changing your search or filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setLocation("All locations");
                setMaxPrice("All prices");
                setAvailableOnly(false);
              }}
              className="mt-5 rounded-full bg-[#a8e63d] px-5 py-2.5 text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e1e7df] bg-white/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-[#89938c] sm:flex-row sm:justify-between">
          <span className="font-bold text-[#17201c]">BookMe.</span>
          <span>Find. Book. Play.</span>
          <span>© 2026 BookMe Badminton</span>
        </div>
      </footer>
    </main>
  );
}