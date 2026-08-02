import type { Lesson } from "./types";
import { SURFACE_LESSONS } from "./surface";
import { SHALLOWS_LESSONS } from "./shallows";
import { BELOW_LESSONS } from "./below";
import { DEEP_LESSONS } from "./deep";
import { ABYSS_LESSONS } from "./abyss";
import { TRENCH_LESSONS } from "./trench";

/** Every topic's lesson, keyed by topic id. */
export const LESSONS: Record<string, Lesson> = {
  ...SURFACE_LESSONS,
  ...SHALLOWS_LESSONS,
  ...BELOW_LESSONS,
  ...DEEP_LESSONS,
  ...ABYSS_LESSONS,
  ...TRENCH_LESSONS,
};

export type { Lesson, LessonSection } from "./types";
