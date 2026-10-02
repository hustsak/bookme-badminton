"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BrandLogoStrip } from "@/components/BrandLogoStrip";
import { ShuttlecockHero } from "@/components/ShuttlecockHero";
import { MobileBadmintonHero } from "@/components/MobileBadmintonHero";
import { MobileQuickFilters } from "@/components/MobileQuickFilters";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { ShoeStepAnimation } from "@/components/ShoeStepAnimation";
import { CalendarModal } from "@/components/CalendarModal";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { useApp } from "@/context/AppContext";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  Heart,
  X,
  Check,
  Zap,
  Sparkles,
  Calendar,
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
    image: "/court_image/c1.jpeg",
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
    image: "/court_image/c2.jpeg",
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
    image: "/court_image/c3.jpeg",
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
    image: "/court_image/c4.jpg",
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
    image: "/court_image/c5.webp",
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
    image: "/court_image/c6.webp",
    available: true,
    tags: ["Affordable", "Parking"],
  },
];

export default function ExplorePage() {
  const { toggleFavorite, isFavorite } = useApp();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [maxPrice, setMaxPrice] = useState("All prices");
  const [sort, setSort] = useState("recommended");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const activeFiltersCount =
    (location !== "All locations" ? 1 : 0) +
    (maxPrice !== "All prices" ? 1 : 0) +
    (availableOnly ? 1 : 0) +
    (sort !== "recommended" ? 1 : 0);

  const handleResetFilters = () => {
    setSearch("");
    setLocation("All locations");
    setMaxPrice("All prices");
    setSort("recommended");
    setAvailableOnly(false);
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setSelectedDate(`${y}-${m}-${d}`);
  };

  const filteredCourts = useMemo(() => {
    let result = courts.filter((court) => {
      const matchesSearch =
        court.name.toLowerCase().includes(search.toLowerCase()) ||
        court.location.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        location === "All locations" || court.location.includes(location);

      const matchesPrice =
        maxPrice === "All prices" || court.price <= Number(maxPrice);

      const matchesAvailability = !availableOnly || court.available;

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

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#17201c] overflow-x-hidden pb-24 sm:pb-8">
      <Navbar />
      <LoginModal />

      {/* BRAND LOGOS STRIP */}
      <BrandLogoStrip />

      {/* HERO SECTION WITH ANIMATED 3D SHUTTLECOCK */}
      <section className="relative mx-auto max-w-7xl px-4 pb-4 pt-1 sm:px-6 sm:pb-8 sm:pt-0">
        <div className="grid items-center gap-6 lg:gap-8 lg:grid-cols-12">
          {/* Left Hero Details */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-7 z-10"
          >
            {/* Mobile View: Dedicated Mobile Badminton Action Widget */}
            <div className="lg:hidden">
              <MobileBadmintonHero />
            </div>

            {/* Title: Hidden on mobile to keep focus on interactive mobile card */}
            <div className="hidden sm:block mt-2 sm:-mt-6">
              <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#17201c] sm:text-4xl lg:text-[3.35rem] lg:leading-[1.12]">
                Book your court<span className="text-[#a8e63d]">.</span>
                <br />
                <span className="text-[#4e5b52]">ShuttleUp-SmashMode</span>
                <span className="text-[#78a72b]">.</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#7a857e] font-medium">
                Hanoi&apos;s premier badminton venue network. Instant booking, zero wait.
              </p>
            </div>

            {/* Mobile Native Search Bar & Horizontal Quick Filters */}
            <div className="sm:hidden mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white border border-[#dfe6dc] px-3.5 py-2.5 shadow-sm">
                  <Search className="h-4 w-4 shrink-0 text-[#78a72b]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search venue or district..."
                    className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-[#9ea8a0] text-[#17201c]"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="text-[#8e9891] active:scale-90"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsFilterSheetOpen(true)}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition active:scale-95 shadow-sm ${
                    activeFiltersCount > 0
                      ? "border-[#a8e63d] bg-[#17201c] text-[#a8e63d]"
                      : "border-[#dfe6dc] bg-white text-[#17201c]"
                  }`}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#a8e63d] px-1 text-[9px] font-black text-[#17201c] shadow">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Horizontal Touch Scroll Quick Filters */}
              <MobileQuickFilters
                location={location}
                setLocation={setLocation}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                availableOnly={availableOnly}
                setAvailableOnly={setAvailableOnly}
                sort={sort}
                setSort={setSort}
                selectedDate={selectedDate}
                onOpenCalendarModal={() => setIsCalendarOpen(true)}
                onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
              />
            </div>

            {/* Desktop Integrated Hero Search & Filter Card */}
            <div className="hidden sm:block mt-4 rounded-[22px] border border-[#e1e7df] bg-white p-3.5 sm:p-4 shadow-[0_10px_35px_rgba(23,32,28,0.05)] backdrop-blur-md">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="flex flex-1 items-center gap-2.5 rounded-[14px] bg-[#f5f7f3] px-3.5 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-[#8e9891]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search venue or district..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ea8a0]"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} aria-label="Clear search">
                      <X className="h-4 w-4 text-[#8e9891]" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  {/* Desktop Date Picker Button */}
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(true)}
                    className="flex items-center gap-2 rounded-[14px] border border-[#e5eae2] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#3a443e] hover:border-[#a8e63d] transition active:scale-95 shrink-0"
                    title="Choose date from calendar"
                  >
                    <Calendar className="h-4 w-4 text-[#78a72b]" />
                    <span>
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </button>

                  <select
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="rounded-[14px] border border-[#e5eae2] bg-white px-3 py-2.5 text-xs sm:text-sm font-medium outline-none text-[#3a443e]"
                  >
                    <option>All locations</option>
                    <option>Thanh Xuan</option>
                    <option>Cau Giay</option>
                    <option>Dong Da</option>
                  </select>

                  <select
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    className="rounded-[14px] border border-[#e5eae2] bg-white px-3 py-2.5 text-xs sm:text-sm font-medium outline-none text-[#3a443e]"
                  >
                    <option value="All prices">All prices</option>
                    <option value="5">Under $5/hr</option>
                    <option value="6">Under $6/hr</option>
                    <option value="8">Under $8/hr</option>
                  </select>

                  <button
                    onClick={() => {
                      document.getElementById("venues")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-[14px] bg-[#a8e63d] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#17201c] shadow-sm transition hover:bg-[#b8ef59] hover:shadow active:scale-95 shrink-0"
                  >
                    <span>Book Now!</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#edf1ea] pt-3 text-xs">
                <button
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium transition ${
                    availableOnly
                      ? "border-[#a8e63d] bg-[#f0fae1] text-[#4f781a]"
                      : "border-[#e3e8e1] bg-white text-[#69746c]"
                  }`}
                >
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                      availableOnly ? "bg-[#a8e63d]" : "border border-[#bdc6be]"
                    }`}
                  >
                    {availableOnly && <Check className="h-2.5 w-2.5" />}
                  </span>
                  Available courts only
                </button>

                <div className="flex items-center gap-1.5 text-[#6c7870]">
                  <ArrowUpDown className="h-3.5 w-3.5 text-[#87918a]" />
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="bg-transparent text-xs font-semibold text-[#48534c] outline-none"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="rating">Highest rated</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-full border border-[#dfe6dc] bg-white px-3 py-1 text-xs shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-[#80b52e]" />
                <span className="font-semibold text-[#17201c]">Hanoi, Vietnam</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-[#e0e7dd] bg-white/90 px-3 py-1 text-xs font-bold text-[#556358]">
                <span className="h-2 w-2 rounded-full bg-[#8dcf36] animate-pulse" />
                {filteredCourts.length} Courts Matched
              </div>
            </div>

            {/* Stepping Badminton Shoe Court Animation */}
            <div className="mt-3 w-full">
              <ShoeStepAnimation />
            </div>
          </motion.div>

          {/* Right Side (Desktop): Animated 3D Badminton Shuttlecock Model */}
          <div className="hidden lg:flex lg:col-span-5 justify-end items-center">
            <ShuttlecockHero />
          </div>
        </div>
      </section>

      {/* RESULTS / VENUES */}
      <section id="venues" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#17201c] flex items-center gap-2">
              <span>Available Venues</span>
              <span className="flex h-5 items-center justify-center rounded-full bg-[#a8e63d] px-2 text-[10px] font-black text-[#17201c]">
                {filteredCourts.length}
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-[#89938c]">
              Select a court to book slots & view amenities
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-[#89938c] sm:flex">
            <SlidersHorizontal className="h-4 w-4" />
            Refine your search
          </div>
        </div>

        {/* Court Cards Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourts.map((court, index) => {
            const isFav = isFavorite(court.id);
            return (
              <motion.article
                key={court.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileTap={{ scale: 0.98 }}
                className="group overflow-hidden rounded-[24px] sm:rounded-[26px] border border-[#e0e6de] bg-white shadow-[0_4px_24px_rgba(35,55,35,.04)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(35,55,35,.09)]"
              >
                <div className="relative overflow-hidden aspect-[16/10] sm:aspect-auto sm:h-52 w-full">
                  <img
                    src={court.image}
                    alt={court.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#35521b] shadow-sm backdrop-blur-md">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        court.available ? "bg-[#8dcf36] animate-pulse" : "bg-[#e1a15d]"
                      }`}
                    />
                    {court.available ? "Available Now" : "Fully Booked"}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleFavorite(court.id)}
                    aria-label="Toggle favorite"
                    className="absolute right-3 top-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isFav ? "fill-[#ed7181] text-[#ed7181]" : "text-[#69746c]"
                      }`}
                    />
                  </motion.button>

                  {/* Bottom Tags on Image */}
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {court.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price Tag Floating Pill on Mobile */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-[#17201c]/90 border border-white/20 px-2.5 py-1 text-[11px] font-black text-[#a8e63d] backdrop-blur-md">
                    ${court.price}<span className="text-[9px] font-normal text-white/80">/hr</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#17201c] group-hover:text-[#456e17] transition-colors">
                        {court.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#8a948d]">
                        <MapPin className="h-3.5 w-3.5 text-[#78a72b] shrink-0" />
                        <span>{court.location}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-xl bg-[#fff8e8] px-2 py-1 text-xs font-black text-[#8f6600] border border-[#f5e3b5]">
                      <Star className="h-3.5 w-3.5 fill-[#f2bd48] text-[#f2bd48]" />
                      <span>{court.rating}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-[#89938c]">
                    <span>{court.reviews} reviews</span>
                    <span>·</span>
                    <span>{court.courts} courts</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#edf0eb] pt-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#929c95]">Rate</span>
                      <p className="text-base sm:text-lg font-extrabold text-[#17201c]">
                        ${court.price}
                        <span className="ml-1 text-xs font-normal text-[#929c95]">
                          / hour
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/courts/${court.id}?date=${selectedDate}`}
                      className="flex items-center gap-1.5 rounded-full bg-[#a8e63d] px-4 py-2 text-xs font-black text-[#17201c] transition-all hover:bg-[#b8ef59] active:scale-95 shadow-sm"
                    >
                      <span>Book Court</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* MOBILE FILTER BOTTOM SHEET */}
      <MobileFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        location={location}
        setLocation={setLocation}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        selectedDate={selectedDate}
        onOpenCalendar={() => {
          setIsFilterSheetOpen(false);
          setIsCalendarOpen(true);
        }}
        totalFilteredCount={filteredCourts.length}
        onReset={handleResetFilters}
      />

      {/* CALENDAR MODAL */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        title="Select Match Date"
      />

      {/* FOOTER */}
      <footer className="border-t border-[#e1e7df] bg-white/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-8 text-xs text-[#89938c] sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 font-bold text-[#17201c]">
            <img
              src="/logo.png"
              alt="BookMeBadminton Logo"
              className="h-6 w-6 rounded-lg object-contain bg-white p-0.5 shadow-sm ring-1 ring-[#e1e7df]"
            />
            <span>BookMeBadminton.</span>
          </div>
          <span>Find. Book. Play.</span>
          <span>© 2026 BookMeBadminton</span>
        </div>
      </footer>
    </main>
  );
}