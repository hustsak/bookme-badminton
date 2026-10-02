
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock3,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";

const venues = [
  {
    id: 1,
    name: "Smash Arena",
    location: "Thanh Xuân, Hanoi",
    rating: 4.9,
    reviews: 128,
    price: 120000,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1613918431703-aa50889e5be3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=85",
    ],
    courts: 6,
  },
  {
    id: 2,
    name: "Victory Club",
    location: "Cầu Giấy, Hanoi",
    rating: 4.8,
    reviews: 94,
    price: 100000,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1613918431703-aa50889e5be3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=85",
    ],
    courts: 4,
  },
  {
    id: 3,
    name: "Pro Court",
    location: "Đống Đa, Hanoi",
    rating: 4.7,
    reviews: 76,
    price: 140000,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1613918431703-aa50889e5be3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=85",
    ],
    courts: 8,
  },
];

const timeSlots = [
  { time: "06:00", available: true },
  { time: "07:00", available: true },
  { time: "08:00", available: false },
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
  { time: "18:00", available: false },
  { time: "19:00", available: true },
  { time: "20:00", available: true },
  { time: "21:00", available: true },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CourtDetailsPage() {
  const params = useParams<{ id: string }>();
  const venueId = Number(params.id);

  const venue = venues.find((item) => item.id === venueId) ?? venues[0];

  const [selectedCourt, setSelectedCourt] = useState(1);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [duration, setDuration] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      return {
        value: index,
        label:
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : formatDate(date),
        day: date.getDate(),
      };
    });
  }, []);

  const total = venue.price * duration;

  return (
    <main className="min-h-screen bg-[#F7F8F4] text-[#17201C] pb-28 lg:pb-10">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#E3E8E1]/80 bg-[#F7F8F4]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link
            href="/explore"
            className="group flex items-center gap-2 text-sm font-semibold"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3E8E1] bg-white transition group-hover:bg-[#A8E63D]">
              <ChevronLeft size={19} />
            </span>

            <span className="hidden sm:inline">
              Back to courts
            </span>
          </Link>

          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            Book<span className="text-[#79B900]">Me</span>
          </Link>

          <button
            onClick={() => setFavorite(!favorite)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              favorite
                ? "border-[#A8E63D] bg-[#A8E63D]"
                : "border-[#E3E8E1] bg-white hover:border-[#A8E63D]"
            }`}
          >
            <Heart
              size={18}
              fill={favorite ? "currentColor" : "none"}
            />
          </button>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">

        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center gap-2 text-sm text-[#68736C]">
          <Link href="/" className="hover:text-[#17201C]">
            Home
          </Link>

          <span>/</span>

          <Link
            href="/explore"
            className="hover:text-[#17201C]"
          >
            Explore
          </Link>

          <span>/</span>

          <span className="text-[#17201C]">
            {venue.name}
          </span>
        </div>

        {/* GALLERY */}
        <section className="grid h-[360px] grid-cols-1 gap-3 overflow-hidden rounded-[30px] md:grid-cols-3">

          <div className="relative overflow-hidden md:col-span-2">

            <img
              src={venue.images[0]}
              alt={venue.name}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#78B900]" />
              Open now
            </div>

          </div>

          <div className="hidden grid-rows-2 gap-3 md:grid">

            <img
              src={venue.images[1]}
              alt=""
              className="h-full w-full rounded-[22px] object-cover"
            />

            <img
              src={venue.images[2]}
              alt=""
              className="h-full w-full rounded-[22px] object-cover"
            />

          </div>

        </section>

        {/* VENUE INFO */}
        <section className="mt-7 grid gap-8 lg:grid-cols-[1fr_390px]">

          <div>

            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  {venue.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#68736C]">

                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {venue.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Star
                      size={16}
                      fill="#A8E63D"
                      className="text-[#79B900]"
                    />

                    <strong className="text-[#17201C]">
                      {venue.rating}
                    </strong>

                    ({venue.reviews} reviews)
                  </span>

                </div>

              </div>

              <div className="rounded-2xl border border-[#E3E8E1] bg-white px-4 py-3">

                <p className="text-xs text-[#68736C]">
                  From
                </p>

                <p className="text-xl font-black">
                  {venue.price.toLocaleString()}₫

                  <span className="text-xs font-medium text-[#68736C]">
                    {" "} / hour
                  </span>
                </p>

              </div>

            </div>

            {/* QUICK INFO */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

              {[
                {
                  icon: <Zap size={18} />,
                  title: "Instant booking",
                },
                {
                  icon: <ShieldCheck size={18} />,
                  title: "Secure payment",
                },
                {
                  icon: <Users size={18} />,
                  title: `${venue.courts} courts`,
                },
                {
                  icon: <Clock3 size={18} />,
                  title: "06:00–22:00",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E3E8E1] bg-white p-4"
                >

                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#79B900]">
                    {item.icon}
                  </div>

                  <p className="text-sm font-bold">
                    {item.title}
                  </p>

                </div>

              ))}

            </div>

            {/* COURT SELECTOR */}
            <div className="mt-10">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-black">
                    Choose a court
                  </h2>

                  <p className="mt-1 text-sm text-[#68736C]">
                    Select the court you want to play on.
                  </p>
                </div>

                <span className="rounded-full bg-[#FFF4D6] px-3 py-1.5 text-xs font-bold text-[#8B6B18]">
                  Demo availability
                </span>

              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {Array.from(
                  {
                    length: Math.min(venue.courts, 6),
                  },
                  (_, index) => index + 1
                ).map((court) => (

                  <motion.button
                    key={court}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCourt(court)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedCourt === court
                        ? "border-[#A8E63D] bg-[#A8E63D]"
                        : "border-[#E3E8E1] bg-white hover:border-[#BFD4B7]"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-black">
                        Court {court}
                      </span>

                      {selectedCourt === court && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17201C] text-white">
                          <Check size={14} />
                        </span>
                      )}

                    </div>

                    <p
                      className={`mt-2 text-xs ${
                        selectedCourt === court
                          ? "text-[#40520E]"
                          : "text-[#68736C]"
                      }`}
                    >
                      Professional court
                    </p>

                  </motion.button>

                ))}

              </div>

            </div>

            {/* DATE */}
            <div className="mt-10">

              <div className="mb-4">

                <h2 className="text-xl font-black">
                  Pick a date
                </h2>

                <p className="mt-1 text-sm text-[#68736C]">
                  Choose when you want to play.
                </p>

              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">

                {dates.map((date) => (

                  <motion.button
                    key={date.value}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedDate(date.value)}
                    className={`min-w-[92px] rounded-2xl border px-4 py-4 text-center transition ${
                      selectedDate === date.value
                        ? "border-[#A8E63D] bg-[#A8E63D]"
                        : "border-[#E3E8E1] bg-white hover:border-[#BFD4B7]"
                    }`}
                  >

                    <CalendarDays
                      size={17}
                      className="mx-auto mb-2 opacity-70"
                    />

                    <p className="text-xs font-semibold">
                      {date.label}
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {date.day}
                    </p>

                  </motion.button>

                ))}

              </div>

            </div>

            {/* TIME */}
            <div className="mt-10">

              <div className="mb-4 flex items-end justify-between">

                <div>

                  <h2 className="text-xl font-black">
                    Choose a time
                  </h2>

                  <p className="mt-1 text-sm text-[#68736C]">
                    Green slots are available.
                  </p>

                </div>

                <div className="hidden items-center gap-3 text-xs sm:flex">

                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#A8E63D]" />
                    Available
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E3E8E1]" />
                    Booked
                  </span>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">

                {timeSlots.map((slot) => {

                  const selected =
                    selectedTime === slot.time;

                  return (
                    <motion.button
                      key={slot.time}
                      whileTap={
                        slot.available
                          ? { scale: 0.96 }
                          : undefined
                      }
                      disabled={!slot.available}
                      onClick={() =>
                        setSelectedTime(slot.time)
                      }
                      className={`rounded-2xl border px-3 py-4 text-sm font-bold transition ${
                        !slot.available
                          ? "cursor-not-allowed border-[#E8EBE6] bg-[#EEF1EC] text-[#A2AAA3]"
                          : selected
                            ? "border-[#A8E63D] bg-[#A8E63D]"
                            : "border-[#E3E8E1] bg-white hover:border-[#A8E63D]"
                      }`}
                    >
                      {slot.time}
                    </motion.button>
                  );
                })}

              </div>

            </div>

            {/* DURATION */}
            <div className="mt-10">

              <div className="mb-4">

                <h2 className="text-xl font-black">
                  Duration
                </h2>

                <p className="mt-1 text-sm text-[#68736C]">
                  How long do you want to play?
                </p>

              </div>

              <div className="flex w-fit items-center rounded-2xl border border-[#E3E8E1] bg-white p-2">

                <button
                  onClick={() =>
                    setDuration(Math.max(1, duration - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EEF1EC]"
                >
                  <Minus size={17} />
                </button>

                <div className="min-w-24 text-center">

                  <span className="text-lg font-black">
                    {duration}
                  </span>

                  <span className="ml-1 text-sm text-[#68736C]">
                    hour{duration > 1 ? "s" : ""}
                  </span>

                </div>

                <button
                  onClick={() =>
                    setDuration(Math.min(3, duration + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EEF1EC]"
                >
                  <Plus size={17} />
                </button>

              </div>

            </div>

          </div>

          {/* BOOKING SUMMARY */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">

            <div className="rounded-[28px] border border-[#E3E8E1] bg-white p-6 shadow-[0_20px_60px_rgba(23,32,28,0.07)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#68736C]">
                    Booking summary
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    {venue.name}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A8E63D]">
                  <CalendarDays size={20} />
                </div>

              </div>

              <div className="my-6 h-px bg-[#E3E8E1]" />

              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-[#68736C]">
                    Court
                  </span>
                  <strong>
                    Court {selectedCourt}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#68736C]">
                    Date
                  </span>
                  <strong>
                    {dates[selectedDate].label}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#68736C]">
                    Start time
                  </span>
                  <strong>
                    {selectedTime}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#68736C]">
                    Duration
                  </span>
                  <strong>
                    {duration} hour
                  </strong>
                </div>

              </div>

              <div className="my-6 h-px bg-[#E3E8E1]" />

              <div className="flex items-end justify-between">

                <span className="text-sm text-[#68736C]">
                  Total
                </span>

                <div className="text-right">

                  <p className="text-3xl font-black">
                    {total.toLocaleString()}₫
                  </p>

                  <p className="text-xs text-[#68736C]">
                    Includes court fee
                  </p>

                </div>

              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuccess(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#17201C] px-5 py-4 font-bold text-white transition hover:bg-[#26322C]"
              >
                Reserve court
                <ArrowRight size={18} />
              </motion.button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#68736C]">
                <ShieldCheck size={14} />
                Your booking is protected
              </div>

            </div>

          </aside>

        </section>

      </div>

      {/* MOBILE STICKY BOOKING BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E3E8E1] bg-white/95 p-3 backdrop-blur-xl lg:hidden">

        <div className="mx-auto flex max-w-xl items-center gap-3">

          <div className="min-w-0 flex-1">

            <p className="truncate text-xs text-[#68736C]">
              Court {selectedCourt} · {selectedTime}
            </p>

            <p className="text-xl font-black">
              {total.toLocaleString()}₫
            </p>

          </div>

          <button
            onClick={() => setShowSuccess(true)}
            className="rounded-2xl bg-[#A8E63D] px-6 py-4 text-sm font-black"
          >
            Reserve
          </button>

        </div>

      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>

        {showSuccess && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17201C]/45 p-5 backdrop-blur-md"
            onClick={() => setShowSuccess(false)}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="w-full max-w-md rounded-[30px] bg-white p-7 shadow-2xl"
            >

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#A8E63D]">
                <Check size={30} strokeWidth={3} />
              </div>

              <div className="mt-5 text-center">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#79B900]">
                  Demo booking
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Court selected!
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#68736C]">
                  Your booking interface is working.
                  The next step is connecting this
                  reservation to a real database so
                  simultaneous bookings cannot collide.
                </p>

              </div>

              <div className="mt-6 rounded-2xl bg-[#F7F8F4] p-4">

                <div className="flex justify-between text-sm">
                  <span className="text-[#68736C]">
                    Venue
                  </span>
                  <strong>{venue.name}</strong>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#68736C]">
                    Court
                  </span>
                  <strong>
                    Court {selectedCourt}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#68736C]">
                    Time
                  </span>
                  <strong>{selectedTime}</strong>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#68736C]">
                    Total
                  </span>
                  <strong>
                    {total.toLocaleString()}₫
                  </strong>
                </div>

              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="mt-5 w-full rounded-2xl bg-[#17201C] px-5 py-4 font-bold text-white"
              >
                Continue exploring
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}

