"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, GraduationCap, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

// CoachPro Design Tokens
const CARD_RADIUS = 20;
const CARD_PADDING = 24;
const GAP = 16;

const cardStyle = {
  background: "var(--ad-bg-card)",
  backdropFilter: "blur(10px)",
  border: "1px solid var(--ad-border-subtle)",
  borderRadius: CARD_RADIUS,
  boxShadow: "8px 8px 16px rgba(0,0,0,0.04)",
};

interface Experience {
  id: string;
  position: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

interface Education {
  id: string;
  degree: string | null;
  institution: string;
  field_of_study: string | null;
  start_date: string;
}

export default function ResumeManager() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [expResult, eduResult] = await Promise.all([
      supabase.from("experience").select("*").order("display_order"),
      supabase.from("education").select("*").order("display_order"),
    ]);
    if (expResult.data)
      setExperience(expResult.data as unknown as Experience[]);
    if (eduResult.data) setEducation(eduResult.data as unknown as Education[]);
    setLoading(false);
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("experience").delete().eq("id", id);
    fetchData();
  };

  const deleteEducation = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("education").delete().eq("id", id);
    fetchData();
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
            border: "4px solid #4A5D45",
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
      {/* Title Row */}
      <div style={{ marginBottom: GAP + 8 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1e293b" }}>
          Resume
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
          Manage experience and education
        </p>
      </div>

      {/* 2-Column Grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: GAP }}
      >
        {/* Experience Column */}
        <div style={{ ...cardStyle, padding: CARD_PADDING }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "hsl(var(--primary) / 0.12)",
                  color: "hsl(var(--primary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Briefcase size={18} />
              </div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--ad-text-primary)",
                }}
              >
                Experience
              </h2>
            </div>
            <Link
              href="/admin/resume/experience/new"
              style={{ color: "hsl(var(--primary))" }}
            >
              <Plus size={20} />
            </Link>
          </div>

          {experience.length === 0 ? (
            <p
              style={{
                color: "var(--ad-text-tertiary)",
                textAlign: "center",
                padding: 24,
              }}
            >
              No experience entries
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "var(--ad-bg-muted)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: 600,
                          color: "var(--ad-text-primary)",
                          fontSize: 15,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--ad-text-secondary)",
                        }}
                      >
                        {exp.company}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--ad-text-tertiary)",
                          marginTop: 4,
                        }}
                      >
                        {new Date(exp.start_date).getFullYear()} -{" "}
                        {exp.is_current
                          ? "Present"
                          : exp.end_date
                            ? new Date(exp.end_date).getFullYear()
                            : "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Column */}
        <div style={{ ...cardStyle, padding: CARD_PADDING }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(140, 124, 88, 0.12)",
                  color: "#8C7C58",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>
                Education
              </h2>
            </div>
            <Link
              href="/admin/resume/education/new"
              style={{ color: "#8C7C58" }}
            >
              <Plus size={20} />
            </Link>
          </div>

          {education.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>
              No education entries
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "rgba(241, 245, 249, 0.6)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: 15,
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <p style={{ fontSize: 13, color: "#64748b" }}>
                        {edu.institution}
                      </p>
                      <p
                        style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}
                      >
                        {edu.field_of_study} •{" "}
                        {new Date(edu.start_date).getFullYear()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
