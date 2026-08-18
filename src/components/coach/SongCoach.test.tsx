import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/lib/types/database";
import { SongCoach } from "./SongCoach";

const getPublicUrl = vi.fn(() => ({ data: { publicUrl: "https://example.test/song.mp3" } }));
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ storage: { from: () => ({ getPublicUrl }) } }),
}));

const song: Database["public"]["Tables"]["songs"]["Row"] = {
  id: "song-1", title: "Test Song", artist: "Test Artist",
  audio_storage_path: "songs/test.mp3", key: "C", bpm: 120, feel: "rock",
  analysis_json: {
    beats: [],
    chords: [
      { time: 0, duration: 2, chord: "C" }, { time: 2, duration: 2, chord: "G" },
      { time: 4, duration: 2, chord: "Am" }, { time: 6, duration: 2, chord: "F" },
      { time: 8, duration: 2, chord: "Dm" }, { time: 10, duration: 2, chord: "G" },
      { time: 12, duration: 2, chord: "C" }, { time: 14, duration: 2, chord: "F" },
    ],
    version: 1,
  },
  lyrics_lrc: null, uploaded_by: "user-1", status: "ready",
  created_at: "2024-01-01T00:00:00Z",
};

const audioElement = () => document.querySelector("audio") as HTMLAudioElement;

describe("SongCoach", () => {
  beforeEach(() => getPublicUrl.mockClear());

  it("renders song details with the first section, full speed, and stopped playback", () => {
    render(<SongCoach song={song} />);
    expect(screen.getByText(/Test Song/)).toHaveTextContent("Test Song — Test Artist");
    expect(screen.getByText("C · 120 BPM · 4/4")).toBeInTheDocument();
    expect(screen.getAllByText("Part 1")[0]).toHaveClass("text-jam");
    expect(screen.getAllByRole("button", { name: "Full speed" })[0]).toHaveClass("text-jam");
    expect(screen.getAllByRole("button", { name: "Play along" })).toHaveLength(2);
    expect(getPublicUrl).toHaveBeenCalledWith("songs/test.mp3");
    expect(audioElement()).toHaveAttribute("src", "https://example.test/song.mp3");
  });

  it("changes section and speed controls with the keyboard", async () => {
    const user = userEvent.setup();
    render(<SongCoach song={song} />);
    const audio = audioElement();
    const secondSection = screen.getAllByRole("button", { name: /Part 2/ })[0];
    secondSection.focus();
    await user.keyboard("{Enter}");
    expect(secondSection).toHaveClass("border-jam\/60");
    expect(audio.currentTime).toBe(8);
    const slow = screen.getAllByRole("button", { name: "70%" })[0];
    slow.focus();
    await user.keyboard(" ");
    expect(slow).toHaveClass("text-jam");
    expect(audio.playbackRate).toBe(0.7);
  });

  it("tracks media events, starts playback, and loops the selected section", async () => {
    const user = userEvent.setup();
    render(<SongCoach song={song} />);
    const audio = audioElement();
    const play = vi.fn(() => { audio.dispatchEvent(new Event("play")); return Promise.resolve(); });
    Object.defineProperty(audio, "paused", { value: true, configurable: true });
    Object.defineProperty(audio, "play", { value: play, configurable: true });
    const playButton = screen.getAllByRole("button", { name: "Play along" })[0];
    playButton.focus();
    await user.keyboard("{Enter}");
    expect(play).toHaveBeenCalledOnce();
    expect(screen.getAllByRole("button", { name: "Pause" })).toHaveLength(2);
    audio.currentTime = 8;
    fireEvent.timeUpdate(audio);
    expect(audio.currentTime).toBe(0);
    fireEvent.pause(audio);
    expect(screen.getAllByRole("button", { name: "Play along" })).toHaveLength(2);
  });
});
