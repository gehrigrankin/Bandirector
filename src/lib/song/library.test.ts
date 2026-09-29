import { beforeEach, describe, expect, it } from "vitest";

import { createSong } from "./model";
import { saveSong } from "./store";
import {
  createProject,
  currentProject,
  deleteProject,
  listProjects,
  openProject,
  parseProjectFile,
  saveProject,
  serializeProject,
} from "./library";

// A tiny localStorage for the node test environment.
class MemoryStorage {
  private map = new Map<string, string>();
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

beforeEach(() => {
  (globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() };
});

describe("song library", () => {
  it("starts empty, then keeps every song as its own project", () => {
    expect(listProjects()).toEqual([]);
    const a = createProject({ ...createSong(), title: "A" });
    const b = createProject({ ...createSong(), title: "B" });
    expect(listProjects().map((p) => p.title)).toEqual(["B", "A"]);
    expect(currentProject()?.id).toBe(b.id);
    expect(openProject(a.id)?.song.title).toBe("A");
    expect(currentProject()?.id).toBe(a.id);
  });

  it("saves edits into the open project only", () => {
    const a = createProject({ ...createSong(), title: "A" });
    const b = createProject({ ...createSong(), title: "B" });
    saveProject(a.id, { ...a.song, bpm: 140 });
    expect(openProject(a.id)?.song.bpm).toBe(140);
    expect(openProject(b.id)?.song.bpm).toBe(100);
  });

  it("deletes a project and falls back to the most recent one", () => {
    const a = createProject({ ...createSong(), title: "A" });
    const b = createProject({ ...createSong(), title: "B" });
    deleteProject(b.id);
    expect(listProjects().map((p) => p.id)).toEqual([a.id]);
    expect(currentProject()?.id).toBe(a.id);
  });

  it("adopts the old single autosave slot on first load", () => {
    saveSong({ ...createSong(), title: "Leftover" });
    expect(listProjects().map((p) => p.title)).toEqual(["Leftover"]);
    expect(currentProject()?.song.title).toBe("Leftover");
  });

  it("round-trips a project file and rejects junk", () => {
    const song = { ...createSong(), title: "Shared" };
    expect(parseProjectFile(serializeProject(song))).toEqual(song);
    expect(parseProjectFile("not json")).toBeNull();
    expect(parseProjectFile('{"song":{"bpm":1}}')).toBeNull();
  });
});
