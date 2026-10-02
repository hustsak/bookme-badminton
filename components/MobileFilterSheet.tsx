"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Check, SlidersHorizontal, RotateCcw, Calendar as CalendarIcon } from "lucide-react";

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  setLocation: (loc: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  sort: string;
  setSort: (s: string) => void;
  availableOnly: boolean;
  setAvailableOnly: (avail: boolean) => void;
  selectedDate: string;
  onOpenCalendar: () => void;
  totalFilteredCount: number;
  onReset: () => void;
}

const LOCATIONS = ["All locations", "Thanh Xuan", "Cau Giay", "Dong Da"];
const PRICES = [
  { label: "All prices", value: "All prices" },
  { label: "< $5/hr", value: "5" },
  { label: "< $6/hr", value: "6" },
  { label: "< $8/hr", value: "8" },
];
const SORTS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Highest Rated", value: "rating" },
];

export function MobileFilterSheet({
  isOpen,
  onClose,
  location,
  setLocation,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  availableOnly,
  setAvailableOnly,
  selectedDate,
  onOpenCalendar,
  totalFilteredCount,
  onReset,
}: MobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-[32px] border-t border-[#e2e8df] bg-[#ffffff] px-5 pb-8 pt-3 shadow-[0_-12px_40px_rgba(23,32,28,0.22)]"
          >
            {/* Drag Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d0d7cf]" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#edf1ea]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#78a72b]" />
                <h3 className="text-base font-extrabold text-[#17201c]">
                  Filter & Sort Courts
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#768379] hover:bg-[#f3f6f1] active:scale-95"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f5f1] text-[#17201c] active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5 py-4">
              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#79857d]">
                    Play Date
                  </label>
                  <button
                    onClick={onOpenCalendar}
                    className="flex items-center gap-1.5 rounded-full bg-[#f0fae1] border border-[#a8e63d]/50 px-3 py-1 text-xs font-black text-[#436b17] active:scale-95"
                  >
                    <CalendarIcon className="h-3.5 w-3.5 text-[#5b871c]" />
                    <span>Open Calendar</span>
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-[#e1e7df] bg-[#f8faf6] p-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#869289]">Selected Date</span>
                    <p className="text-xs font-black text-[#17201c]">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={onOpenCalendar}
                    className="rounded-xl bg-[#17201c] px-3 py-1.5 text-xs font-bold text-[#a8e63d] active:scale-95"
                  >
                    Change Date
                  </button>
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#79857d]">
                  District / Area
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => {
                    const active = location === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all active:scale-95 ${
                          active
                            ? "bg-[#17201c] text-[#a8e63d] shadow-sm ring-2 ring-[#a8e63d]/50"
                            : "border border-[#e1e7df] bg-[#f7f9f6] text-[#3e4842] hover:bg-white"
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#79857d]">
                  Hourly Rate
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {PRICES.map((p) => {
                    const active = maxPrice === p.value;
                    return (
                      <button
                        key={p.value}
                        onClick={() => setMaxPrice(p.value)}
                        className={`rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all active:scale-95 flex items-center justify-between ${
                          active
                            ? "border-2 border-[#a8e63d] bg-[#f2fae6] text-[#2c4e0b]"
                            : "border border-[#e1e7df] bg-[#f7f9f6] text-[#3e4842]"
                        }`}
                      >
                        <span>{p.label}</span>
                        {active && <Check className="h-3.5 w-3.5 text-[#5a861d]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available courts toggle switch */}
              <div className="flex items-center justify-between rounded-2xl border border-[#e1e7df] bg-[#f8faf6] p-3.5">
                <div>
                  <p className="text-xs font-bold text-[#17201c]">
                    Available Courts Only
                  </p>
                  <p className="text-[11px] text-[#7d8881]">
                    Hide fully booked venues
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={availableOnly}
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    availableOnly ? "bg-[#a8e63d]" : "bg-[#d3dbd1]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      availableOnly ? "translate-x-5 bg-[#17201c]" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#79857d]">
                  Sort Results
                </label>
                <div className="mt-2.5 flex flex-col gap-2">
                  {SORTS.map((s) => {
                    const active = sort === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => setSort(s.value)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all active:scale-[0.98] ${
                          active
                            ? "bg-[#17201c] text-[#a8e63d]"
                            : "border border-[#e1e7df] bg-[#f7f9f6] text-[#3e4842]"
                        }`}
                      >
                        <span>{s.label}</span>
                        {active && <Check className="h-4 w-4 text-[#a8e63d]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply Action Button */}
            <div className="sticky bottom-0 pt-3 bg-white">
              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-[#a8e63d] py-3.5 text-center text-xs font-extrabold text-[#17201c] shadow-[0_6px_20px_rgba(168,230,61,0.35)] active:scale-95 transition-all"
              >
                Show {totalFilteredCount} Available Venue{totalFilteredCount === 1 ? "" : "s"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
