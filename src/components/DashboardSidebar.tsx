"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Bell,
  FileText,
  PieChart,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import { db } from "@/lib/firebase";

const employeeNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Modules", href: "/modules", icon: BookOpen },
  { label: "My Progress", href: "/progress", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Admin Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
  { label: "Employees", href: "/admin/employees", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: PieChart },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Reminders", href: "/admin/reminders", icon: Bell },
  { label: "Assignments", href: "/admin/assignments", icon: ClipboardList },
];

// Dashboard palette — emerald + indigo (distinct from landing's blue)
const emerald = "#10b981";
const emeraldDeep = "#047857";
const emeraldLight = "#34d399";
const indigo = "#6366f1";

type IconType = React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<{ jobTitle: string; department: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({
          jobTitle: d.jobTitle ?? "",
          department: d.department ?? "",
        });
      }
    });
  }, [user]);

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  const bg = "#0a0f1c";
  const border = "rgba(255,255,255,0.06)";
  const text = "#f1f5f9";
  const textMuted = "rgba(255,255,255,0.45)";

  const renderNavItem = (label: string, href: string, Icon: IconType, active: boolean) => (
    <Link
      key={href}
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "10px",
        fontSize: "13.5px",
        fontWeight: 600,
        letterSpacing: "-0.005em",
        color: active ? emeraldLight : textMuted,
        background: active ? `linear-gradient(90deg, ${emerald}22, transparent)` : "transparent",
        borderLeft: active ? `2px solid ${emerald}` : "2px solid transparent",
        textDecoration: "none",
        transition: "all 0.18s ease",
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.color = textMuted;
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      <Icon size={17} style={{ color: active ? emerald : "currentColor", flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {active && <ChevronRight size={14} style={{ color: emerald }} />}
    </Link>
  );

  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        width: "256px",
        minHeight: "100vh",
        background: bg,
        borderRight: `1px solid ${border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes side-pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.25); opacity: 0; } }
      `}</style>

      <div aria-hidden style={{ position: "absolute", top: "-60px", left: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${emerald}33, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "64px", padding: "0 20px", borderBottom: `1px solid ${border}`, position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", width: "32px", height: "32px" }}>
          <Image src="/edlight-logo-white.png" alt="EdLight" width={32} height={32} style={{ opacity: 0.95 }} />
          <span aria-hidden style={{ position: "absolute", inset: "-4px", borderRadius: "50%", border: `1px solid ${emerald}55`, animation: "side-pulse 3s ease-in-out infinite", pointerEvents: "none" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: text }}>EdLight</span>
          <span style={{ fontSize: "12px", fontWeight: 700, backgroundImage: `linear-gradient(135deg, ${emeraldDeep}, ${emeraldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Security</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: "2px", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px 8px", margin: 0 }}>Workspace</p>
        {employeeNavItems.map(({ label, href, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return renderNavItem(label, href, icon as IconType, active);
        })}

        {(role === "admin" || role === "super_admin") && (
          <>
            <p style={{ fontSize: "10px", fontWeight: 700, color: indigo, letterSpacing: "0.14em", textTransform: "uppercase", padding: "16px 12px 8px", margin: 0 }}>Admin</p>
            {adminNavItems.map(({ label, href, icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return renderNavItem(label, href, icon as IconType, active);
            })}
          </>
        )}
      </nav>

      {/* User area */}
      <div style={{ padding: "14px 12px", borderTop: `1px solid ${border}`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.025)", border: `1px solid ${border}` }}>
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt={user.displayName ?? "User"} referrerPolicy="no-referrer" style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${emerald}66` }} />
          ) : (
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700, flexShrink: 0, backgroundImage: `linear-gradient(135deg, ${emeraldDeep}, ${emerald})`, boxShadow: `0 4px 12px ${emerald}44` }}>
              {initials}
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.displayName ?? "\u2014"}</p>
            {profile?.jobTitle || profile?.department ? (
              <p style={{ fontSize: "11px", color: emeraldLight, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{[profile?.jobTitle, profile?.department].filter(Boolean).join(" \u00b7 ")}</p>
            ) : (
              <p style={{ fontSize: "11px", color: textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email ?? ""}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ marginTop: "8px", width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", background: "transparent", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: textMuted, transition: "all 0.18s" }}
          onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseOut={(e) => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Bell,
  FileText,
  PieChart,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/AuthContext";import { signOut } from "@/lib/auth";
import { db } from "@/lib/firebase";

const employeeNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Modules", href: "/modules", icon: BookOpen },
  { label: "My Progress", href: "/progress", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Admin Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
  { label: "Employees", href: "/admin/employees", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: PieChart },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Reminders", href: "/admin/reminders", icon: Bell },
  { label: "Assignments", href: "/admin/assignments", icon: ClipboardList },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<{ jobTitle: string; department: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({
          jobTitle: d.jobTitle ?? "",
          department: d.department ?? "",
        });
      }
    });
  }, [user]);

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-6 border-b border-slate-800">
        <Image
          src="/edlight-logo-white.png"
          alt="EdLight logo"
          width={32}
          height={32}
          className="rounded-lg opacity-90"
        />
        <span className="text-[15px] font-semibold text-white tracking-tight">
          EdLight<span className="text-teal-400"> Security</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {employeeNavItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-teal-600/15 text-teal-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 flex-shrink-0",
                  active ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              <span>{label}</span>
              {active && (
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-teal-500" />
              )}
            </Link>
          );
        })}

        {/* Admin section */}
        {(role === "admin" || role === "super_admin") && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                Admin
              </p>
            </div>
            {adminNavItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    active
                      ? "bg-teal-600/15 text-teal-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 flex-shrink-0",
                      active ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{label}</span>
                  {active && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-teal-500" />
                  )}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User area */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName ?? "—"}
            </p>
            {profile?.jobTitle || profile?.department ? (
              <p className="text-xs text-teal-400 truncate">
                {[profile.jobTitle, profile.department].filter(Boolean).join(" · ")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 truncate">{user?.email ?? ""}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
