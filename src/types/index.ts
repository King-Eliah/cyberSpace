export type College =
  | "COE"
  | "COS"
  | "KSB"
  | "COHS"
  | "COA"
  | "COAS"
  | "IDL"
  | "OTHER";

export type EventCategory =
  | "HACKATHON"
  | "TALK"
  | "WORKSHOP"
  | "CAREER_FAIR"
  | "NETWORKING"
  | "CONFERENCE"
  | "COMPETITION"
  | "SOCIAL"
  | "OTHER";

export type EventStatus = "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";

export type RsvpStatus = "INTERESTED" | "GOING" | "ATTENDED" | "MISSED";

export type TipType =
  | "BEST_PART"
  | "SKIP_THIS"
  | "BRING_THIS"
  | "TALK_TO"
  | "GENERAL";

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED";

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  college: College;
  program?: string | null;
  yearOfStudy?: number | null;
  interests: string[];
  bio?: string | null;
  linkedinUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startsAt: Date;
  endsAt?: Date | null;
  location?: string | null;
  isOnline: boolean;
  category: EventCategory;
  tags: string[];
  targetColleges: College[];
  organizer: string;
  coverImageUrl?: string | null;
  requiresApplication: boolean;
  applicationUrl?: string | null;
  applicationDeadline?: Date | null;
  status: EventStatus;
  source: string;
  sourceUrl?: string | null;
  rsvps?: Rsvp[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
  _count?: { rsvps: number; comments: number };
}

export interface Rsvp {
  id: string;
  userId: string;
  eventId: string;
  status: RsvpStatus;
  createdAt: Date;
  user?: User;
  event?: Event;
}

export interface Comment {
  id: string;
  userId: string;
  eventId: string;
  parentCommentId?: string | null;
  content: string;
  tipType?: TipType | null;
  isFlagged: boolean;
  isHidden: boolean;
  createdAt: Date;
  user?: Pick<User, "id" | "name" | "username" | "avatarUrl" | "college">;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string | null;
  isRemote: boolean;
  isPaid: boolean;
  stipendRange?: string | null;
  applicationUrl: string;
  applicationDeadline?: Date | null;
  tags: string[];
  experienceLevel: string;
  source: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  userId: string;
  internshipId: string;
  status: ApplicationStatus;
  notes?: string | null;
  appliedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  internship?: Internship;
}

export interface LinkedInVariant {
  label: string;
  hook: string;
  content: string;
}

export interface PreEventBrief {
  whatToExpect: string;
  conversationStarters: string[];
  whatToBring: string[];
  networkingTip: string;
  mindsetPrimer: string;
}

export interface EventWithRsvp extends Event {
  userRsvp?: Rsvp | null;
  goingCount: number;
}
