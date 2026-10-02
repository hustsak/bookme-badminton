"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarDays,
  Check,
  Clock3,
  LayoutGrid,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Table,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { CalendarModal } from "@/components/CalendarModal";
import { PaymentQRModal } from "@/components/PaymentQRModal";
import { useApp, Booking } from "@/context/AppContext";

type Court = {
  id: number;
  name: string;
  priceHour: number;
};

type Venue = {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  courts: Court[];
};

const venues: Record<string, Venue> = {
  "1": {
    id: 1,
    name: "Smash Arena",
    location: "Hanoi",
    rating: 4.9,
    reviewCount: 128,
    description:
      "Premium badminton venue with professional courts, clean facilities, and a comfortable player-first environment.",
    imageUrl:
      "/court_image/c1.jpeg",
    courts: [
      { id: 1, name: "Court 01", priceHour: 100000 },
      { id: 2, name: "Court 02", priceHour: 100000 },
      { id: 3, name: "Court 03", priceHour: 120000 },
      { id: 4, name: "Court 04", priceHour: 120000 },
    ],
  },

  "2": {
    id: 2,
    name: "Victory Club",
    location: "Hanoi",
    rating: 4.8,
    reviewCount: 96,
    description:
      "Spacious badminton club designed for casual games, training sessions, and competitive players.",
    imageUrl:
      "/court_image/c2.jpeg",
    courts: [
      { id: 5, name: "Court 01", priceHour: 110000 },
      { id: 6, name: "Court 02", priceHour: 110000 },
      { id: 7, name: "Court 03", priceHour: 130000 },
    ],
  },

  "3": {
    id: 3,
    name: "Pro Court",
    location: "Hanoi",
    rating: 4.7,
    reviewCount: 74,
    description:
      "Professional-grade badminton facility with high-quality flooring and tournament-ready courts.",
    imageUrl:
      "/court_image/c3.jpeg",
    courts: [
      { id: 8, name: "Court 01", priceHour: 130000 },
      { id: 9, name: "Court 02", priceHour: 130000 },
      { id: 10, name: "Court 03", priceHour: 150000 },
    ],
  },
};

const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

function formatPrice(value: number) {
  return `${value.toLocaleString("en-US")}₫`;
}

function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Compute all booked hour slots for a court on a given date
function getBookedHoursForCourt(
  venueId: number,
  courtName: string,
  date: string,
  bookings: Booking[]
): Set<string> {
  const booked = new Set<string>();

  // 1. Deterministic baseline booked slots based on court & date for realistic booking activity
  const seed = `${venueId}-${courtName}-${date}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const baselineIdx1 = (absHash % 4) + 1; // 08:00 to 11:00
  const baselineIdx2 = (absHash % 4) + 9; // 17:00 to 20:00
  if (timeSlots[baselineIdx1]) booked.add(timeSlots[baselineIdx1]);
  if (timeSlots[baselineIdx2]) booked.add(timeSlots[baselineIdx2]);

  // 2. Real user bookings from AppContext (persisted across sessions)
  bookings.forEach((b) => {
    if (
      b.venueId === venueId &&
      b.date === date &&
      b.status !== "CANCELLED" &&
      (b.courtName === courtName ||
        b.courtName.includes(courtName) ||
        courtName.includes(b.courtName))
    ) {
      const match = b.timeSlot.match(/(\d{2}):00/);
      if (match) {
        const startHour = parseInt(match[1], 10);
        const dur = b.duration || 1;
        for (let i = 0; i < dur; i++) {
          const hStr = `${String(startHour + i).padStart(2, "0")}:00`;
          booked.add(hStr);
        }
      }
    }
  });

  return booked;
}

export default function CourtPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dateFromQuery = searchParams?.get("date");
  const { addBooking, bookings } = useApp();

  const venue = venues[String(params.id)] ?? venues["1"];

  const [selectedCourt, setSelectedCourt] = useState(venue.courts[0]);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (dateFromQuery && /^\d{4}-\d{2}-\d{2}$/.test(dateFromQuery)) {
      return dateFromQuery;
    }
    return getDateString(new Date());
  });

  const router = useRouter();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedTime, setSelectedTime] = useState("18:00");
  const [duration, setDuration] = useState(1);
  const [scheduleView, setScheduleView] = useState<"slots" | "timetable">("slots");

  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dates = useMemo(() => {
    const list = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      return {
        value: getDateString(date),
        label: formatDate(date),
      };
    });

    // If selectedDate is from calendar and not in the first 7 days, add it
    const exists = list.some((d) => d.value === selectedDate);
    if (!exists && selectedDate) {
      const customDate = new Date(selectedDate + "T00:00:00");
      list.push({
        value: selectedDate,
        label: formatDate(customDate),
      });
    }

    return list;
  }, [selectedDate]);

  // Set of booked hour strings for current selected court and selected date
  const bookedSlots = useMemo(() => {
    return getBookedHoursForCourt(
      venue.id,
      selectedCourt.name,
      selectedDate,
      bookings
    );
  }, [venue.id, selectedCourt.name, selectedDate, bookings]);

  // Check if selected start time or duration overlaps with a booked slot
  const conflictHours = useMemo(() => {
    const startHour = parseInt(selectedTime.split(":")[0], 10);
    const conflicts: string[] = [];
    for (let i = 0; i < duration; i++) {
      const hStr = `${String(startHour + i).padStart(2, "0")}:00`;
      if (bookedSlots.has(hStr)) {
        conflicts.push(hStr);
      }
    }
    return conflicts;
  }, [selectedTime, duration, bookedSlots]);

  const hasBookingConflict = conflictHours.length > 0;

  // Auto-switch to first available slot if currently selected time is booked
  useEffect(() => {
    if (bookedSlots.has(selectedTime)) {
      const firstAvailable = timeSlots.find((t) => !bookedSlots.has(t));
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
  }, [bookedSlots, selectedTime]);

  const totalPrice = selectedCourt.priceHour * duration;

  function handleReserve() {
    if (isBooking) {
      return;
    }

    if (hasBookingConflict) {
      setErrorMessage(
        `Time slot conflict: ${conflictHours.join(", ")} is already booked. Please choose an available time.`
      );
      return;
    }

    setErrorMessage("");
    // Directly open the VietQR payment modal
    setIsPaymentModalOpen(true);
  }

  function handlePaymentSuccess() {
    addBooking({
      venueId: venue.id,
      venueName: venue.name,
      venueImage: venue.imageUrl,
      courtName: selectedCourt.name,
      location: venue.location,
      date: selectedDate,
      timeSlot: `${selectedTime} (${duration}h)`,
      duration,
      totalPrice: (selectedCourt.priceHour * duration) / 10000, // Normalized display price
    });

    setIsPaymentModalOpen(false);
    router.push("/bookings");
  }

  return (
    <main className="min-h-screen bg-[#F7F8F4] text-[#17201C]">
      <Navbar />
      <LoginModal />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#A8E63D]/10 blur-3xl" />

        <div className="absolute -right-40 top-[40%] h-96 w-96 rounded-full bg-[#62D9C3]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* VENUE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#DFF7F0] px-3 py-1.5 text-xs font-bold text-[#276B5C]">
              PREMIUM VENUE
            </span>

            <span className="flex items-center gap-1 text-sm font-semibold">
              <Star
                size={15}
                fill="currentColor"
                className="text-[#F0B429]"
              />

              {venue.rating}

              <span className="font-normal text-[#68736C]">
                ({venue.reviewCount} reviews)
              </span>
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {venue.name}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-[#68736C]">
            <MapPin size={17} />

            {venue.location}
          </div>
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="relative mb-10 h-[300px] overflow-hidden rounded-[32px] bg-[#17201C] shadow-[0_25px_70px_rgba(23,32,28,0.12)] sm:h-[420px]"
        >
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="h-full w-full object-cover opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#17201C]/75 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <p className="mb-2 text-sm font-semibold text-white/70">
                PLAY YOUR WAY
              </p>

              <h2 className="text-2xl font-black sm:text-3xl">
                Pick your court. Pick your time.
              </h2>
            </div>

            <div className="hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl sm:block">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users size={16} />
                Player-first booking
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* LEFT CONTENT */}
          <section className="space-y-8">
            {/* ABOUT */}
            <div className="rounded-[28px] border border-[#E3E8E1] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black">
                About this venue
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#68736C]">
                {venue.description}
              </p>
            </div>

            {/* QUICK FILTERS: COURT & DATE */}
            <div className="rounded-[28px] border border-[#E3E8E1] bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col gap-5">
                {/* Court Filter */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A948D]">
                      Court
                    </span>
                    <span className="text-xs font-semibold text-[#487519] bg-[#F2FBE7] px-2.5 py-0.5 rounded-full">
                      {formatPrice(selectedCourt.priceHour)} / hr
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {venue.courts.map((court) => {
                      const selected = selectedCourt.id === court.id;

                      return (
                        <button
                          key={court.id}
                          onClick={() => {
                            setSelectedCourt(court);
                            setErrorMessage("");
                          }}
                          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all ${selected
                              ? "border-[#17201C] bg-[#17201C] text-white shadow-sm"
                              : "border-[#E3E8E1] bg-[#F7F8F4] text-[#68736C] hover:bg-white hover:text-[#17201C] hover:border-[#CCD5CA]"
                            }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${selected ? "bg-[#A8E63D]" : "bg-[#B0BCB2]"
                              }`}
                          />
                          {court.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-[#EDF1EA]" />

                {/* Date Filter */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8A948D]">
                        Date
                      </span>
                      <span className="text-xs font-bold text-[#17201c] bg-[#f0fae1] px-2.5 py-0.5 rounded-full border border-[#a8e63d]/40">
                        {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(true)}
                      className="flex items-center gap-1.5 rounded-full border border-[#e1e7df] bg-white px-3 py-1 text-xs font-bold text-[#17201c] hover:border-[#a8e63d] hover:bg-[#f6fbe9] transition active:scale-95 shadow-sm"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#5b871c]" />
                      <span>Open Calendar</span>
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {/* Direct Calendar Picker Button */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(true)}
                      className="shrink-0 flex items-center gap-1.5 rounded-full border border-[#e3e8e1] bg-white px-3.5 py-2 text-xs font-black text-[#17201c] hover:border-[#a8e63d] hover:bg-[#f6fbe9] shadow-sm active:scale-95 transition"
                      title="Select date from full calendar"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#5b871c]" />
                      <span>Calendar ▾</span>
                    </button>

                    {dates.map((date, index) => {
                      const selected = selectedDate === date.value;
                      const [weekday, day] = date.label.split(",");

                      return (
                        <button
                          key={date.value}
                          onClick={() => {
                            setSelectedDate(date.value);
                            setErrorMessage("");
                          }}
                          className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${selected
                              ? "border-[#A8E63D] bg-[#A8E63D] text-[#17201C] shadow-sm font-black"
                              : "border-[#E3E8E1] bg-[#F7F8F4] text-[#68736C] hover:bg-white hover:text-[#17201C] hover:border-[#CCD5CA]"
                            }`}
                        >
                          {index === 0 && date.value === getDateString(new Date()) ? "Today" : weekday}
                          <span
                            className={`text-[11px] ${selected
                                ? "text-[#2B4E0E] font-extrabold"
                                : "text-[#8E9790] font-normal"
                              }`}
                          >
                            · {day ? day.trim() : date.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* TIME & TIMETABLE */}
            <div className="rounded-[28px] border border-[#E3E8E1] bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black">
                      Schedule & Timetable
                    </h2>
                    <span className="rounded-full bg-[#DFF7F0] px-2.5 py-1 text-[11px] font-bold text-[#276B5C]">
                      {timeSlots.length - bookedSlots.size}/{timeSlots.length} Free
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#68736C]">
                    Booked hours are shown on the live timetable.
                  </p>
                </div>

                {/* View switcher tabs */}
                <div className="inline-flex rounded-xl border border-[#E3E8E1] bg-[#F7F8F4] p-1">
                  <button
                    onClick={() => setScheduleView("slots")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${scheduleView === "slots"
                        ? "bg-white text-[#17201C] shadow-sm"
                        : "text-[#68736C] hover:text-[#17201C]"
                      }`}
                  >
                    <LayoutGrid size={13} />
                    Slot View
                  </button>
                  <button
                    onClick={() => setScheduleView("timetable")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${scheduleView === "timetable"
                        ? "bg-white text-[#17201C] shadow-sm"
                        : "text-[#68736C] hover:text-[#17201C]"
                      }`}
                  >
                    <Table size={13} />
                    All Courts Matrix
                  </button>
                </div>
              </div>

              {/* Status Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#F0F3EE] pt-3 text-xs">
                <span className="font-semibold text-[#8B958E]">Status:</span>
                <span className="inline-flex items-center gap-1.5 text-[#547926]">
                  <span className="h-2 w-2 rounded-full bg-[#8DCF36]" />
                  Available
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#17201C] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#A8E63D]" />
                  Selected
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#727B74]">
                  <span className="h-2 w-2 rounded-full bg-[#B2BDB5]" />
                  Booked
                </span>
              </div>

              {/* 1. SLOTS GRID VIEW */}
              {scheduleView === "slots" ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.has(time);
                    const selected = selectedTime === time;

                    return (
                      <motion.button
                        key={time}
                        disabled={isBooked}
                        whileTap={!isBooked ? { scale: 0.95 } : undefined}
                        onClick={() => {
                          if (!isBooked) {
                            setSelectedTime(time);
                            setErrorMessage("");
                          }
                        }}
                        className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3.5 transition-all duration-200 ${isBooked
                            ? "border-[#E4E8E1] bg-[#F2F4EF] text-[#8E9790] cursor-not-allowed opacity-80"
                            : selected
                              ? "border-[#A8E63D] bg-[#A8E63D] text-[#17201C] shadow-[0_8px_25px_rgba(168,230,61,0.25)] font-black"
                              : "border-[#E3E8E1] bg-white text-[#17201C] hover:-translate-y-0.5 hover:border-[#BFC9BD] hover:shadow-md font-bold"
                          }`}
                      >
                        <span className={`text-sm ${isBooked ? "line-through text-[#848E87]" : ""}`}>
                          {time}
                        </span>

                        {isBooked ? (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#E1E6DE] px-2 py-0.5 text-[10px] font-bold text-[#636C65]">
                            <Lock size={10} />
                            Booked
                          </span>
                        ) : selected ? (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#17201C] px-2 py-0.5 text-[10px] font-bold text-white">
                            <Check size={10} />
                            Selected
                          </span>
                        ) : (
                          <span className="mt-1.5 text-[10px] font-semibold text-[#547926]">
                            Available
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                /* 2. FULL COURTS TIMETABLE MATRIX */
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#E3E8E1] bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E3E8E1] bg-[#F7F8F4]">
                          <th className="sticky left-0 bg-[#F7F8F4] px-4 py-3 font-bold text-[#68736C]">
                            Time
                          </th>
                          {venue.courts.map((c) => (
                            <th
                              key={c.id}
                              className={`px-4 py-3 font-black ${selectedCourt.id === c.id
                                  ? "text-[#437517] bg-[#F2FBE7]"
                                  : "text-[#17201C]"
                                }`}
                            >
                              {c.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDF1EA]">
                        {timeSlots.map((time) => (
                          <tr key={time} className="hover:bg-[#FAFAF7] transition">
                            <td className="sticky left-0 bg-white px-4 py-2.5 font-bold text-[#68736C]">
                              {time}
                            </td>
                            {venue.courts.map((c) => {
                              const courtBookedSlots = getBookedHoursForCourt(
                                venue.id,
                                c.name,
                                selectedDate,
                                bookings
                              );
                              const isBooked = courtBookedSlots.has(time);
                              const isCurrentSelection =
                                selectedCourt.id === c.id && selectedTime === time;

                              return (
                                <td key={c.id} className="px-3 py-2">
                                  {isBooked ? (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-red-200/70 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600">
                                      <Lock size={10} />
                                      Booked
                                    </span>
                                  ) : isCurrentSelection ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#A8E63D] px-2.5 py-1 text-[11px] font-black text-[#17201C] shadow-sm">
                                      <Check size={10} />
                                      Selected
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setSelectedCourt(c);
                                        setSelectedTime(time);
                                        setErrorMessage("");
                                      }}
                                      className="inline-flex items-center gap-1 rounded-md border border-[#D5DDD3] bg-white px-2 py-1 text-[11px] font-semibold text-[#456B1E] transition hover:border-[#A8E63D] hover:bg-[#F2FBE7]"
                                    >
                                      Available
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* BOOKING SUMMARY */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="overflow-hidden rounded-[30px] border border-[#DDE5DB] bg-white shadow-[0_25px_70px_rgba(23,32,28,0.10)]"
            >
              <div className="bg-[#17201C] p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#A8E63D]">
                  <Sparkles size={16} />

                  YOUR BOOKING
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  Ready to play?
                </h2>
              </div>

              <div className="space-y-6 p-6">
                {/* Court */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#68736C]">
                    Court
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {selectedCourt.name}
                  </p>
                </div>

                {/* Date / time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#F7F8F4] p-4">
                    <p className="text-xs font-semibold text-[#68736C]">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {selectedDate}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F8F4] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#68736C]">
                        Start
                      </p>
                      {bookedSlots.has(selectedTime) ? (
                        <span className="inline-flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
                          <Lock size={9} /> Booked
                        </span>
                      ) : (
                        <span className="rounded bg-[#DFF7F0] px-1.5 py-0.5 text-[9px] font-bold text-[#276B5C]">
                          Available
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm font-black">
                      {selectedTime}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black">
                      Duration
                    </p>

                    <span className="text-sm font-bold text-[#68736C]">
                      {duration} hour
                      {duration > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#E3E8E1] p-2">
                    <button
                      disabled={duration <= 1}
                      onClick={() =>
                        setDuration((value) =>
                          Math.max(1, value - 1)
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-[#EEF1EC] disabled:opacity-30"
                    >
                      <Minus size={17} />
                    </button>

                    <span className="font-black">
                      {duration}h
                    </span>

                    <button
                      disabled={duration >= 3}
                      onClick={() =>
                        setDuration((value) =>
                          Math.min(3, value + 1)
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-[#EEF1EC] disabled:opacity-30"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>

                {/* Time conflict warning */}
                {hasBookingConflict && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold leading-relaxed text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                    <div>
                      <span>
                        This court is already booked at <strong>{conflictHours.join(", ")}</strong>. Please choose another time.
                      </span>
                    </div>
                  </div>
                )}

                <div className="h-px bg-[#E3E8E1]" />

                {/* Total */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-[#68736C]">
                      Total
                    </p>

                    <p className="mt-1 text-3xl font-black tracking-tight">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>

                  <p className="pb-1 text-xs font-semibold text-[#68736C]">
                    {formatPrice(selectedCourt.priceHour)} ×{" "}
                    {duration}
                  </p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                      className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* RESERVE BUTTON */}
                <motion.button
                  whileHover={{
                    scale: isBooking || hasBookingConflict ? 1 : 1.01,
                  }}
                  whileTap={{
                    scale: isBooking || hasBookingConflict ? 1 : 0.97,
                  }}
                  disabled={isBooking || hasBookingConflict}
                  onClick={handleReserve}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black transition ${hasBookingConflict
                      ? "border border-red-200 bg-red-100 text-red-700 cursor-not-allowed shadow-none"
                      : "bg-[#A8E63D] text-[#17201C] shadow-[0_12px_30px_rgba(168,230,61,0.25)] hover:bg-[#B7EF50] disabled:cursor-not-allowed disabled:opacity-70"
                    }`}
                >
                  {isBooking ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#17201C]/30 border-t-[#17201C]" />
                      Confirming...
                    </>
                  ) : hasBookingConflict ? (
                    <>
                      <Lock size={17} />
                      Slot Already Booked
                    </>
                  ) : (
                    <>
                      Reserve court
                      <ArrowLeft
                        className="rotate-180"
                        size={17}
                      />
                    </>
                  )}
                </motion.button>

                {/* Security message */}
                <div className="flex items-start gap-3 rounded-2xl bg-[#F7F8F4] p-4">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#4F9D39]"
                  />

                  <p className="text-xs leading-5 text-[#68736C]">
                    Your booking is confirmed only after the
                    server successfully creates it. If another
                    player takes the slot first, BookMeBadminton will
                    notify you immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* MOBILE BOOKING BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#DDE5DB] bg-white/90 p-4 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#68736C]">
              {selectedCourt.name} · {selectedTime}
            </p>

            <p className="text-xl font-black">
              {formatPrice(totalPrice)}
            </p>
          </div>

          <button
            onClick={handleReserve}
            disabled={isBooking || hasBookingConflict}
            className={`rounded-2xl px-6 py-3.5 font-black transition active:scale-95 disabled:opacity-60 ${hasBookingConflict
                ? "bg-red-100 text-red-700 cursor-not-allowed"
                : "bg-[#A8E63D] text-[#17201C]"
              }`}
          >
            {isBooking ? "..." : hasBookingConflict ? "Booked" : "Reserve"}
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#17201C]/50 p-5 backdrop-blur-md"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-2xl"
            >
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setBookingSuccess(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8F4] transition hover:bg-[#EEF1EC]"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#A8E63D]"
              >
                <Check
                  size={38}
                  strokeWidth={3}
                />
              </motion.div>

              <div className="mt-6 text-center">
                <p className="text-sm font-bold text-[#4F9D39]">
                  BOOKING CONFIRMED
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  You're ready to play.
                </h2>

                <p className="mt-3 leading-6 text-[#68736C]">
                  Your court has been successfully reserved.
                </p>
              </div>

              {/* Booking details */}
              <div className="mt-6 space-y-3 rounded-2xl bg-[#F7F8F4] p-5">
                <div className="flex justify-between">
                  <span className="text-sm text-[#68736C]">
                    Venue
                  </span>

                  <span className="text-sm font-black">
                    {venue.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-[#68736C]">
                    Court
                  </span>

                  <span className="text-sm font-black">
                    {selectedCourt.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-[#68736C]">
                    Date
                  </span>

                  <span className="text-sm font-black">
                    {selectedDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-[#68736C]">
                    Time
                  </span>

                  <span className="text-sm font-black">
                    {selectedTime}
                  </span>
                </div>

                <div className="h-px bg-[#E3E8E1]" />

                <div className="flex justify-between">
                  <span className="font-bold">
                    Total
                  </span>

                  <span className="font-black">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <Link
                href="/bookings"
                className="mt-5 flex w-full items-center justify-center rounded-2xl bg-[#17201C] px-5 py-4 font-black text-white transition hover:bg-[#27332D]"
              >
                View my bookings
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CALENDAR MODAL */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(newDate) => {
          setSelectedDate(newDate);
          setErrorMessage("");
        }}
        title={`Select Date for ${venue.name}`}
      />

      {/* PAYMENT VIETQR MODAL */}
      <PaymentQRModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        venueName={venue.name}
        courtName={selectedCourt.name}
        date={selectedDate}
        timeSlot={`${selectedTime} (${duration}h)`}
        totalPrice={totalPrice}
      />
    </main>
  );
}