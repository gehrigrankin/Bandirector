/**
 * Lesson content for a curriculum topic. Plain text only — paragraphs are
 * separate strings, no markdown.
 */
export interface LessonSection {
  heading: string;
  body: string[];
}

export interface Lesson {
  /** Why this matters — the hook. 1–2 short paragraphs. */
  intro: string[];
  /** The actual teaching, in small titled chunks. */
  sections: LessonSection[];
  /** Ordered practice routine — concrete, do-this-now steps. */
  practice: string[];
  /** The most common mistake or trap for this topic. */
  watchOut?: string;
}
