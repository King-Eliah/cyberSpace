import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: Date | string): { month: string; day: string } {
  const d = new Date(date);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate().toString(),
  };
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isUpcoming(date: Date | string): boolean {
  return new Date(date) > new Date();
}

export function daysUntil(date: Date | string): number {
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const COLLEGE_LABELS: Record<string, string> = {
  COE: "College of Engineering",
  COS: "College of Science",
  KSB: "KNUST School of Business",
  COHS: "College of Health Sciences",
  COA: "College of Architecture",
  COAS: "College of Art & Social Sciences",
  IDL: "Institute of Distance Learning",
  OTHER: "Other",
};

export const CATEGORY_LABELS: Record<string, string> = {
  HACKATHON: "Hackathon",
  TALK: "Talk",
  WORKSHOP: "Workshop",
  CAREER_FAIR: "Career Fair",
  NETWORKING: "Networking",
  CONFERENCE: "Conference",
  COMPETITION: "Competition",
  SOCIAL: "Social",
  OTHER: "Other",
};
