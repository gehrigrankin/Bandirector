// The device-local song library: every song is its own project, one of them
// is open in the Studio, and autosave writes to whichever that is. The
// previous single autosave slot (and the older single-loop Studio) are
// lifted into the library the first time it loads.

import { z } from "zod";
import { newId, type Song } from "@/lib/song/model";
import { loadSong, parseSong, SONG_STORAGE_KEY } from "@/lib/song/store";

export const LIBRARY_KEY = "bandirector.songs.v1";
export const MAX_PROJECTS = 50;

export interface Project {
  id: string;
  updatedAt: number;
  song: Song;
}

export interface ProjectMeta {
  id: string;
  title: string;
  updatedAt: number;
  sections: number;
  tracks: number;
}

interface Library {
  version: 1;
  currentId: string | null;
  projects: Project[];
}

const librarySchema = z.object({
  version: z.literal(1),
  currentId: z.string().nullable(),
  projects: z
    .array(z.object({ id: z.string().min(1), updatedAt: z.number().finite(), song: z.unknown() }))
    .max(MAX_PROJECTS),
});

function read(): Library {
  if (typeof window === "undefined") return { version: 1, currentId: null, projects: [] };
  try {
    const raw = window.localStorage.getItem(LIBRARY_KEY);
    if (raw) {
      const parsed = librarySchema.safeParse(JSON.parse(raw));
      if (parsed.success) {
        const projects: Project[] = [];
        for (const p of parsed.data.projects) {
          const song = parseSong(p.song);
          if (song) projects.push({ id: p.id, updatedAt: p.updatedAt, song });
        }
        return { version: 1, currentId: parsed.data.currentId, projects };
      }
    }
  } catch {
    /* corrupt — fall through to migration */
  }
  // First run: adopt whatever the single-slot autosave held.
  const legacy = loadSong();
  if (legacy) {
    const project = { id: newId("p"), updatedAt: Date.now(), song: legacy };
    const lib: Library = { version: 1, currentId: project.id, projects: [project] };
    write(lib);
    try {
      window.localStorage.removeItem(SONG_STORAGE_KEY);
    } catch {
      /* noop */
    }
    return lib;
  }
  return { version: 1, currentId: null, projects: [] };
}

function write(lib: Library): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
    return true;
  } catch {
    return false;
  }
}

export function meta(p: Project): ProjectMeta {
  return {
    id: p.id,
    title: p.song.title || "Untitled song",
    updatedAt: p.updatedAt,
    sections: p.song.sections.length,
    tracks: p.song.tracks.length,
  };
}

/** All projects, most recently edited first. */
export function listProjects(): ProjectMeta[] {
  return read()
    .projects.map(meta)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/** The project that's open in the Studio (or the most recent one), if any. */
export function currentProject(): Project | null {
  const lib = read();
  const current = lib.projects.find((p) => p.id === lib.currentId);
  if (current) return current;
  return [...lib.projects].sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;
}

export function openProject(id: string): Project | null {
  const lib = read();
  const project = lib.projects.find((p) => p.id === id);
  if (!project) return null;
  write({ ...lib, currentId: id });
  return project;
}

/** Save a song into its project (creating the project if it's new) and make
 *  it the open one. */
export function saveProject(id: string, song: Song): boolean {
  const lib = read();
  const updated: Project = { id, updatedAt: Date.now(), song };
  const exists = lib.projects.some((p) => p.id === id);
  const projects = exists
    ? lib.projects.map((p) => (p.id === id ? updated : p))
    : [...lib.projects, updated];
  return write({ version: 1, currentId: id, projects: trim(projects, id) });
}

export function createProject(song: Song): Project {
  const project: Project = { id: newId("p"), updatedAt: Date.now(), song };
  saveProject(project.id, song);
  return project;
}

export function deleteProject(id: string): void {
  const lib = read();
  const projects = lib.projects.filter((p) => p.id !== id);
  write({ ...lib, projects, currentId: lib.currentId === id ? null : lib.currentId });
}

/** Keep the library under its cap by dropping the oldest, never the open one. */
function trim(projects: Project[], keepId: string): Project[] {
  if (projects.length <= MAX_PROJECTS) return projects;
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
  const kept = sorted.slice(0, MAX_PROJECTS);
  if (!kept.some((p) => p.id === keepId)) {
    const current = projects.find((p) => p.id === keepId);
    if (current) kept[kept.length - 1] = current;
  }
  return kept;
}

/** The shape written by "Export file" and accepted by "Import file". */
export function serializeProject(song: Song): string {
  return JSON.stringify({ app: "bandirector", version: 2, song }, null, 2);
}

export function parseProjectFile(text: string): Song | null {
  try {
    const raw = JSON.parse(text) as { song?: unknown };
    return parseSong(raw?.song ?? raw);
  } catch {
    return null;
  }
}

export function projectFileName(song: Song): string {
  const base = (song.title || "song").trim().replace(/[^\w\- ]+/g, "").replace(/\s+/g, "-");
  return `${base || "song"}.bandirector.json`;
}
