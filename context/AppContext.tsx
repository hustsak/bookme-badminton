"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

export type Booking = {
  id: string;
  venueId: number;
  venueName: string;
  venueImage: string;
  courtName: string;
  location: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  qrCode: string;
};

export type FriendlyMatchPlayer = {
  id: number | string;
  name: string;
  avatar: string;
  joinedAt: string;
};

export type FriendlyMatch = {
  id: string;
  title: string;
  venueId?: number;
  venueName: string;
  location: string;
  courtName?: string;
  date: string;
  time: string;
  level: "All Levels" | "Beginner" | "Intermediate" | "Advanced";
  format: "Doubles" | "Singles";
  totalSlots: number;
  feePerPerson: number;
  description: string;
  shuttlecockProvided: boolean;
  host: {
    id: number | string;
    name: string;
    avatar: string;
    contact?: string;
  };
  joinedPlayers: FriendlyMatchPlayer[];
  status: "OPEN" | "FULL" | "COMPLETED";
  createdAt: string;
};

type AppContextType = {
  user: User | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  favorites: number[];
  toggleFavorite: (venueId: number) => void;
  isFavorite: (venueId: number) => boolean;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "qrCode">) => Booking;
  cancelBooking: (bookingId: string) => void;
  friendlyMatches: FriendlyMatch[];
  createFriendlyMatch: (data: {
    title: string;
    venueName: string;
    location: string;
    date: string;
    time: string;
    level: "All Levels" | "Beginner" | "Intermediate" | "Advanced";
    format: "Doubles" | "Singles";
    totalSlots?: number;
    feePerPerson: number;
    description: string;
    shuttlecockProvided: boolean;
  }) => FriendlyMatch;
  joinFriendlyMatch: (matchId: string) => { success: boolean; message: string };
  leaveFriendlyMatch: (matchId: string) => void;
  deleteFriendlyMatch: (matchId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 1,
  name: "Alex Nguyen",
  email: "alex.nguyen@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-8921",
    venueId: 1,
    venueName: "Smash Arena",
    venueImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=85",
    courtName: "Court 01 (VIP Wood)",
    location: "Thanh Xuan, Hanoi",
    date: "2026-10-05",
    timeSlot: "18:00 - 20:00",
    duration: 2,
    totalPrice: 12,
    status: "CONFIRMED",
    qrCode: "BK8921-SMASH-COURT01",
  },
  {
    id: "BK-7412",
    venueId: 2,
    venueName: "Victory Badminton Club",
    venueImage: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=85",
    courtName: "Court 03",
    location: "Cau Giay, Hanoi",
    date: "2026-09-28",
    timeSlot: "14:00 - 15:00",
    duration: 1,
    totalPrice: 5,
    status: "COMPLETED",
    qrCode: "BK7412-VIC-COURT03",
  },
];

const INITIAL_FRIENDLY_MATCHES: FriendlyMatch[] = [
  {
    id: "MATCH-101",
    title: "Weekend Doubles Sparring (Need 1 Player!)",
    venueId: 1,
    venueName: "Smash Arena",
    location: "Thanh Xuan, Hanoi",
    courtName: "Court 02",
    date: "2026-10-06",
    time: "18:00 - 20:00",
    level: "Intermediate",
    format: "Doubles",
    totalSlots: 4,
    feePerPerson: 3,
    description:
      "Looking for 1 more friendly player to join our 2-hour doubles sparring. We play for fun, good rallies and friendly competition. High quality feather shuttles provided!",
    shuttlecockProvided: true,
    host: {
      id: 99,
      name: "Minh Duc",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      contact: "0912 345 678",
    },
    joinedPlayers: [
      {
        id: 99,
        name: "Minh Duc (Host)",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-02 09:30",
      },
      {
        id: 102,
        name: "Hai Dang",
        avatar:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-02 10:15",
      },
      {
        id: 103,
        name: "Thao My",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-02 11:00",
      },
    ],
    status: "OPEN",
    createdAt: "2026-10-02",
  },
  {
    id: "MATCH-102",
    title: "Beginner / Casual Singles Sparring & Drills",
    venueId: 2,
    venueName: "Victory Badminton Club",
    location: "Cau Giay, Hanoi",
    courtName: "Court 05",
    date: "2026-10-07",
    time: "19:00 - 20:30",
    level: "Beginner",
    format: "Singles",
    totalSlots: 2,
    feePerPerson: 4,
    description:
      "New to badminton or working on basic footwork & clears? Let's do some rally drills followed by a friendly singles match. Split court fee 50/50.",
    shuttlecockProvided: false,
    host: {
      id: 88,
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      contact: "sarah.j@example.com",
    },
    joinedPlayers: [
      {
        id: 88,
        name: "Sarah Jenkins (Host)",
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-02 12:00",
      },
    ],
    status: "OPEN",
    createdAt: "2026-10-02",
  },
  {
    id: "MATCH-103",
    title: "High Intensity Advanced Doubles Smash Session",
    venueId: 3,
    venueName: "Pro Court",
    location: "Dong Da, Hanoi",
    courtName: "Court 01 (Championship)",
    date: "2026-10-08",
    time: "20:00 - 22:00",
    level: "Advanced",
    format: "Doubles",
    totalSlots: 4,
    feePerPerson: 5,
    description:
      "Looking for fast-paced players who can handle steep smashes, aggressive drives, and quick net interceptions. Bring your A-game!",
    shuttlecockProvided: true,
    host: {
      id: 77,
      name: "Tuan Anh",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      contact: "0988 777 999",
    },
    joinedPlayers: [
      {
        id: 77,
        name: "Tuan Anh (Host)",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-01 15:00",
      },
      {
        id: 104,
        name: "Bao Long",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-01 16:30",
      },
    ],
    status: "OPEN",
    createdAt: "2026-10-01",
  },
  {
    id: "MATCH-104",
    title: "Early Bird Morning Doubles Routine",
    venueId: 4,
    venueName: "Green Shuttle",
    location: "Thanh Xuan, Hanoi",
    courtName: "Court 03",
    date: "2026-10-06",
    time: "06:30 - 08:00",
    level: "All Levels",
    format: "Doubles",
    totalSlots: 4,
    feePerPerson: 2,
    description:
      "Start the day energized! Warm up stretches then casual doubles games before going to work. All filled up for this Tuesday.",
    shuttlecockProvided: true,
    host: {
      id: 66,
      name: "Kim Chi",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    joinedPlayers: [
      {
        id: 66,
        name: "Kim Chi",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-01",
      },
      {
        id: 105,
        name: "Hoang Nam",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-01",
      },
      {
        id: 106,
        name: "Lan Huong",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-01",
      },
      {
        id: 107,
        name: "Quoc Viet",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        joinedAt: "2026-10-01",
      },
    ],
    status: "FULL",
    createdAt: "2026-10-01",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([1, 3]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [friendlyMatches, setFriendlyMatches] = useState<FriendlyMatch[]>(INITIAL_FRIENDLY_MATCHES);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("bm_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedFavs = localStorage.getItem("bm_favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedBookings = localStorage.getItem("bm_bookings");
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedMatches = localStorage.getItem("bm_friendly_matches");
      if (savedMatches) setFriendlyMatches(JSON.parse(savedMatches));
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      if (user) localStorage.setItem("bm_user", JSON.stringify(user));
      else localStorage.removeItem("bm_user");
    } catch (e) { }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("bm_favorites", JSON.stringify(favorites));
    } catch (e) { }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("bm_bookings", JSON.stringify(bookings));
    } catch (e) { }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem("bm_friendly_matches", JSON.stringify(friendlyMatches));
    } catch (e) { }
  }, [friendlyMatches]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const login = (email?: string, name?: string) => {
    const userName = name || (email ? email.split("@")[0] : DEMO_USER.name);
    const loggedInUser: User = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      name: userName,
    };
    setUser(loggedInUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (venueId: number) => {
    setFavorites((prev) =>
      prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId]
    );
  };

  const isFavorite = (venueId: number) => favorites.includes(venueId);

  const addBooking = (newBookingData: Omit<Booking, "id" | "status" | "qrCode">): Booking => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...newBookingData,
      id,
      status: "CONFIRMED",
      qrCode: `${id}-${newBookingData.venueName.substring(0, 4).toUpperCase()}`,
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
    );
  };

  const createFriendlyMatch = (data: {
    title: string;
    venueName: string;
    location: string;
    date: string;
    time: string;
    level: "All Levels" | "Beginner" | "Intermediate" | "Advanced";
    format: "Doubles" | "Singles";
    totalSlots?: number;
    feePerPerson: number;
    description: string;
    shuttlecockProvided: boolean;
  }): FriendlyMatch => {
    const activeHost = user || DEMO_USER;
    const matchId = `MATCH-${Math.floor(100 + Math.random() * 900)}`;
    const slots = data.totalSlots || (data.format === "Singles" ? 2 : 4);

    const newMatch: FriendlyMatch = {
      ...data,
      id: matchId,
      totalSlots: slots,
      host: {
        id: activeHost.id,
        name: activeHost.name,
        avatar: activeHost.avatar,
        contact: activeHost.email,
      },
      joinedPlayers: [
        {
          id: activeHost.id,
          name: `${activeHost.name} (Host)`,
          avatar: activeHost.avatar,
          joinedAt: new Date().toISOString().split("T")[0],
        },
      ],
      status: slots <= 1 ? "FULL" : "OPEN",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setFriendlyMatches((prev) => [newMatch, ...prev]);
    return newMatch;
  };

  const joinFriendlyMatch = (matchId: string): { success: boolean; message: string } => {
    const currentUser = user || DEMO_USER;

    let result = { success: false, message: "" };

    setFriendlyMatches((prev) =>
      prev.map((match) => {
        if (match.id !== matchId) return match;

        const isAlreadyJoined = match.joinedPlayers.some((p) => p.id === currentUser.id);
        if (isAlreadyJoined) {
          result = { success: false, message: "You have already joined this match!" };
          return match;
        }

        if (match.joinedPlayers.length >= match.totalSlots) {
          result = { success: false, message: "This match is already fully booked!" };
          return match;
        }

        const updatedPlayers = [
          ...match.joinedPlayers,
          {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            joinedAt: new Date().toISOString().split("T")[0],
          },
        ];

        const isNowFull = updatedPlayers.length >= match.totalSlots;
        result = { success: true, message: "Spot confirmed! You joined the match." };

        return {
          ...match,
          joinedPlayers: updatedPlayers,
          status: isNowFull ? "FULL" : "OPEN",
        };
      })
    );

    return result;
  };

  const leaveFriendlyMatch = (matchId: string) => {
    const currentUser = user || DEMO_USER;
    setFriendlyMatches((prev) =>
      prev.map((match) => {
        if (match.id !== matchId) return match;
        const updatedPlayers = match.joinedPlayers.filter((p) => p.id !== currentUser.id);
        return {
          ...match,
          joinedPlayers: updatedPlayers,
          status: updatedPlayers.length < match.totalSlots ? "OPEN" : match.status,
        };
      })
    );
  };

  const deleteFriendlyMatch = (matchId: string) => {
    setFriendlyMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
        bookings,
        addBooking,
        cancelBooking,
        friendlyMatches,
        createFriendlyMatch,
        joinFriendlyMatch,
        leaveFriendlyMatch,
        deleteFriendlyMatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
