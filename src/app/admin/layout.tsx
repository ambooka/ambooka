"use client";

// @ts-ignore: allow side-effect CSS import for admin theme
import "./admin-theme.css";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

// CoachPro Design Tokens
const SIDEBAR_WIDTH = 232;
const CONTENT_PADDING = 28;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "Admin" });

  const isLoginPage = pathname === "/admin/login";
  const localModeEnabled = !isSupabaseConfigured;
  const pageTitle = (() => {
    const segment = pathname.split("/").filter(Boolean)[1];
    if (!segment) return "Dashboard";
    return segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  })();

  useEffect(() => {
    if (localModeEnabled) {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      } else if (session && isLoginPage) {
        router.push("/admin");
      }
      setAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    // Fetch user info
    supabase
      .from("personal_info")
      .select("full_name")
      .single()
      .then(({ data }) => {
        if (data) setUserInfo({ name: data.full_name });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage, router, localModeEnabled]);

  if (loading) {
    return (
      <div
        id="admin-portal"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 52%, hsl(var(--muted)) 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid hsl(var(--accent))",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "ad-spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div
        id="admin-portal"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 52%, hsl(var(--muted)) 100%)",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div
      id="admin-portal"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 52%, hsl(var(--muted)) 100%)",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Sidebar - Fixed */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          zIndex: 50,
        }}
      >
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          flex: 1,
          minHeight: "100vh",
          padding: CONTENT_PADDING,
          color: "var(--ad-text-primary)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            padding: "14px 16px",
            border: "1px solid var(--ad-border-subtle)",
            borderRadius: 20,
            background: "var(--ad-bg-card)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "hsl(var(--accent))",
              }}
            >
              Portfolio CMS
            </p>
            <h1
              style={{
                marginTop: 2,
                fontSize: 22,
                fontWeight: 850,
                letterSpacing: "-0.03em",
                color: "hsl(var(--foreground))",
              }}
            >
              {pageTitle}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 12,
                background: "var(--ad-text-primary)",
                color: "var(--ad-bg-card)",
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Public Site <ExternalLink size={15} />
            </a>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "hsl(var(--accent))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {userInfo.name.charAt(0)}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ad-text-primary)",
              }}
            >
              {userInfo.name}
            </span>
          </div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
