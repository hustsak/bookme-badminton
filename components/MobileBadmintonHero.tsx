"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Zap, Sparkles, Flame, ArrowRight, Trophy } from "lucide-react";

export function MobileBadmintonHero() {
  const [smashCount, setSmashCount] = useState(0);
  const [isSmashing, setIsSmashing] = useState(false);

  const handleSmash = () => {
    setIsSmashing(true);
    setSmashCount((prev) => prev + 1);
    setTimeout(() => {
      setIsSmashing(false);
    }, 400);
  };

  const handleScrollToVenues = () => {
    document.getElementById("venues")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full lg:hidden my-2 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[26px] border border-[#e1e8df] bg-gradient-to-br from-[#17201c] via-[#1d2b22] to-[#17201c] p-4 text-white shadow-[0_12px_32px_rgba(23,32,28,0.18)]"
      >
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-35 pointer-events-none"
          style={{ background: "#a8e63d" }}
        />
        <div
          className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#62d9c3" }}
        />

        {/* Top Header Pill Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-[#d8f99e] backdrop-blur-md">
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

        {/* Dynamic Center Play Arena */}
        <div className="relative mt-2 flex items-center justify-between h-[135px]">
          {/* Left Text / Info */}
          <div className="z-10 max-w-[190px]">
            <h2 className="text-xl font-black tracking-tight text-white leading-tight">
              Instant Court <span className="text-[#a8e63d]">Booking</span>.
            </h2>
            <p className="mt-1 text-xs text-[#a0ada3] line-clamp-2">
              Real-time courts, air-conditioned halls & friendly matches.
            </p>

            {/* Quick Action Badges */}
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleScrollToVenues}
                className="flex items-center gap-1 rounded-full bg-[#a8e63d] px-3 py-1.5 text-[11px] font-extrabold text-[#17201c] shadow-sm active:scale-95 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <Link
                href="/friendly-matches"
                className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white active:scale-95 transition-all"
              >
                <Trophy className="h-3 w-3 text-[#a8e63d]" />
                <span>Join Match</span>
              </Link>
            </div>
          </div>

          {/* Right Badminton Rally Interactive Mini-Stage */}
          <div
            onClick={handleSmash}
            role="button"
            tabIndex={0}
            className="relative flex-1 h-full cursor-pointer flex items-center justify-center group"
            title="Tap to smash the shuttlecock!"
          >
            {/* Soft String Impact Flash */}
            <motion.div
              animate={{
                opacity: isSmashing ? [0, 0.8, 0] : [0.2, 0.5, 0.2],
                scale: isSmashing ? [0.8, 1.4, 0.9] : [0.9, 1.1, 0.9],
              }}
              transition={{ duration: isSmashing ? 0.35 : 2.5, repeat: isSmashing ? 0 : Infinity }}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-[#a8e63d]/50 to-[#62d9c3]/40 blur-md pointer-events-none"
            />

            {/* Flying Shuttlecock */}
            <motion.div
              animate={
                isSmashing
                  ? {
                      y: [-10, -55, 0],
                      rotate: [0, -25, 0],
                      scale: [1, 1.25, 1],
                    }
                  : {
                      y: [0, -18, 0],
                      rotate: [0, -4, 0],
                    }
              }
              transition={{
                duration: isSmashing ? 0.4 : 2.4,
                repeat: isSmashing ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="absolute z-20 w-[64px] h-[78px] -top-1 transform-gpu will-change-transform"
            >
              <Image
                src="/images/shuttlecock_hero.png"
                alt="Shuttlecock"
                fill
                priority
                sizes="64px"
                className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
              />
            </motion.div>

            {/* Yonex Astrox Racket */}
            <motion.div
              animate={
                isSmashing
                  ? {
                      rotate: [-60, -82, -60],
                      scale: [1, 1.08, 1],
                      y: [0, -8, 0],
                    }
                  : {
                      rotate: [-60, -64, -60],
                      y: [0, 3, 0],
                    }
              }
              transition={{
                duration: isSmashing ? 0.35 : 2.4,
                repeat: isSmashing ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="absolute z-10 w-[78px] h-[160px] top-6 left-1/2 -translate-x-1/2 origin-center pointer-events-none transform-gpu will-change-transform"
            >
              <Image
                src="/images/racket_hero.png"
                alt="Yonex Racket"
                fill
                priority
                sizes="78px"
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              />
            </motion.div>

            {/* Smash floating banner tooltip */}
            <motion.div
              animate={{ opacity: isSmashing ? 1 : 0.85, y: [0, -2, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute bottom-0 right-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-extrabold text-[#a8e63d] backdrop-blur-sm border border-white/10"
            >
              🏸 Tap to Smash!
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
