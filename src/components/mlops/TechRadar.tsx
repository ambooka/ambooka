"use client";
import React from "react";

const radarData = [
  {
    quadrant: "Techniques",
    ring: "Adopt",
    items: ["RAG", "Fine-tuning", "Prompt Eng."],
    color: "bg-[hsl(var(--primary))]",
  },
  {
    quadrant: "Techniques",
    ring: "Trial",
    items: ["LoRA", "QLoRA"],
    color: "bg-[hsl(var(--accent))]",
  },
  {
    quadrant: "Tools",
    ring: "Adopt",
    items: ["Python", "Docker", "Git"],
    color: "bg-[hsl(var(--primary))]",
  },
  {
    quadrant: "Tools",
    ring: "Trial",
    items: ["Ray", "DeepSpeed"],
    color: "bg-[hsl(var(--accent))]",
  },
  {
    quadrant: "Platforms",
    ring: "Adopt",
    items: ["AWS", "GitHub Actions"],
    color: "bg-[hsl(var(--primary))]",
  },
  {
    quadrant: "Platforms",
    ring: "Assess",
    items: ["GCP Vertex AI", "Databricks"],
    color: "bg-[hsl(var(--secondary))]",
  },
  {
    quadrant: "Languages",
    ring: "Adopt",
    items: ["Python", "SQL", "Bash"],
    color: "bg-[hsl(var(--primary))]",
  },
  {
    quadrant: "Languages",
    ring: "Hold",
    items: ["Java", "Scala"],
    color: "bg-[hsl(var(--accent))]",
  },
];

export const TechRadar = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">Technology Radar</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          Strategic Selection
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Adopt", "Trial", "Assess", "Hold"].map((ring) => (
          <div
            key={ring}
            className="card p-4 border border-transparent hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  ring === "Adopt"
                    ? "bg-[hsl(var(--primary))]"
                    : ring === "Trial"
                      ? "bg-[hsl(var(--accent))]"
                      : ring === "Assess"
                        ? "bg-[hsl(var(--secondary))]"
                        : "bg-[hsl(var(--accent))]"
                }`}
              />
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                {ring}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {radarData
                .filter((item) => item.ring === ring)
                .flatMap((group) => group.items)
                .map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
