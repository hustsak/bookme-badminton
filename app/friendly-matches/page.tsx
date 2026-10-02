"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { useApp, FriendlyMatch } from "@/context/AppContext";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  CheckCircle2,
  X,
  AlertCircle,
  ArrowRight,
  Trash2,
  Share2,
  Flame,
  Award,
  Info,
} from "lucide-react";

const VENUE_OPTIONS = [
  { name: "Smash Arena", location: "Thanh Xuan, Hanoi" },
  { name: "Victory Badminton Club", location: "Cau Giay, Hanoi" },
  { name: "Pro Court", location: "Dong Da, Hanoi" },
  { name: "Green Shuttle", location: "Thanh Xuan, Hanoi" },
  { name: "Ace Sports Center", location: "Cau Giay, Hanoi" },
  { name: "Shuttle House", location: "Dong Da, Hanoi" },
];

export default function FriendlyMatchesPage() {
  const {
    user,
    friendlyMatches,
    createFriendlyMatch,
    joinFriendlyMatch,
    leaveFriendlyMatch,
    deleteFriendlyMatch,
    openLoginModal,
  } = useApp();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [openOnly, setOpenOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for creating match
  const [formData, setFormData] = useState({
    title: "",
    venueName: "Smash Arena",
    location: "Thanh Xuan, Hanoi",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "18:00 - 20:00",
    level: "Intermediate" as "All Levels" | "Beginner" | "Intermediate" | "Advanced",
    format: "Doubles" as "Doubles" | "Singles",
    feePerPerson: 3,
    description: "",
    shuttlecockProvided: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMatches = useMemo(() => {
    return friendlyMatches.filter((match) => {
      const matchesSearch =
        match.title.toLowerCase().includes(search.toLowerCase()) ||
        match.venueName.toLowerCase().includes(search.toLowerCase()) ||
        match.location.toLowerCase().includes(search.toLowerCase());

      const matchesLevel =
        levelFilter === "ALL" || match.level.toLowerCase() === levelFilter.toLowerCase();

      const matchesFormat =
        formatFilter === "ALL" || match.format.toLowerCase() === formatFilter.toLowerCase();

      const matchesOpen = !openOnly || match.status === "OPEN";

      return matchesSearch && matchesLevel && matchesFormat && matchesOpen;
    });
  }, [friendlyMatches, search, levelFilter, formatFilter, openOnly]);

  const handleVenueChange = (venueName: string) => {
    const selected = VENUE_OPTIONS.find((v) => v.name === venueName);
    setFormData((prev) => ({
      ...prev,
      venueName,
      location: selected ? selected.location : prev.location,
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Please enter a title for your match!");
      return;
    }

    createFriendlyMatch({
      title: formData.title.trim(),
      venueName: formData.venueName,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      level: formData.level,
      format: formData.format,
      totalSlots: formData.format === "Singles" ? 2 : 4,
      feePerPerson: Number(formData.feePerPerson),
      description:
        formData.description.trim() ||
        `Friendly ${formData.format.toLowerCase()} match. Looking for good sparring and sportsmanship!`,
      shuttlecockProvided: formData.shuttlecockProvided,
    });

    setIsCreateModalOpen(false);
    showToast("🎉 Match created! Other players can now ask to join.");
    setFormData({
      title: "",
      venueName: "Smash Arena",
      location: "Thanh Xuan, Hanoi",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "18:00 - 20:00",
      level: "Intermediate",
      format: "Doubles",
      feePerPerson: 3,
      description: "",
      shuttlecockProvided: true,
    });
  };

  const handleJoinClick = (match: FriendlyMatch) => {
    if (!user) {
      openLoginModal();
      return;
    }

    const currentUserId = user.id;
    const isHost = match.host.id === currentUserId;
    const isJoined = match.joinedPlayers.some((p) => p.id === currentUserId);

    if (isHost) {
      showToast("You are the host of this match!");
      return;
    }

    if (isJoined) {
      leaveFriendlyMatch(match.id);
      showToast("You have left this match.");
      return;
    }

    const res = joinFriendlyMatch(match.id);
    showToast(res.message);
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-[#eaf8ee] text-[#1c7430] border-[#bfe7c8]";
      case "Intermediate":
        return "bg-[#fef7e7] text-[#975a16] border-[#f8e1a8]";
      case "Advanced":
        return "bg-[#f5eefb] text-[#6b21a8] border-[#ded0f7]";
      default:
        return "bg-[#eaf3f8] text-[#2b6cb0] border-[#bee3f8]";
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#17201c] pb-24">
      <Navbar />
      <LoginModal />

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full bg-[#17201c] px-5 py-2.5 text-xs font-bold text-white shadow-2xl border border-white/10"
          >
            <Sparkles className="h-4 w-4 text-[#a8e63d]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-[#e2e8df] bg-gradient-to-br from-[#17201c] via-[#212f27] to-[#17201c] p-7 sm:p-10 text-white shadow-xl">
          {/* Subtle Accent Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#a8e63d]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#80b52e]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur">
                <Flame className="h-3.5 w-3.5 text-[#a8e63d]" />
                <span className="text-[#e2f5b8]">Sparring & Team-Up Hub</span>
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
                Find a Friendly Match<span className="text-[#a8e63d]">.</span>
              </h1>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#c6d1c9]">
                Don't have a team or missing a 4th player for doubles? Create an open session or join
                other badminton players in Hanoi. Play, meet friends, and split court costs fairly.
              </p>

              {/* Quick Perks */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#a9b7ad]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#a8e63d]" />
                  <span>Verified Venues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#a8e63d]" />
                  <span>Fair Split Court Cost</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#a8e63d]" />
                  <span>All Skill Levels Welcome</span>
                </div>
              </div>
            </div>

            {/* Host Action Box */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col shrink-0">
              <button
                onClick={() => {
                  if (!user) {
                    openLoginModal();
                    return;
                  }
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#a8e63d] px-6 py-3.5 text-sm font-extrabold text-[#17201c] shadow-lg transition hover:bg-[#b8ef59] hover:scale-[1.02] active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Host a Friendly Match
              </button>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-xs text-[#b0beba] backdrop-blur">
                <span className="font-bold text-white">{friendlyMatches.length} matches</span> active
                across Hanoi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search Bar */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-6">
        <div className="flex flex-col gap-3 rounded-[24px] border border-[#e1e7df] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2.5 rounded-[16px] bg-[#f5f7f3] px-3.5 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-[#8e9891]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by match title, venue, or district..."
              className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-[#9ea8a0]"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X className="h-4 w-4 text-[#8e9891]" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Format Filter */}
            <div className="flex rounded-full border border-[#e3e8e1] bg-[#f7f8f4] p-1 font-semibold text-[#667269]">
              {["ALL", "Doubles", "Singles"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`rounded-full px-3 py-1 transition ${
                    formatFilter === fmt ? "bg-[#17201c] text-white shadow-sm" : "hover:text-[#17201c]"
                  }`}
                >
                  {fmt === "ALL" ? "All Formats" : fmt}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-full border border-[#e3e8e1] bg-white px-3.5 py-2 text-xs font-semibold text-[#3a443e] outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Open Only Button */}
            <button
              onClick={() => setOpenOnly(!openOnly)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 font-semibold transition ${
                openOnly
                  ? "border-[#a8e63d] bg-[#f0fae1] text-[#4f781a]"
                  : "border-[#e3e8e1] bg-white text-[#69746c]"
              }`}
            >
              <span
                className={`flex h-3 w-3 items-center justify-center rounded-full ${
                  openOnly ? "bg-[#a8e63d]" : "border border-[#bdc6be]"
                }`}
              >
                {openOnly && <Check className="h-2 w-2" />}
              </span>
              Open spots only
            </button>
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="mx-auto max-w-7xl px-5 pt-7 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#869288]">
            Showing <span className="font-bold text-[#17201c]">{filteredMatches.length}</span> friendly
            matches
          </p>

          <span className="text-xs text-[#869288] hidden sm:inline">
            Click &ldquo;Ask to Join&rdquo; to lock your spot
          </span>
        </div>

        {filteredMatches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {filteredMatches.map((match, index) => {
              const currentUserId = user?.id;
              const isHost = match.host.id === currentUserId;
              const isJoined = currentUserId
                ? match.joinedPlayers.some((p) => p.id === currentUserId)
                : false;
              const openSlotsCount = match.totalSlots - match.joinedPlayers.length;
              const isFull = openSlotsCount <= 0;

              return (
                <motion.article
                  key={match.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#e1e7df] bg-white p-6 shadow-[0_6px_25px_rgba(23,32,28,0.03)] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    {/* Top Row: Host info & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={match.host.avatar}
                          alt={match.host.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-[#a8e63d]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#17201c]">{match.host.name}</h4>
                            <span className="rounded-full bg-[#f0fae1] px-2 py-0.5 text-[10px] font-extrabold text-[#4f781a]">
                              Host
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8a958e]">Posted {match.createdAt}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isFull
                            ? "bg-[#edf1ed] text-[#717c75]"
                            : "bg-[#f0fae1] text-[#426a14] border border-[#a8e63d]/50"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${isFull ? "bg-[#8e9891]" : "bg-[#8dcf36] animate-pulse"}`}
                        />
                        {isFull ? "Match Full" : `${openSlotsCount} Spot${openSlotsCount > 1 ? "s" : ""} Left`}
                      </span>
                    </div>

                    {/* Match Title & Format Badges */}
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-[#17201c] px-2.5 py-1 text-[11px] font-bold text-white">
                          {match.format} ({match.totalSlots} Players)
                        </span>
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${getLevelBadgeClass(
                            match.level
                          )}`}
                        >
                          {match.level}
                        </span>
                        {match.shuttlecockProvided && (
                          <span className="rounded-lg bg-[#f5f7f3] border border-[#e1e7df] px-2.5 py-1 text-[11px] font-medium text-[#4f5c53]">
                            🏸 Shuttles Provided
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2.5 text-lg font-extrabold text-[#17201c] group-hover:text-[#456e17] transition">
                        {match.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#6e7a72] leading-relaxed line-clamp-2">
                        {match.description}
                      </p>
                    </div>

                    {/* Venue & Time Details */}
                    <div className="mt-4 space-y-2 rounded-2xl bg-[#f8faf7] p-3.5 text-xs text-[#525f56]">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#78a72b]" />
                        <span className="font-bold text-[#17201c]">{match.venueName}</span>
                        <span className="text-[#96a099]">·</span>
                        <span className="truncate">{match.location}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#8b968e]" />
                          <span>{match.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-[#8b968e]" />
                          <span className="font-semibold text-[#17201c]">{match.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Player Slots */}
                    <div className="mt-4 border-t border-[#edf1ea] pt-3.5">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-[#17201c]">Joined Players</span>
                        <span className="text-[#849088]">
                          {match.joinedPlayers.length} of {match.totalSlots} slots
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Display Joined Players */}
                        {match.joinedPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="relative group/avatar"
                            title={`${player.name}`}
                          >
                            <img
                              src={player.avatar}
                              alt={player.name}
                              className="h-9 w-9 rounded-full object-cover ring-2 ring-[#a8e63d]"
                            />
                            {/* Player name hover tooltip */}
                            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#17201c] px-2 py-0.5 text-[10px] font-bold text-white opacity-0 shadow transition group-hover/avatar:opacity-100 z-20">
                              {player.name}
                            </span>
                          </div>
                        ))}

                        {/* Open Slots Visualizer */}
                        {Array.from({ length: Math.max(0, openSlotsCount) }).map((_, i) => (
                          <div
                            key={i}
                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-[#ccd6ca] bg-[#f9fbf8] text-[#8e9890]"
                            title="Open Slot - Tap Join to claim"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Fee & Join Button */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#edf1ea] pt-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#929d95]">
                        Share Cost
                      </span>
                      <p className="text-base font-extrabold text-[#17201c]">
                        {match.feePerPerson > 0 ? (
                          <>
                            ${match.feePerPerson}
                            <span className="text-xs font-normal text-[#8e9891]"> / player</span>
                          </>
                        ) : (
                          <span className="text-[#456e17]">Free (Split Court)</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isHost ? (
                        <div className="flex items-center gap-2">
                          <span className="rounded-xl bg-[#f0fae1] px-3 py-2 text-xs font-bold text-[#456e17]">
                            Your Session
                          </span>
                          <button
                            onClick={() => {
                              deleteFriendlyMatch(match.id);
                              showToast("Match cancelled and deleted.");
                            }}
                            className="rounded-xl border border-[#e1e7df] p-2 text-[#c53030] hover:bg-[#fdf2f2] transition"
                            title="Cancel & Delete Match"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : isJoined ? (
                        <button
                          onClick={() => handleJoinClick(match)}
                          className="flex items-center gap-1.5 rounded-full border border-[#ccd5c9] bg-white px-4 py-2 text-xs font-bold text-[#c53030] hover:bg-[#fdf2f2] transition shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5 text-[#78a72b]" />
                          Joined · Tap to Leave
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="rounded-full bg-[#edf1ed] px-4 py-2 text-xs font-bold text-[#8c9890] cursor-not-allowed"
                        >
                          Full Session
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinClick(match)}
                          className="flex items-center gap-2 rounded-full bg-[#17201c] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#a8e63d] hover:text-[#17201c] shadow-sm active:scale-95"
                        >
                          <Users className="h-3.5 w-3.5 text-[#a8e63d] group-hover:text-[#17201c]" />
                          Ask to Join
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#d8e0d6] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fae1] text-[#78a72b]">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#17201c]">No friendly matches found</h3>
            <p className="mt-1 text-xs text-[#7c867f]">
              Try adjusting your search criteria or create your own friendly badminton session!
            </p>
            <button
              onClick={() => {
                if (!user) {
                  openLoginModal();
                  return;
                }
                setIsCreateModalOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a8e63d] px-6 py-3 text-xs font-bold text-[#17201c] shadow-md transition hover:bg-[#b8ef59]"
            >
              <Plus className="h-4 w-4" />
              Host a Match Now
            </button>
          </div>
        )}
      </section>

      {/* Community Info Banner */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3 rounded-[28px] border border-[#e1e7df] bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0fae1] text-[#78a72b]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#17201c]">Solo Player Friendly</h4>
              <p className="mt-1 text-xs text-[#77837b] leading-relaxed">
                Never miss game night just because your regular crew is busy. Meet new sparring partners easily.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#2b6cb0]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#17201c]">Level Matching</h4>
              <p className="mt-1 text-xs text-[#77837b] leading-relaxed">
                Filter by beginner, intermediate, or advanced to find matches that suit your competitive pace.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fef7e7] text-[#975a16]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#17201c]">Fair Cost Splitting</h4>
              <p className="mt-1 text-xs text-[#77837b] leading-relaxed">
                Hosts list the court fee split per player beforehand so there are never any surprises on court.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CREATE FRIENDLY MATCH MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-[#17201c]/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-[#e1e7df] bg-white p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f7f3] text-[#69746c] hover:bg-[#e2e7df] transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fae1] px-3 py-1 text-xs font-bold text-[#4f781a]">
                <Flame className="h-3.5 w-3.5 text-[#78a72b]" />
                Host a Match
              </div>

              <h2 className="mt-2 text-2xl font-extrabold text-[#17201c]">
                Create a Friendly Match<span className="text-[#a8e63d]">.</span>
              </h2>
              <p className="mt-1 text-xs text-[#76827a]">
                Share your court time, pick your format, and invite other players to team up with you.
              </p>

              <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#17201c] mb-1">
                    Match Title / Rally Headline
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Saturday Evening Doubles Sparring (Need 2 Players)"
                    className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#a8e63d] focus:bg-white"
                  />
                </div>

                {/* Venue Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#17201c] mb-1">Badminton Venue</label>
                  <select
                    value={formData.venueName}
                    onChange={(e) => handleVenueChange(e.target.value)}
                    className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#a8e63d] focus:bg-white text-[#3a443e]"
                  >
                    {VENUE_OPTIONS.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#17201c] mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-[#a8e63d]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17201c] mb-1">Time Slot</label>
                    <input
                      type="text"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g. 18:00 - 20:00"
                      className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-[#a8e63d]"
                    />
                  </div>
                </div>

                {/* Format & Skill Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#17201c] mb-1">Format</label>
                    <select
                      value={formData.format}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          format: e.target.value as "Doubles" | "Singles",
                        })
                      }
                      className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#a8e63d]"
                    >
                      <option value="Doubles">Doubles (4 Players)</option>
                      <option value="Singles">Singles (2 Players)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#17201c] mb-1">Target Skill</label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          level: e.target.value as "All Levels" | "Beginner" | "Intermediate" | "Advanced",
                        })
                      }
                      className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#a8e63d]"
                    >
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Fee Split & Shuttles */}
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-[#17201c] mb-1">
                      Fee / Player ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={formData.feePerPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, feePerPerson: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-[#a8e63d]"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#3a443e]">
                      <input
                        type="checkbox"
                        checked={formData.shuttlecockProvided}
                        onChange={(e) =>
                          setFormData({ ...formData, shuttlecockProvided: e.target.checked })
                        }
                        className="h-4 w-4 rounded accent-[#78a72b]"
                      />
                      <span>Shuttlecocks provided</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#17201c] mb-1">
                    Notes / Sparring Rules
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. 15 min warm up, then casual rotation sets. Everyone gets equal court time!"
                    className="w-full rounded-xl border border-[#d8e0d6] bg-[#f9fbf8] px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-[#a8e63d]"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a8e63d] py-3.5 text-xs sm:text-sm font-extrabold text-[#17201c] shadow-lg transition hover:bg-[#b8ef59] active:scale-98"
                >
                  <Sparkles className="h-4 w-4" />
                  Publish Friendly Match
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
