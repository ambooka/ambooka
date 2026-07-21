"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  Calendar,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";

// CoachPro Design Tokens
const CARD_RADIUS = 20;
const CARD_PADDING = 24;
const GAP = 16;

const cardStyle = {
  background: "var(--ad-bg-card)",
  backdropFilter: "blur(10px)",
  border: "1px solid var(--ad-border-subtle)",
  borderRadius: CARD_RADIUS,
  boxShadow:
    "8px 8px 16px rgba(166, 180, 200, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.6)",
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  is_published: boolean;
  ai_generated?: boolean;
  generation_topic?: string | null;
  created_at: string;
}

interface BlogTopic {
  id: string;
  title: string;
  context: string;
  category: string;
  is_active: boolean;
  display_order: number;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContext, setNewTopicContext] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState("Software Engineering");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generationMessage, setGenerationMessage] = useState<string | null>(
    null,
  );
  const [generationError, setGenerationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
    fetchTopics();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const fetchTopics = async () => {
    const { data } = await supabase
      .from("blog_topics")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setTopics(data);
  };

  const addTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicContext.trim()) return;
    const { error } = await supabase.from("blog_topics").insert({
      title: newTopicTitle.trim(),
      context: newTopicContext.trim(),
      category: newTopicCategory,
      keywords: [],
      is_active: true,
      display_order: topics.length + 1,
    });
    if (error) {
      setGenerationError(error.message);
      return;
    }
    setNewTopicTitle("");
    setNewTopicContext("");
    await fetchTopics();
  };

  const toggleTopic = async (topic: BlogTopic) => {
    await supabase
      .from("blog_topics")
      .update({ is_active: !topic.is_active, updated_at: new Date().toISOString() })
      .eq("id", topic.id);
    await fetchTopics();
  };

  const deleteTopic = async (id: string) => {
    if (!confirm("Delete this generation topic?")) return;
    await supabase.from("blog_topics").delete().eq("id", id);
    await fetchTopics();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase
      .from("blog_posts")
      .update({
        is_published: !current,
        published_at: !current ? new Date().toISOString() : null,
      })
      .eq("id", id);
    fetchPosts();
  };

  const generateAIDraft = async () => {
    setGenerating(true);
    setGenerationMessage(null);
    setGenerationError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Please sign in again before generating drafts.");
      }

      const response = await fetch("/api/blog/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ count: 1, publish: false }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Draft generation failed.");
      }

      setGenerationMessage(
        `Generated draft: ${result.posts?.[0]?.title || "New blog post"}`,
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      fetchPosts();
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Draft generation failed.",
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid var(--ad-primary)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "ad-spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Success Toast */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 100,
            padding: "12px 20px",
            borderRadius: 12,
            background: "hsl(var(--primary) / 0.12)",
            border: "1px solid hsl(var(--primary) / 0.9)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
          <span style={{ color: "#16a34a", fontWeight: 500, fontSize: 14 }}>
            Done!
          </span>
        </div>
      )}

      {/* Title Row */}
      <div style={{ marginBottom: GAP + 8 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--ad-text-primary)",
          }}
        >
          Blog
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--ad-text-secondary)",
            marginTop: 4,
          }}
        >
          Manage posts, generate assistant drafts, and publish reviewed
          technical notes ({posts.length})
        </p>
      </div>

      {/* Actions Row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: GAP,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link
          href="/admin/blog/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 12,
            background: "var(--ad-primary)",
            color: "var(--ad-bg-card)",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
          }}
        >
          <Plus size={16} /> New Post
        </Link>
        <button
          type="button"
          onClick={generateAIDraft}
          disabled={generating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 12,
            background: generating
              ? "var(--ad-bg-muted)"
              : "linear-gradient(135deg, var(--ad-text-primary), var(--ad-text-secondary))",
            color: "var(--ad-bg-card)",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: generating ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.25)",
          }}
        >
          {generating ? (
            <Loader2
              size={16}
              style={{ animation: "ad-spin 1s linear infinite" }}
            />
          ) : (
            <Sparkles size={16} />
          )}
          {generating ? "Generating Draft..." : "Generate Draft"}
        </button>
        <span style={{ fontSize: 12, color: "#64748b" }}>
          Scheduled cadence: Mon, Wed, Fri draft generation.
        </span>
      </div>

      {(generationMessage || generationError) && (
        <div
          style={{
            marginBottom: GAP,
            padding: "12px 14px",
            borderRadius: 12,
            background: generationError
              ? "hsl(var(--destructive) / 0.08)"
              : "hsl(var(--primary) / 0.12)",
            border: generationError
              ? "1px solid hsl(var(--destructive) / 0.3)"
              : "1px solid hsl(var(--primary) / 0.9)",
            color: generationError ? "var(--ad-danger)" : "var(--ad-success)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {generationError || generationMessage}
        </div>
      )}

      <section style={{ ...cardStyle, padding: CARD_PADDING, marginBottom: GAP }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ad-text-primary)" }}>
            Career Activity Topics
          </h2>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--ad-text-secondary)" }}>
            Scheduled drafts rotate through active topics. Add only work and
            learning activities relevant to your target career.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          <input
            value={newTopicTitle}
            onChange={(event) => setNewTopicTitle(event.target.value)}
            placeholder="Topic title"
            style={{ padding: 12, borderRadius: 10, border: "1px solid var(--ad-border-subtle)", background: "var(--ad-bg-muted)", color: "var(--ad-text-primary)" }}
          />
          <textarea
            value={newTopicContext}
            onChange={(event) => setNewTopicContext(event.target.value)}
            placeholder="Describe the day-to-day activity, problem, or lesson without sensitive details"
            rows={3}
            style={{ padding: 12, borderRadius: 10, border: "1px solid var(--ad-border-subtle)", background: "var(--ad-bg-muted)", color: "var(--ad-text-primary)", resize: "vertical" }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={newTopicCategory}
              onChange={(event) => setNewTopicCategory(event.target.value)}
              style={{ flex: 1, minWidth: 180, padding: 12, borderRadius: 10, border: "1px solid var(--ad-border-subtle)", background: "var(--ad-bg-muted)", color: "var(--ad-text-primary)" }}
            >
              <option>Software Engineering</option>
              <option>Backend Engineering</option>
              <option>Business Systems</option>
              <option>IT Infrastructure</option>
            </select>
            <button
              type="button"
              onClick={addTopic}
              disabled={!newTopicTitle.trim() || !newTopicContext.trim()}
              style={{ padding: "11px 18px", borderRadius: 10, background: "var(--ad-primary)", color: "var(--ad-bg-card)", fontWeight: 700, opacity: !newTopicTitle.trim() || !newTopicContext.trim() ? 0.5 : 1 }}
            >
              Add Topic
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {topics.map((topic) => (
            <div key={topic.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, background: "var(--ad-bg-muted)", opacity: topic.is_active ? 1 : 0.55 }}>
              <button
                type="button"
                onClick={() => toggleTopic(topic)}
                aria-label={topic.is_active ? "Disable topic" : "Enable topic"}
                style={{ width: 12, height: 12, borderRadius: 999, background: topic.is_active ? "#16a34a" : "#94a3b8", flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: "block", color: "var(--ad-text-primary)", fontSize: 14 }}>{topic.title}</strong>
                <span style={{ display: "block", color: "var(--ad-text-secondary)", fontSize: 12 }}>{topic.category} · {topic.context}</span>
              </div>
              <button type="button" onClick={() => deleteTopic(topic.id)} aria-label="Delete topic" style={{ padding: 8, color: "hsl(var(--destructive))" }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div style={{ ...cardStyle, padding: 60, textAlign: "center" }}>
          <FileText
            size={48}
            style={{
              color: "var(--ad-text-secondary)",
              marginBottom: 16,
              opacity: 0.36,
            }}
          />
          <p style={{ color: "var(--ad-text-secondary)" }}>No blog posts yet</p>
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: CARD_PADDING }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderRadius: 12,
                  background: "var(--ad-bg-muted)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: 600,
                        color: "var(--ad-text-primary)",
                        fontSize: 15,
                      }}
                    >
                      {post.title}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: post.is_published
                          ? "hsl(var(--primary) / 0.12)"
                          : "hsl(var(--accent) / 0.12)",
                        color: post.is_published
                          ? "hsl(var(--primary))"
                          : "hsl(var(--accent))",
                      }}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                    {post.ai_generated && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "var(--ad-primary-100)",
                          color: "var(--ad-primary)",
                        }}
                      >
                        Assistant Draft
                      </span>
                    )}
                  </div>
                  <p
                    style={{ fontSize: 13, color: "var(--ad-text-secondary)" }}
                  >
                    {(post.generation_topic || post.excerpt || "").slice(
                      0,
                      120,
                    )}
                    ...
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--ad-text-tertiary)",
                      marginTop: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Calendar size={12} />
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => togglePublish(post.id, post.is_published)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: post.is_published
                        ? "hsl(var(--accent) / 0.12)"
                        : "hsl(var(--primary) / 0.12)",
                      color: post.is_published
                        ? "hsl(var(--accent))"
                        : "hsl(var(--primary))",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/blog/${post.id}`)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: "var(--ad-bg-muted)",
                      color: "var(--ad-text-secondary)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: "hsl(var(--destructive) / 0.08)",
                      color: "hsl(var(--destructive))",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
