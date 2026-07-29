"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  ExternalLink,
  FileText,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Wrench,
} from "lucide-react";

import { NEXUS_LOG_ENTRIES } from "@/data/nexus-log-data";
import {
  getNexusStudyPlan,
  hasCompleteNexusResourceCoverage,
  type NexusResourceKind,
  type NexusStudyResource,
} from "./resources/plans";

const KIND_ORDER: NexusResourceKind[] = [
  "Watch",
  "Course",
  "Read",
  "Reference",
  "Practice",
];

const GROUP_META: Record<
  NexusResourceKind,
  { label: string; description: string }
> = {
  Watch: {
    label: "Watch first",
    description: "Use the video walkthroughs to understand the complete flow.",
  },
  Course: {
    label: "Work through",
    description: "Follow the structured lessons and complete the exercises.",
  },
  Read: {
    label: "Read carefully",
    description: "Build the concepts and design decisions before implementation.",
  },
  Reference: {
    label: "Keep open while building",
    description: "Use these as the source of truth during implementation and testing.",
  },
  Practice: {
    label: "Practise and verify",
    description: "Use the exercises and checklists to prove completion.",
  },
};

function iconFor(kind: NexusResourceKind) {
  if (kind === "Watch") return <PlayCircle size={16} />;
  if (kind === "Course") return <GraduationCap size={16} />;
  if (kind === "Read") return <BookOpen size={16} />;
  if (kind === "Practice") return <ListChecks size={16} />;
  return <FileText size={16} />;
}

function ResourceCard({
  resource,
  index,
}: {
  resource: NexusStudyResource;
  index: number;
}) {
  return (
    <a
      className="nexus-inline-resource-card"
      href={resource.url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="nexus-inline-resource-card-top">
        <span className="nexus-inline-resource-kind">
          {iconFor(resource.kind)}
          {resource.kind}
        </span>
        {index === 0 && (
          <span className="nexus-inline-resource-priority">Start here</span>
        )}
        <ExternalLink size={15} aria-hidden="true" />
      </div>
      <h4>{resource.title}</h4>
      <p>{resource.description}</p>
      <span className="nexus-inline-resource-source">{resource.source}</span>
    </a>
  );
}

export default function NexusResources() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [entryId, setEntryId] = useState(NEXUS_LOG_ENTRIES[0]?.id ?? "S01");

  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;

    let host: HTMLDivElement | null = null;

    const syncWithTracker = () => {
      const main = shell.querySelector("main");

      if (main && (!host || !host.isConnected)) {
        host = document.createElement("div");
        host.className = "nexus-resource-host";
        main.appendChild(host);
        setPortalTarget(host);
      }

      const title = shell.querySelector("main h1")?.textContent?.trim();
      if (!title) return;

      const selected = NEXUS_LOG_ENTRIES.find(
        (entry) => entry.title.trim() === title,
      );
      if (selected) setEntryId(selected.id);
    };

    const observer = new MutationObserver(syncWithTracker);
    observer.observe(shell, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    syncWithTracker();

    return () => {
      observer.disconnect();
      host?.remove();
    };
  }, []);

  const entry =
    NEXUS_LOG_ENTRIES.find((item) => item.id === entryId) ??
    NEXUS_LOG_ENTRIES[0];
  const plan = useMemo(() => getNexusStudyPlan(entry.id), [entry.id]);

  const grouped = useMemo(
    () =>
      KIND_ORDER.map((kind) => ({
        kind,
        resources: plan.resources.filter((resource) => resource.kind === kind),
      })).filter((group) => group.resources.length > 0),
    [plan.resources],
  );

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      !hasCompleteNexusResourceCoverage(
        NEXUS_LOG_ENTRIES.map((item) => item.id),
      )
    ) {
      console.warn("Nexus study-resource coverage is incomplete.");
    }
  }, []);

  if (!portalTarget || !entry) return null;

  const missionLabel =
    entry.kind === "deload" ? entry.num : `Mission ${entry.num}`;

  return createPortal(
    <section
      className="nexus-inline-resources"
      aria-labelledby="nexus-inline-resources-title"
    >
      <div className="nexus-inline-resources-head">
        <div>
          <div className="nexus-inline-resources-eyebrow">
            <Wrench size={14} />
            {missionLabel} learning plan
          </div>
          <h2 id="nexus-inline-resources-title">
            Resources for {entry.title}
          </h2>
          <p>{plan.focus}</p>
        </div>
        <div className="nexus-inline-resource-count">
          <strong>{plan.resources.length}</strong>
          <span>curated resources</span>
        </div>
      </div>

      <div className="nexus-inline-sequence">
        <span>1. Watch or take the course</span>
        <span>2. Read the core material</span>
        <span>3. Keep references open while building</span>
        <span>4. Practise and verify before marking done</span>
      </div>

      <div className="nexus-inline-resource-groups">
        {grouped.map(({ kind, resources }) => (
          <div className="nexus-inline-resource-group" key={kind}>
            <div className="nexus-inline-resource-group-head">
              <div>
                <h3>{GROUP_META[kind].label}</h3>
                <p>{GROUP_META[kind].description}</p>
              </div>
              <span>{resources.length}</span>
            </div>
            <div className="nexus-inline-resource-grid">
              {resources.map((resource, index) => (
                <ResourceCard
                  key={`${resource.kind}-${resource.title}`}
                  resource={resource}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>,
    portalTarget,
  );
}
