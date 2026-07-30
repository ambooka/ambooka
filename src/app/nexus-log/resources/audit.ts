import { NEXUS_LOG_ENTRIES } from "@/data/nexus-log-data";

import { hasCompleteNexusResourceCoverage } from "./plans";
import { hasCompleteNexusPracticeCoverage } from "./practice";

const entryIds = NEXUS_LOG_ENTRIES.map((entry) => entry.id);

export const NEXUS_RESOURCE_AUDIT = {
  entries: entryIds.length,
  learningComplete: hasCompleteNexusResourceCoverage(entryIds),
  practiceComplete: hasCompleteNexusPracticeCoverage(entryIds),
} as const;

if (
  !NEXUS_RESOURCE_AUDIT.learningComplete ||
  !NEXUS_RESOURCE_AUDIT.practiceComplete
) {
  throw new Error(
    "Nexus resource audit failed: every sprint and deload must have learning and practice coverage.",
  );
}
