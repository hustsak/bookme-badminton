"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  Calendar,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Users,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import { MobileBottomNav } from "@/components/MobileBottomNav";

export function Navbar() {
  const pathname = usePathname();
  const { user, openLoginModal, logout, favorites, bookings, friendlyMatches } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBookingsCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const openMatchesCount = friendlyMatches.filter((m) => m.status === "OPEN").length;

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-[#e1e7df] bg-[#f7f8f4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] sm:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold group select-none">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-[#e1e7df] overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="BookMeBadminton Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="tracking-tight text-[#17201c]">BookMe<span className="text-[#5b871c]">Badminton</span></span>
            <span className="text-[#a8e63d] -ml-1 text-xl leading-none">.</span>
          </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 lg:gap-7 md:flex">
          <Link
            href="/"
            className={`text-sm font-semibold transition ${
              pathname === "/"
                ? "text-[#17201c] underline underline-offset-8 decoration-[#a8e63d] decoration-2"
                : "text-[#7c867f] hover:text-[#17201c]"
            }`}
          >
            Explore
          </Link>

          <Link
            href="/friendly-matches"
            className={`relative text-sm font-semibold transition flex items-center gap-1.5 ${
              pathname === "/friendly-matches"
                ? "text-[#17201c] underline underline-offset-8 decoration-[#a8e63d] decoration-2"
                : "text-[#7c867f] hover:text-[#17201c]"
            }`}
          >
            <Users className="h-4 w-4 text-[#78a72b]" />
            Friendly Match
            {openMatchesCount > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-[#f0fae1] border border-[#a8e63d]/70 px-1.5 text-[10px] font-bold text-[#456e17]">
                {openMatchesCount} open
              </span>
            )}
          </Link>

          <Link
            href="/bookings"
            className={`relative text-sm font-semibold transition flex items-center gap-1.5 ${
              pathname === "/bookings"
                ? "text-[#17201c] underline underline-offset-8 decoration-[#a8e63d] decoration-2"
                : "text-[#7c867f] hover:text-[#17201c]"
            }`}
          >
            <Calendar className="h-4 w-4" />
            My Bookings
            {activeBookingsCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#a8e63d] px-1 text-[10px] font-bold text-[#17201c]">
                {activeBookingsCount}
              </span>
            )}
          </Link>

          <Link
            href="/favorites"
            className={`relative text-sm font-semibold transition flex items-center gap-1.5 ${
              pathname === "/favorites"
                ? "text-[#17201c] underline underline-offset-8 decoration-[#a8e63d] decoration-2"
                : "text-[#7c867f] hover:text-[#17201c]"
            }`}
          >
            <Heart className="h-4 w-4" />
            Favorites
            {favorites.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#17201c] px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
        </div>

        {/* User Account & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-[#e1e7df] bg-white px-3 py-1.5 shadow-sm transition hover:border-[#a8e63d]"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-[#a8e63d]"
                />
                <span className="text-xs font-bold text-[#17201c] hidden sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#869289]" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#e1e7df] bg-white p-2 shadow-xl z-50">
                  <div className="border-b border-[#edf1eb] px-3 py-2">
                    <p className="text-xs font-bold text-[#17201c]">{user.name}</p>
                    <p className="text-[10px] text-[#869289] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/friendly-matches"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#3a443e] hover:bg-[#f5f7f3]"
                  >
                    <Users className="h-3.5 w-3.5 text-[#78a72b]" />
                    Friendly Matches ({friendlyMatches.length})
                  </Link>

                  <Link
                    href="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#3a443e] hover:bg-[#f5f7f3]"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    My Bookings ({bookings.length})
                  </Link>

                  <Link
                    href="/favorites"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#3a443e] hover:bg-[#f5f7f3]"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Favorites ({favorites.length})
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#e53935] hover:bg-[#fdf2f2]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 rounded-full bg-[#17201c] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white transition hover:bg-[#2c3a32] active:scale-95"
            >
              <UserIcon className="h-3.5 w-3.5 text-[#a8e63d]" />
              Log in
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e1e7df] bg-white text-[#17201c] md:hidden shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e1e7df] bg-white/95 px-5 py-4 backdrop-blur-xl md:hidden space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold ${
              pathname === "/" ? "bg-[#f0fae1] text-[#4f781a]" : "text-[#3a443e] hover:bg-[#f5f7f3]"
            }`}
          >
            <span>Explore Courts</span>
          </Link>

          <Link
            href="/friendly-matches"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold ${
              pathname === "/friendly-matches"
                ? "bg-[#f0fae1] text-[#4f781a]"
                : "text-[#3a443e] hover:bg-[#f5f7f3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#78a72b]" />
              <span>Friendly Match</span>
            </div>
            {openMatchesCount > 0 && (
              <span className="rounded-full bg-[#a8e63d] px-2 py-0.5 text-[10px] font-extrabold text-[#17201c]">
                {openMatchesCount} open
              </span>
            )}
          </Link>

          <Link
            href="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold ${
              pathname === "/bookings"
                ? "bg-[#f0fae1] text-[#4f781a]"
                : "text-[#3a443e] hover:bg-[#f5f7f3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>My Bookings</span>
            </div>
            {activeBookingsCount > 0 && (
              <span className="rounded-full bg-[#a8e63d] px-2 py-0.5 text-[10px] font-bold text-[#17201c]">
                {activeBookingsCount}
              </span>
            )}
          </Link>

          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold ${
              pathname === "/favorites"
                ? "bg-[#f0fae1] text-[#4f781a]"
                : "text-[#3a443e] hover:bg-[#f5f7f3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </div>
            {favorites.length > 0 && (
              <span className="rounded-full bg-[#17201c] px-2 py-0.5 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
    <MobileBottomNav />
  </>
  );
}
