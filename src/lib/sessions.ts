import { SLIDES_DATA, SlideData } from "@/data/slides";
import { SESSION2_SLIDES } from "@/data/session2";
import { SESSION3_SLIDES } from "@/data/session3";
import { SESSION4_SLIDES } from "@/data/session4";

/* ===========================================================
   WORKSHOP SESSION REGISTRY

   The single source of truth for what sessions exist. The homepage
   renders a tile per entry; /sessions/[slug] renders its deck.

   To add a session: append an entry here and point `slides` at its
   deck data. `slides: null` means "planned but not written yet" —
   the tile shows as upcoming and the route stays closed even if an
   admin unlocks it.
   =========================================================== */

export interface WorkshopSession {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  topics: string[];
  /** Palette accent for the tile. Uses the existing deck colors. */
  accent: "orange" | "sky" | "yellow" | "mint";
  /** null until the deck for this session has been authored. */
  slides: SlideData[] | null;
}

export const SESSIONS: WorkshopSession[] = [
  {
    slug: "session-1",
    number: 1,
    title: 'From "It Works on My Machine" to Docker',
    tagline:
      "A story-driven journey through DevOps, virtual machines, containers, Kubernetes, CI/CD and Terraform.",
    topics: ["DevOps", "VMs", "Containers", "Kubernetes", "CI/CD", "Terraform"],
    accent: "orange",
    slides: SLIDES_DATA,
  },
  {
    slug: "session-2",
    number: 2,
    title: "Docker Fundamentals: From Code to Container",
    tagline:
      "Three hands-on projects: containerise and shrink a Streamlit app, watch a Flask blog lose its data, and keep MySQL's data safe in a volume.",
    topics: ["Dockerfile", "Image size", "Layer caching", "SQLite", "MySQL volumes"],
    accent: "sky",
    slides: SESSION2_SLIDES,
  },
  {
    slug: "session-3",
    number: 3,
    title: "Docker Development Workflow: Bind Mounts, Networking & Compose",
    tagline:
      "Build a Flask + MySQL Task Manager twice: two containers wired by hand, then the same app in one compose.yaml.",
    topics: ["Bind mounts", "Networking", "Compose", "Env vars", "Debugging"],
    accent: "yellow",
    slides: SESSION3_SLIDES,
  },
  {
    slug: "session-4",
    number: 4,
    title: "Docker to Production: Docker Hub, EC2 & HTTPS",
    tagline:
      "Take the Task Manager off the laptop: publish the image, rent a server, put it on a domain, and get a padlock in the browser.",
    topics: ["Docker Hub", "EC2", "Compose", "Caddy / TLS", "Secrets", "Debugging"],
    accent: "mint",
    slides: SESSION4_SLIDES,
  },
];

export function getSession(slug: string): WorkshopSession | undefined {
  return SESSIONS.find((s) => s.slug === slug);
}

/** A session can only be opened once it is both authored and unlocked. */
export function isPlayable(
  session: WorkshopSession,
  unlocked: string[]
): boolean {
  return session.slides !== null && unlocked.includes(session.slug);
}
