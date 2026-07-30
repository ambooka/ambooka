"use client";

import { useEffect } from "react";

import {
  getNexusPracticeResources,
  type NexusPracticeResource,
} from "./resources/practice";

function getTaskText(host: HTMLElement) {
  return (
    host.parentElement
      ?.querySelector<HTMLButtonElement>(":scope > button")
      ?.textContent?.trim() ?? ""
  );
}

function getEntryId(host: HTMLElement) {
  return host.dataset.taskKey?.split(":")[0] ?? "";
}

function createExternalIcon() {
  const icon = document.createElement("span");
  icon.className = "nexus-practice-external";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "↗";
  return icon;
}

function createPracticeCard(resource: NexusPracticeResource, index: number) {
  const card = document.createElement("article");
  card.className = "nexus-practice-card";

  const heading = document.createElement("div");
  heading.className = "nexus-practice-card-heading";

  const number = document.createElement("span");
  number.className = "nexus-practice-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const titleWrap = document.createElement("div");
  const kind = document.createElement("span");
  kind.className = "nexus-practice-kind";
  kind.textContent = "Practice";

  const titleLink = document.createElement("a");
  titleLink.href = resource.url;
  titleLink.target = "_blank";
  titleLink.rel = "noreferrer";
  titleLink.className = "nexus-practice-title";
  titleLink.textContent = resource.title;
  titleLink.appendChild(createExternalIcon());

  titleWrap.append(kind, titleLink);
  heading.append(number, titleWrap);

  const description = document.createElement("p");
  description.className = "nexus-practice-description";
  description.textContent = resource.description;

  const drill = document.createElement("div");
  drill.className = "nexus-practice-drill";

  const drillLabel = document.createElement("strong");
  drillLabel.textContent = "Proof drill";

  const drillText = document.createElement("span");
  drillText.textContent = resource.drill;

  drill.append(drillLabel, drillText);

  const source = document.createElement("small");
  source.className = "nexus-practice-source";
  source.textContent = `Source: ${resource.source}`;

  card.append(heading, description, drill, source);
  return card;
}

function createPracticePanel(
  resources: NexusPracticeResource[],
  signature: string,
) {
  const panel = document.createElement("section");
  panel.className = "nexus-task-practice-panel";
  panel.dataset.practiceSignature = signature;

  const header = document.createElement("div");
  header.className = "nexus-practice-header";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("span");
  eyebrow.className = "nexus-practice-eyebrow";
  eyebrow.textContent = "Hands-on checkpoint";

  const title = document.createElement("h4");
  title.textContent = "Practice before completion";

  const intro = document.createElement("p");
  intro.textContent =
    "Use the lab or exercise below, then complete the proof drill in your own Nexus implementation.";

  titleWrap.append(eyebrow, title, intro);

  const count = document.createElement("span");
  count.className = "nexus-practice-count";
  count.textContent = `${resources.length} ${
    resources.length === 1 ? "exercise" : "exercises"
  }`;

  header.append(titleWrap, count);

  const grid = document.createElement("div");
  grid.className = "nexus-practice-grid";
  resources.forEach((resource, index) => {
    grid.appendChild(createPracticeCard(resource, index));
  });

  const note = document.createElement("p");
  note.className = "nexus-practice-note";
  note.textContent =
    "The external exercise is preparation. Your own tested implementation, screenshot, log, benchmark, report, or case-study evidence is the completion proof.";

  panel.append(header, grid, note);
  return panel;
}

function syncPracticePanel(host: HTMLElement) {
  const taskText = getTaskText(host);
  const entryId = getEntryId(host);
  const details = host.querySelector<HTMLElement>(".nexus-task-learning");
  const body = details?.querySelector<HTMLElement>(
    ".nexus-task-learning-body",
  );
  const assessment = body?.querySelector<HTMLElement>(
    ".nexus-task-assessment",
  );
  if (!taskText || !entryId || !body || !assessment) return;

  const resources = getNexusPracticeResources(taskText, entryId);
  const signature = resources.map((resource) => resource.url).join("|");
  const current = body.querySelector<HTMLElement>(
    ":scope > .nexus-task-practice-panel",
  );

  if (resources.length === 0) {
    current?.remove();
    return;
  }

  if (current?.dataset.practiceSignature === signature) return;

  const panel = createPracticePanel(resources, signature);
  current?.replaceWith(panel);
  if (!current) assessment.before(panel);
}

export default function NexusPracticeResources() {
  useEffect(() => {
    const shell = document.getElementById("nexus-log-shell");
    if (!shell) return;

    let frame = 0;
    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        shell
          .querySelectorAll<HTMLElement>(".nexus-task-resource-host")
          .forEach(syncPracticePanel);
      });
    };

    const observer = new MutationObserver(sync);
    observer.observe(shell, { childList: true, subtree: true });
    sync();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
