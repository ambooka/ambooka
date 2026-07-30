import { NEXUS_LOG_ENTRIES } from "@/data/nexus-log-data";

import { hasCompleteNexusResourceCoverage } from "./plans";
import { hasCompleteNexusPracticeCoverage } from "./practice";

const entryIds = NEXUS_LOG_ENTRIES.map((entry) => entry.id);
const missingLearning = entryIds.filter(
  (entryId) => !hasCompleteNexusResourceCoverage([entryId]),
);
const missingPractice = entryIds.filter(
  (entryId) => !hasCompleteNexusPracticeCoverage([entryId]),
);

export const NEXUS_RESOURCE_AUDIT = {
  entries: entryIds.length,
  learningComplete: missingLearning.length === 0,
  practiceComplete: missingPractice.length === 0,
  missingLearning,
  missingPractice,
} as const;

if (
  !NEXUS_RESOURCE_AUDIT.learningComplete ||
  !NEXUS_RESOURCE_AUDIT.practiceComplete
) {
  throw new Error(
    `Nexus resource audit failed. Missing learning: ${
      missingLearning.join(", ") || "none"
    }. Missing practice: ${missingPractice.join(", ") || "none"}.`,
  );
}
