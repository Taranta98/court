import type { SportSlug } from "@/lib/sport";

export interface MatchFeedPost {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  sport: SportSlug;
  location: string;
  schedule: string;
  spotsLeft: number;
  caption: string;
  likes: number;
  comments: number;
  hoursAgo: number;
}

export const matchFeedPosts: MatchFeedPost[] = [
  {
    id: "m1",
    author: "Luca M.",
    initials: "LM",
    avatarColor: "from-sky-400 to-blue-600",
    sport: "padel",
    location: "Milano",
    schedule: "Domani, 18:00",
    spotsLeft: 1,
    caption: "Cerco 1 giocatore livello medio per doppio. Chi si unisce?",
    likes: 12,
    comments: 4,
    hoursAgo: 2,
  },
  {
    id: "m2",
    author: "Sara B.",
    initials: "SB",
    avatarColor: "from-rose-400 to-pink-600",
    sport: "tennis",
    location: "Roma",
    schedule: "Sabato, 10:30",
    spotsLeft: 2,
    caption: "Partita aperta singolare, livello intermedio. Campo già prenotato!",
    likes: 8,
    comments: 2,
    hoursAgo: 5,
  },
  {
    id: "m3",
    author: "Marco R.",
    initials: "MR",
    avatarColor: "from-emerald-400 to-teal-600",
    sport: "calcetto",
    location: "Torino",
    schedule: "Stasera, 21:00",
    spotsLeft: 3,
    caption: "Manca gente per il five! Portate scarpe indoor.",
    likes: 21,
    comments: 9,
    hoursAgo: 1,
  },
];
