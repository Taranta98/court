import type { DbSport } from "@/lib/types/db";

export type SportSlug =
  | "tennis"
  | "padel"
  | "calcetto"
  | "calciotto"
  | "pallavolo"
  | "beach_volley"
  | "beach_tennis";

export const sportLabels: Record<SportSlug, string> = {
  tennis: "Tennis",
  padel: "Padel",
  calcetto: "Calcetto",
  calciotto: "Calciotto",
  pallavolo: "Pallavolo",
  beach_volley: "Beach volley",
  beach_tennis: "Beach tennis",
};

const sportToDb: Record<SportSlug, DbSport> = {
  tennis: "TENNIS",
  padel: "PADEL",
  calcetto: "CALCETTO",
  calciotto: "CALCIOTTO",
  pallavolo: "PALLAVOLO",
  beach_volley: "BEACH_VOLLEY",
  beach_tennis: "BEACH_TENNIS",
};

const sportFromDb: Record<DbSport, SportSlug> = {
  TENNIS: "tennis",
  PADEL: "padel",
  CALCETTO: "calcetto",
  CALCIOTTO: "calciotto",
  PALLAVOLO: "pallavolo",
  BEACH_VOLLEY: "beach_volley",
  BEACH_TENNIS: "beach_tennis",
};

export function toDbSport(sport: SportSlug): DbSport {
  return sportToDb[sport];
}

export function fromDbSport(sport: string): SportSlug {
  return sportFromDb[sport as DbSport];
}
