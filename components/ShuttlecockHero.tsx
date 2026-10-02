"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ShuttlecockHero() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = (e.clientX - centerX) / centerX;
      const dy = (e.clientY - centerY) / centerY;
      setMouseOffset({
        x: dx * 14,
        y: dy * 10,
      });
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleBookNowClick = () => {
    const section = document.getElementById("venues");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] h-[250px] sm:h-[290px] lg:h-[390px] mx-auto py-1">
      {/* Soft Ambient Badminton Glow Aura */}
      <div
        className="absolute -inset-6 rounded-full blur-3xl opacity-35 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(168,230,61,0.28) 0%, rgba(98,217,195,0.18) 45%, transparent 70%)",
        }}
      />

      {/* ==============================================================
          1. PARALLAX PLAY AREA: RACKET + SHUTTLECOCK RALLY JUGGLE
         ============================================================== */}
      <motion.div
        animate={{
          x: mouseOffset.x,
          y: mouseOffset.y,
        }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
          mass: 0.8,
        }}
        className="relative w-full flex-1 flex items-center justify-center"
      >
        {/* Playful Interactive Container */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] h-[240px] sm:h-[275px] lg:h-[310px] flex items-center justify-center"
        >
          {/* A. Flying Shuttlecock (Bounces directly above horizontal racket head) */}
          <div
            className="absolute z-20 w-[95px] h-[120px] sm:w-[115px] sm:h-[140px] lg:w-[130px] lg:h-[160px] pointer-events-none"
            style={{
              left: "10%",
              top: "8px",
            }}
          >
            <motion.div
              animate={{
                y: [0, -26, -5, -34, 0],
                x: [0, 3, -1, 4, 0],
                rotate: [0, -4, 3, -2, 0],
                scale: [1, 0.95, 1.01, 0.93, 1],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full drop-shadow-[0_14px_20px_rgba(23,32,28,0.15)]"
            >
              <Image
                src="/images/shuttlecock_hero.png"
                alt="Badminton Shuttlecock"
                fill
                priority
                sizes="(max-width: 640px) 95px, (max-width: 1024px) 115px, 130px"
                className="object-contain select-none"
              />
            </motion.div>
          </div>

          {/* B. String Bed Contact Impact Flash */}
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "22%",
              top: "135px",
            }}
          >
            <motion.div
              animate={{
                opacity: [0.65, 0, 0.45, 0, 0.65],
                scale: [0.95, 1.35, 1.08, 1.45, 0.95],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[#a8e63d]/45 to-[#62d9c3]/35 blur-md"
            />
          </div>

          {/* C. Yonex Racket (Tilted horizontally - Tapping & Playing) */}
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[115px] lg:w-[132px] h-[220px] sm:h-[250px] lg:h-[285px]"
            style={{
              left: "41%",
              top: "155px",
            }}
          >
            <motion.div
              animate={{
                y: [0, -8, 3, -10, 0],
                rotate: [-66, -63, -69, -64, -66],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full drop-shadow-[0_18px_25px_rgba(23,32,28,0.20)] origin-center"
            >
              <Image
                src="/images/racket_hero.png"
                alt="Yonex Astrox Badminton Racket"
                fill
                priority
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 115px, 132px"
                className="object-contain select-none"
              />
            </motion.div>
          </div>

          {/* D. Dynamic Soft Ground Shadow */}
          <motion.div
            animate={{
              scale: [1, 0.90, 0.98, 0.86, 1],
              opacity: [0.28, 0.17, 0.26, 0.15, 0.28],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1 w-52 sm:w-64 lg:w-76 h-5 rounded-full blur-xl bg-[#17201c] pointer-events-none -z-10"
            style={{
              left: "42%",
              transform: "translateX(-50%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ==============================================================
          2. ANIMATED "Book Now!" BUTTON AT THE BOTTOM (Desktop only)
         ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: [0, -4, 0],
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.4, delay: 0.2 },
          scale: { duration: 0.4, delay: 0.2 },
          y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleBookNowClick}
        className="hidden lg:flex relative z-30 cursor-pointer pt-2 select-none"
        title="Book your badminton court now!"
      >
        <div className="flex items-center gap-2.5 rounded-full border-2 border-[#a8e63d] bg-[#17201c] px-5 py-2.5 sm:px-6 sm:py-3 text-white shadow-[0_12px_28px_rgba(23,32,28,0.28)] backdrop-blur-md transition-all hover:bg-[#202c25] hover:border-[#b8ef59] group">
          {/* Animated Pulsing Beacon Dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8e63d] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a8e63d]" />
          </span>

          <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white group-hover:text-[#a8e63d] transition-colors">
            Book Now!
          </span>

          <ArrowRight className="h-4 w-4 text-[#a8e63d] transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    </div>
  );
}
