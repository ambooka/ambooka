"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Code,
  Database,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  PenTool,
  ShieldCheck,
  Target,
  User,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SIDEBAR_WIDTH = 232;

const groups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/admin" }],
  },
  {
    label: "Portfolio Content",
    items: [
      { name: "Profile", icon: User, path: "/admin/profile" },
      { name: "Projects", icon: Briefcase, path: "/admin/projects" },
      { name: "Skills", icon: Code, path: "/admin/skills" },
      { name: "Blog", icon: PenTool, path: "/admin/blog" },
      { name: "Resume", icon: FileText, path: "/admin/resume" },
      { name: "Testimonials", icon: Users, path: "/admin/testimonials" },
    ],
  },
  {
    label: "Quality Control",
    items: [
      { name: "Focus Plan", icon: Target, path: "/admin/roadmap" },
      { name: "Content Rules", icon: ShieldCheck, path: "/admin/content" },
      { name: "Database", icon: Database, path: "/admin/schema" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "hsl(var(--card) / 0.92)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid hsl(var(--border) / 0.72)",
        boxShadow: "8px 0 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ padding: "24px 18px 18px" }}>
        <Link
          href="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
              color: "white",
              fontWeight: 800,
              fontSize: 14,
              boxShadow: "0 8px 18px rgba(74, 93, 69, 0.22)",
            }}
          >
            A
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "hsl(var(--foreground))",
                letterSpacing: "-0.02em",
              }}
            >
              Ambooka
            </div>
            <div
              style={{
                fontSize: 11,
                color: "hsl(var(--muted-foreground))",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Portfolio CMS
            </div>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "0 12px 16px", overflowY: "auto" }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: 18 }}>
            <div
              style={{
                padding: "0 10px 8px",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {group.label}
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minHeight: 42,
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 750,
                      textDecoration: "none",
                      color: active
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                      background: active
                        ? "hsl(var(--accent) / 0.12)"
                        : "transparent",
                      border: active
                        ? "1px solid hsl(var(--accent) / 0.18)"
                        : "1px solid transparent",
                      transition:
                        "background 160ms ease, color 160ms ease, border-color 160ms ease",
                    }}
                  >
                    <Icon size={17} strokeWidth={active ? 2.6 : 2} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: 12,
            borderRadius: 14,
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 800,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <BookOpen size={16} />
            View Site
          </span>
          <ExternalLink size={15} />
        </a>
      </nav>

      <div
        style={{ padding: 12, borderTop: "1px solid rgba(203, 213, 225, 0.7)" }}
      >
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 42,
            width: "100%",
            borderRadius: 12,
            border: "1px solid hsl(var(--destructive) / 0.16)",
            background: "hsl(var(--destructive) / 0.08)",
            fontSize: 13,
            fontWeight: 800,
            color: "hsl(var(--destructive))",
            cursor: "pointer",
            padding: "10px 12px",
          }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
