"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function ShoeStepAnimation() {
  const walkDuration = 6.2;

  const handleShoeClick = () => {
    const venuesSection = document.getElementById("venues");
    if (venuesSection) {
      venuesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Trajectory: Starts at right (~86% under Book Now) and steps across to finish at left (~4% at Hanoi, Vietnam)
  const leftKeyframes = [
    "86%", // 0: Start at Book Now
    "86%", // 1: Fade in
    "76%", // 2: Step 1 airborne
    "70%", // 3: Step 1 land
    "60%", // 4: Step 2 airborne
    "54%", // 5: Step 2 land
    "44%", // 6: Step 3 airborne
    "38%", // 7: Step 3 land
    "28%", // 8: Step 4 airborne
    "22%", // 9: Step 4 land
    "12%", // 10: Step 5 airborne
    "4%",  // 11: Step 5 land (Arrived at Hanoi, Vietnam!)
    "4%",  // 12: Rest at Hanoi, Vietnam
    "4%",  // 13: Fade out
    "86%", // 14: Reset to Book Now
  ];

  const yKeyframes = [
    0,     // 0
    0,     // 1
    -22,   // 2 airborne
    0,     // 3 land
    -22,   // 4 airborne
    0,     // 5 land
    -22,   // 6 airborne
    0,     // 7 land
    -22,   // 8 airborne
    0,     // 9 land
    -22,   // 10 airborne
    0,     // 11 land (Hanoi, Vietnam)
    0,     // 12
    0,     // 13
    0,     // 14
  ];

  const rotateKeyframes = [
    0, 0,
    8, -3,
    8, -3,
    8, -3,
    8, -3,
    8, 0,
    0, 0, 0
  ];

  const scaleXKeyframes = [
    1, 1,
    0.98, 1.05,
    0.98, 1.05,
    0.98, 1.05,
    0.98, 1.05,
    0.98, 1.04,
    1, 1, 1
  ];

  const scaleYKeyframes = [
    1, 1,
    1.02, 0.93,
    1.02, 0.93,
    1.02, 0.93,
    1.02, 0.93,
    1.02, 0.94,
    1, 1, 1
  ];

  const opacityKeyframes = [
    0, 1,
    1, 1,
    1, 1,
    1, 1,
    1, 1,
    1, 1,
    1, 0, 0
  ];

  const shadowScaleKeyframes = [
    0, 1.1,
    0.55, 1.1,
    0.55, 1.1,
    0.55, 1.1,
    0.55, 1.1,
    0.55, 1.1,
    1.1, 0, 0
  ];

  const shadowOpacityKeyframes = [
    0, 0.45,
    0.15, 0.45,
    0.15, 0.45,
    0.15, 0.45,
    0.15, 0.45,
    0.15, 0.45,
    0.45, 0, 0
  ];

  const times = [
    0,
    0.04,
    0.12,
    0.20,
    0.28,
    0.36,
    0.44,
    0.52,
    0.60,
    0.68,
    0.76,
    0.84,
    0.92,
    0.97,
    1.0,
  ];

  return (
    <div
      onClick={handleShoeClick}
      className="relative w-full max-w-md sm:max-w-xl mx-auto h-16 sm:h-20 rounded-2xl border border-[#e2e8df] bg-gradient-to-r from-[#ebf5ea]/80 via-white to-[#ebf5ea]/80 p-1.5 overflow-hidden select-none pointer-events-auto cursor-pointer group shadow-[0_4px_16px_rgba(23,32,28,0.03)] backdrop-blur-sm"
      title="Step from Book Now to Hanoi, Vietnam - Click to explore venues!"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleShoeClick();
        }
      }}
    >
      {/* Court boundary guidelines */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-40">
        <div className="h-full border-l-2 border-dashed border-[#78a72b] h-8" />
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#5a7f25]">
          Step Onto The Court · Hanoi
        </span>
        <div className="h-full border-r-2 border-dashed border-[#78a72b] h-8" />
      </div>

      {/* ONLY 1 SHOE - Animated stepping from Book Now (right) to finish at Hanoi, Vietnam (left) */}
      <motion.div
        animate={{
          left: leftKeyframes,
          y: yKeyframes,
          rotate: rotateKeyframes,
          scaleX: scaleXKeyframes,
          scaleY: scaleYKeyframes,
          opacity: opacityKeyframes,
        }}
        transition={{
          duration: walkDuration,
          repeat: Infinity,
          ease: "easeInOut",
          times: times,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 top-0 transform-gpu will-change-transform"
      >
        <Image
          src="/images/shoes.png"
          alt="Badminton shoe stepping on court"
          fill
          sizes="(max-width: 640px) 70px, 90px"
          className="object-contain drop-shadow-[0_6px_12px_rgba(23,32,28,0.18)] select-none transition-transform group-hover:brightness-105"
          priority
        />

        {/* Dynamic reactive floor shadow directly beneath this shoe */}
        <motion.div
          animate={{
            scaleX: shadowScaleKeyframes,
            opacity: shadowOpacityKeyframes,
          }}
          transition={{
            duration: walkDuration,
            repeat: Infinity,
            ease: "easeInOut",
            times: times,
          }}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-[#17201c] blur-[2px] pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
