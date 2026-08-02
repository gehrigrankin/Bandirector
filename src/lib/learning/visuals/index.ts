import type { Visual } from "./types";
import { SURFACE_VISUALS } from "./surface";
import { SHALLOWS_VISUALS } from "./shallows";
import { BELOW_VISUALS } from "./below";
import { DEEP_VISUALS } from "./deep";
import { ABYSS_VISUALS } from "./abyss";
import { TRENCH_VISUALS } from "./trench";

/** Interactive visuals per topic id. */
export const TOPIC_VISUALS: Record<string, Visual[]> = {
  ...SURFACE_VISUALS,
  ...SHALLOWS_VISUALS,
  ...BELOW_VISUALS,
  ...DEEP_VISUALS,
  ...ABYSS_VISUALS,
  ...TRENCH_VISUALS,
};

export type { Visual } from "./types";
