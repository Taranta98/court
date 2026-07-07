import type { ClubDTO } from "@/lib/data/clubs";
import { sportLabels, type SportSlug } from "@/lib/sport";

export interface ClubSearchFilters {
  q?: string;
  sport?: SportSlug;
}

export function filterClubs(clubs: ClubDTO[], filters: ClubSearchFilters): ClubDTO[] {
  let result = clubs;

  if (filters.sport) {
    result = result.filter((club) => club.sports.includes(filters.sport!));
  }

  const query = filters.q?.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (club) =>
        club.name.toLowerCase().includes(query) ||
        club.city.toLowerCase().includes(query) ||
        club.address.toLowerCase().includes(query) ||
        club.description.toLowerCase().includes(query) ||
        club.sports.some((sport) => sportLabels[sport].toLowerCase().includes(query)),
    );
  }

  return result;
}

export function buildCircoliSearchUrl(filters: ClubSearchFilters): string {
  const params = new URLSearchParams();
  if (filters.q?.trim()) params.set("q", filters.q.trim());
  if (filters.sport) params.set("sport", filters.sport);
  const qs = params.toString();
  return qs ? `/circoli?${qs}` : "/circoli";
}
