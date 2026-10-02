"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Flame, ArrowRight, Trophy } from "lucide-react";

export function MobileBadmintonHero() {
  const [smashCount, setSmashCount] = useState(0);
  const [isSmashing, setIsSmashing] = useState(false);

  const handleSmash = () => {
    setIsSmashing(true);
    setSmashCount((prev) => prev + 1);
    setTimeout(() => {
      setIsSmashing(false);
    }, 450);
  };

  const handleScrollToVenues = () => {
    document.getElementById("venues")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full lg:hidden my-2 select-none">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[26px] border border-[#2b3a32] bg-gradient-to-br from-[#131b17] via-[#1c2921] to-[#121915] p-4 text-white shadow-[0_12px_32px_rgba(18,25,21,0.25)]"
      >
        {/* Subtle Ambient Radial Glows */}
        <div
          className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "#a8e63d" }}
        />
        <div
          className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#62d9c3" }}
        />

        {/* Top Status Header Row */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#d8f99e] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8e63d] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8e63d]" />
            </span>
            <span>Hanoi Smash Hub</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#a8e63d]">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>{smashCount > 0 ? `${smashCount} Smashes!` : "Tap to Smash"}</span>
          </div>
        </div>

        {/* Center Arena Row: Left Details + Right Interactive Rally Stage */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Hero Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[19px] font-black tracking-tight text-white leading-tight">
              Instant Court <span className="text-[#a8e63d]">Booking</span>.
            </h2>
            <p className="mt-1 text-xs text-[#a4b2a7] leading-relaxed line-clamp-2 font-medium">
              Real-time courts, air-conditioned halls & friendly matches.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleScrollToVenues}
                className="flex items-center gap-1 rounded-full bg-[#a8e63d] px-3.5 py-1.5 text-xs font-extrabold text-[#17201c] shadow-sm active:scale-95 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <Link
                href="/friendly-matches"
                className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white active:scale-95 transition-all"
              >
                <Trophy className="h-3 w-3 text-[#a8e63d]" />
                <span>Join Match</span>
              </Link>
            </div>
          </div>

          {/* Right Badminton Rally Mini-Stage */}
          <div
            onClick={handleSmash}
            role="button"
            tabIndex={0}
            className="w-[110px] h-[126px] shrink-0 relative rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-1 overflow-hidden flex flex-col items-center justify-between cursor-pointer select-none active:scale-95 transition-transform shadow-inner group"
            title="Tap to smash the shuttlecock!"
          >
            {/* Impact Glow Flash */}
            <motion.div
              animate={{
                opacity: isSmashing ? [0, 0.9, 0] : [0.15, 0.4, 0.15],
                scale: isSmashing ? [0.8, 1.4, 0.9] : [0.95, 1.05, 0.95],
              }}
              transition={{ duration: isSmashing ? 0.35 : 2.2, repeat: isSmashing ? 0 : Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-[#a8e63d]/45 to-[#62d9c3]/30 blur-md pointer-events-none"
            />

            {/* Stage Area for Shuttlecock + Racket */}
            <div className="relative w-full h-[98px] flex items-center justify-center">
              {/* Flying Shuttlecock */}
              <motion.div
                animate={
                  isSmashing
                    ? {
                        y: [-5, -38, 0],
                        rotate: [0, -30, 0],
                        scale: [1, 1.25, 1],
                      }
                    : {
                        y: [0, -12, 0],
                        rotate: [0, -6, 0],
                      }
                }
                transition={{
                  duration: isSmashing ? 0.42 : 2.2,
                  repeat: isSmashing ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-20 top-1 left-1/2 -translate-x-1/2 w-[48px] h-[48px] pointer-events-none transform-gpu will-change-transform"
              >
                <img
                  src="/court_image/shuttlecock.png"
                  alt="Badminton Shuttlecock"
                  className="w-full h-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

              {/* Yonex Astrox Racket */}
              <motion.div
                animate={
                  isSmashing
                    ? {
                        rotate: [-55, -82, -55],
                        scale: [1, 1.1, 1],
                        y: [0, -6, 0],
                      }
                    : {
                        rotate: [-55, -60, -55],
                        y: [0, 4, 0],
                      }
                }
                transition={{
                  duration: isSmashing ? 0.38 : 2.2,
                  repeat: isSmashing ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-[54px] h-[78px] origin-bottom pointer-events-none transform-gpu will-change-transform"
              >
                <img
                  src="/court_image/racket.png"
                  alt="Yonex Badminton Racket"
                  className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                />
              </motion.div>
            </div>

            {/* Bottom Mini Tap Pill */}
            <div className="relative z-30 mb-0.5 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-black text-[#a8e63d] backdrop-blur-sm border border-white/10 tracking-tight">
              {isSmashing ? "⚡ SMASH!" : "🏸 Tap Rally"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
