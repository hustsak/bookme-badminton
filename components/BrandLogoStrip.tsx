"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function BrandLogoStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      aria-label="We Love Badminton!"
      className="mx-auto max-w-7xl px-4 sm:px-6 pt-2 sm:pt-4"
    >
      <div className="relative overflow-hidden rounded-[18px] sm:rounded-[24px] border border-[#e2e8df] bg-white/85 px-3 py-2 sm:px-12 sm:py-3.5 shadow-[0_4px_20px_rgba(23,32,28,0.03)] backdrop-blur-xl">
        {/* Subtle ambient gradient hints */}
        <div
          className="absolute -right-16 -top-16 h-36 w-36 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: "#a8e63d" }}
        />
        <div
          className="absolute -left-16 -bottom-16 h-36 w-36 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: "#62d9c3" }}
        />

        {/* Section kicker / label centered */}
        <div className="mb-1.5 sm:mb-2.5 flex items-center justify-center gap-2">
          <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#78a72b]" />
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a857e]">
            Official Partner Brands
          </span>
          <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#78a72b]" />
        </div>

        {/* Horizontal Container: Li-Ning · Victor · Yonex */}
        <div className="flex items-center justify-around sm:justify-center sm:gap-16 md:gap-24 lg:gap-32 w-full">
          {/* Li-Ning (0ms delay) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.0 }}
            whileHover={{
              opacity: 1,
              scale: 1.03,
              transition: { duration: 0.25 },
            }}
            className="flex items-center justify-center cursor-default transition-all duration-300"
          >
            <div className="relative h-[28px] sm:h-[40px] w-[80px] sm:w-[130px] md:w-[145px]">
              <Image
                src="/court_image/Li-Ning_logo_red.png"
                alt="Li-Ning logo"
                fill
                sizes="(max-width: 640px) 80px, 145px"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Victor (100ms delay) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{
              opacity: 1,
              scale: 1.03,
              transition: { duration: 0.25 },
            }}
            className="flex items-center justify-center cursor-default transition-all duration-300"
          >
            <div className="relative h-[24px] sm:h-[32px] w-[90px] sm:w-[124px] md:w-[136px] overflow-hidden rounded-[7px] border border-black/[0.06] shadow-[0_2px_8px_rgba(37,64,143,0.12)]">
              <Image
                src="/court_image/victor.jpg"
                alt="Victor logo"
                fill
                sizes="(max-width: 640px) 90px, 136px"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Yonex (200ms delay) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{
              opacity: 1,
              scale: 1.03,
              transition: { duration: 0.25 },
            }}
            className="flex items-center justify-center cursor-default transition-all duration-300"
          >
            <div className="relative h-[22px] sm:h-[30px] w-[85px] sm:w-[118px] md:w-[130px] overflow-hidden rounded-[7px] border border-black/[0.06] shadow-[0_2px_8px_rgba(0,128,80,0.10)]">
              <Image
                src="/court_image/Logo-Yonex.svg.webp"
                alt="Yonex logo"
                fill
                sizes="(max-width: 640px) 85px, 130px"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
