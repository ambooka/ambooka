"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContentRow {
  id: string;
  section: string;
  title: string;
  subtitle: string | null;
  content: string;
  metadata: unknown;
  display_order: number | null;
  is_active: boolean | null;
}

function tagsFromMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "";
  }

  const tags = (metadata as { tags?: unknown }).tags;
  return Array.isArray(tags)
    ? tags.filter((tag): tag is string => typeof tag === "string").join(", ")
    : "";
}

export default function AdminContentPage() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    void fetchContent();
  }, []);

  async function fetchContent() {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("*")
      .eq("section", "build_area")
      .order("display_order");

    if (error) console.error("Failed to load portfolio content:", error);
    setRows((data || []) as ContentRow[]);
    setLoading(false);
  }

  function updateRow(id: string, patch: Partial<ContentRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  async function saveRow(row: ContentRow) {
    setSavingId(row.id);
    setSavedId(null);
    const tags = tagsFromMetadata(row.metadata)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const metadata =
      row.section === "build_area" ? { tags } : row.metadata || {};

    const { error } = await supabase
      .from("portfolio_content")
      .update({
        title: row.title,
        subtitle: row.subtitle,
        content: row.content,
        metadata,
        is_active: row.is_active,
        display_order: row.display_order,
      })
      .eq("id", row.id);

    if (error) {
      console.error("Failed to save portfolio content:", error);
    } else {
      setSavedId(row.id);
      window.setTimeout(() => setSavedId(null), 2500);
    }
    setSavingId(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-slate-400">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Homepage content
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
          What I Build manager
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Edit the recruiter-facing What I Build cards without changing
          frontend code. Project, résumé, skill and blog data remain in their
          dedicated admin sections.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-3xl border border-slate-800 bg-slate-950 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-sky-300">
                {row.section.replaceAll("_", " ")}
              </span>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <input
                  type="checkbox"
                  checked={Boolean(row.is_active)}
                  onChange={(event) =>
                    updateRow(row.id, { is_active: event.target.checked })
                  }
                />
                Public
              </label>
            </div>

            <div className="space-y-3">
              <input
                value={row.title}
                onChange={(event) =>
                  updateRow(row.id, { title: event.target.value })
                }
                aria-label="Title"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-400"
              />
              <input
                value={row.subtitle || ""}
                onChange={(event) =>
                  updateRow(row.id, { subtitle: event.target.value })
                }
                aria-label="Subtitle"
                placeholder="Subtitle"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-sky-400"
              />
              <textarea
                value={row.content}
                onChange={(event) =>
                  updateRow(row.id, { content: event.target.value })
                }
                aria-label="Content"
                rows={4}
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-200 outline-none focus:border-sky-400"
              />
              {row.section === "build_area" && (
                <input
                  value={tagsFromMetadata(row.metadata)}
                  onChange={(event) =>
                    updateRow(row.id, {
                      metadata: {
                        tags: event.target.value.split(",").map((tag) => tag.trim()),
                      },
                    })
                  }
                  aria-label="Tags"
                  placeholder="Tags, separated, by commas"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-sky-400"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => void saveRow(row)}
              disabled={savingId === row.id}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
            >
              {savingId === row.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : savedId === row.id ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {savedId === row.id ? "Saved" : "Save"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
