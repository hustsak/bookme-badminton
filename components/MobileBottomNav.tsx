"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import {
  Compass,
  Users,
  Calendar,
  Heart,
  User as UserIcon,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, openLoginModal, bookings, favorites, friendlyMatches } = useApp();

  const activeBookingsCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const openMatchesCount = friendlyMatches.filter((m) => m.status === "OPEN").length;

  const navItems = [
    {
      label: "Explore",
      href: "/",
      icon: Compass,
      badge: 0,
      isActive: pathname === "/",
    },
    {
      label: "Matches",
      href: "/friendly-matches",
      icon: Users,
      badge: openMatchesCount,
      isActive: pathname === "/friendly-matches",
    },
    {
      label: "Bookings",
      href: "/bookings",
      icon: Calendar,
      badge: activeBookingsCount,
      isActive: pathname === "/bookings",
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: Heart,
      badge: favorites.length,
      isActive: pathname === "/favorites",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none pb-safe">
      <div className="mx-auto max-w-md px-3 pb-3 pt-1">
        <nav
          aria-label="Mobile Navigation"
          className="pointer-events-auto flex items-center justify-between rounded-[26px] border border-white/60 bg-[#17201c]/95 px-2 py-2 text-white shadow-[0_16px_36px_rgba(23,32,28,0.35)] backdrop-blur-2xl ring-1 ring-white/10"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative flex flex-1 flex-col items-center justify-center py-1 select-none"
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative flex items-center justify-center rounded-2xl px-3 py-1.5 transition-colors ${
                    active ? "text-[#17201c]" : "text-[#9ca89f] hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute inset-0 rounded-2xl bg-[#a8e63d] shadow-[0_4px_14px_rgba(168,230,61,0.45)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {active && (
                      <span className="text-[11px] font-extrabold tracking-tight">
                        {item.label}
                      </span>
                    )}
                  </span>

                  {item.badge > 0 && (
                    <span
                      className={`absolute -right-1 -top-1 z-20 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-black ${
                        active
                          ? "bg-[#17201c] text-[#a8e63d] ring-1 ring-white/20"
                          : "bg-[#a8e63d] text-[#17201c]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.div>
                {!active && (
                  <span className="mt-0.5 text-[10px] font-medium text-[#7d8c80]">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Account / Login Pill */}
          <div className="flex flex-1 flex-col items-center justify-center py-1 select-none">
            {user ? (
              <button
                onClick={openLoginModal}
                className="relative flex flex-col items-center justify-center rounded-2xl p-1 text-[#9ca89f] hover:text-white"
                title={user.name}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#a8e63d]"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <span className="mt-0.5 text-[10px] font-medium text-[#7d8c80] max-w-[50px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="relative flex flex-col items-center justify-center rounded-2xl py-1 text-[#9ca89f] hover:text-white"
                title="Log In"
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <UserIcon className="h-4 w-4 text-[#a8e63d]" />
                </motion.div>
                <span className="mt-0.5 text-[10px] font-medium text-[#7d8c80]">
                  Log In
                </span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
