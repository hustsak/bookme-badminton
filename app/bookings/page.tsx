"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  ChevronRight,
  ShieldCheck,
  X,
  Printer,
} from "lucide-react";

export default function BookingsPage() {
  const { user, bookings, cancelBooking, openLoginModal } = useApp();
  const [filterTab, setFilterTab] = useState<"ALL" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");
  const [selectedPass, setSelectedPass] = useState<(typeof bookings)[0] | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "ALL") return true;
    return b.status === filterTab;
  });

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#17201c] pb-20">
      <Navbar />
      <LoginModal />

      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#87918a]">
              <Link href="/" className="hover:text-[#17201c]">Home</Link>
              <span>/</span>
              <span className="font-semibold text-[#17201c]">My Bookings</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#17201c]">
              My Court Bookings<span className="text-[#a8e63d]">.</span>
            </h1>
            <p className="mt-1 text-sm text-[#7c867f]">
              Manage your upcoming badminton matches, check-in QR passes, and match history.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#a8e63d] px-5 py-2.5 text-xs font-bold text-[#17201c] shadow-sm transition hover:bg-[#b8ef59]"
          >
            Book New Court
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e1e7df] pb-4">
          <button
            onClick={() => setFilterTab("ALL")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filterTab === "ALL"
                ? "bg-[#17201c] text-white shadow-sm"
                : "bg-white text-[#68736c] border border-[#e1e7df] hover:text-[#17201c]"
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilterTab("CONFIRMED")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filterTab === "CONFIRMED"
                ? "bg-[#a8e63d] text-[#17201c] shadow-sm"
                : "bg-white text-[#68736c] border border-[#e1e7df] hover:text-[#17201c]"
            }`}
          >
            Upcoming ({bookings.filter((b) => b.status === "CONFIRMED").length})
          </button>
          <button
            onClick={() => setFilterTab("COMPLETED")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filterTab === "COMPLETED"
                ? "bg-[#17201c] text-white shadow-sm"
                : "bg-white text-[#68736c] border border-[#e1e7df] hover:text-[#17201c]"
            }`}
          >
            Completed ({bookings.filter((b) => b.status === "COMPLETED").length})
          </button>
          <button
            onClick={() => setFilterTab("CANCELLED")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filterTab === "CANCELLED"
                ? "bg-[#17201c] text-white shadow-sm"
                : "bg-white text-[#68736c] border border-[#e1e7df] hover:text-[#17201c]"
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === "CANCELLED").length})
          </button>
        </div>
      </section>

      {/* Bookings List */}
      <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-6">
        {filteredBookings.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredBookings.map((booking, index) => (
              <motion.article
                key={booking.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-[24px] border border-[#e0e6de] bg-white p-5 shadow-[0_6px_25px_rgba(23,32,28,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Venue Image */}
                  <img
                    src={booking.venueImage}
                    alt={booking.venueName}
                    className="h-28 w-full rounded-2xl object-cover sm:w-28 shrink-0"
                  />

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#828d85] uppercase">
                        ID: {booking.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                          booking.status === "CONFIRMED"
                            ? "bg-[#f0fae1] text-[#4f781a]"
                            : booking.status === "COMPLETED"
                            ? "bg-[#eaf3f8] text-[#2b6cb0]"
                            : "bg-[#fdf2f2] text-[#c53030]"
                        }`}
                      >
                        {booking.status === "CONFIRMED" && <CheckCircle2 className="h-3 w-3" />}
                        {booking.status === "COMPLETED" && <ShieldCheck className="h-3 w-3" />}
                        {booking.status === "CANCELLED" && <XCircle className="h-3 w-3" />}
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="mt-1 text-base font-bold text-[#17201c]">{booking.venueName}</h3>
                    <p className="text-xs font-semibold text-[#78a72b]">{booking.courtName}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6e7972]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#8a958e]" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#8a958e]" />
                        <span>{booking.timeSlot} ({booking.duration} hr)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#8a958e]" />
                        <span>{booking.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#edf1ea] pt-3">
                      <div>
                        <span className="text-[10px] text-[#8e9891]">Total Paid</span>
                        <p className="text-base font-bold text-[#17201c]">${booking.totalPrice}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="rounded-xl border border-[#e1e7df] px-3 py-1.5 text-xs font-bold text-[#c53030] transition hover:bg-[#fdf2f2]"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPass(booking)}
                          className="flex items-center gap-1.5 rounded-xl bg-[#17201c] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#2c3a32]"
                        >
                          <QrCode className="h-3.5 w-3.5 text-[#a8e63d]" />
                          QR Pass
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#d8e0d6] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fae1] text-[#78a72b]">
              <Calendar className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#17201c]">No bookings found</h3>
            <p className="mt-1 text-xs text-[#7c867f]">
              {filterTab === "ALL"
                ? "You haven't reserved any badminton courts yet."
                : `No ${filterTab.toLowerCase()} bookings found in your history.`}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a8e63d] px-6 py-3 text-xs font-bold text-[#17201c] shadow-md transition hover:bg-[#b8ef59]"
            >
              Explore Badminton Courts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* QR Code / Booking Pass Modal */}
      <AnimatePresence>
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPass(null)}
              className="absolute inset-0 bg-[#17201c]/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#e1e7df] bg-white p-6 shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f7f3] text-[#69746c] hover:bg-[#e2e7df]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fae1] px-3 py-1 text-xs font-bold text-[#4f781a]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#78a72b]" />
                Official Match Pass
              </div>

              <h3 className="mt-3 text-xl font-extrabold text-[#17201c]">{selectedPass.venueName}</h3>
              <p className="text-xs font-semibold text-[#78a72b]">{selectedPass.courtName}</p>

              {/* QR Code Graphic Box */}
              <div className="my-5 rounded-2xl border-2 border-dashed border-[#d8e0d6] bg-[#f8faf7] p-4 flex flex-col items-center justify-center">
                {/* SVG Simulated QR Code */}
                <div className="bg-white p-3 rounded-xl shadow-md border border-[#e1e7df]">
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                    <rect x="5" y="5" width="30" height="30" fill="#17201c" rx="4" />
                    <rect x="10" y="10" width="20" height="20" fill="white" rx="2" />
                    <rect x="14" y="14" width="12" height="12" fill="#17201c" rx="1" />

                    <rect x="65" y="5" width="30" height="30" fill="#17201c" rx="4" />
                    <rect x="70" y="10" width="20" height="20" fill="white" rx="2" />
                    <rect x="74" y="14" width="12" height="12" fill="#17201c" rx="1" />

                    <rect x="5" y="65" width="30" height="30" fill="#17201c" rx="4" />
                    <rect x="10" y="70" width="20" height="20" fill="white" rx="2" />
                    <rect x="14" y="74" width="12" height="12" fill="#17201c" rx="1" />

                    {/* QR Pixels */}
                    <rect x="40" y="10" width="8" height="8" fill="#a8e63d" />
                    <rect x="50" y="18" width="8" height="8" fill="#17201c" />
                    <rect x="42" y="42" width="16" height="16" fill="#17201c" rx="2" />
                    <rect x="65" y="45" width="8" height="8" fill="#a8e63d" />
                    <rect x="75" y="65" width="12" height="12" fill="#17201c" />
                    <rect x="45" y="75" width="10" height="10" fill="#a8e63d" />
                    <rect x="60" y="80" width="15" height="10" fill="#17201c" />
                  </svg>
                </div>
                <span className="mt-3 font-mono text-xs font-bold text-[#17201c]">
                  {selectedPass.qrCode}
                </span>
                <span className="text-[10px] text-[#8e9891]">Show at front desk upon entry</span>
              </div>

              <div className="text-left text-xs space-y-1.5 border-t border-[#edf1ea] pt-3 text-[#5c6760]">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-bold text-[#17201c]">{selectedPass.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-bold text-[#17201c]">{selectedPass.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-bold text-[#17201c]">{selectedPass.location}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17201c] py-2.5 text-xs font-bold text-white hover:bg-[#25322c]"
              >
                <Printer className="h-3.5 w-3.5 text-[#a8e63d]" />
                Print / Save Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
