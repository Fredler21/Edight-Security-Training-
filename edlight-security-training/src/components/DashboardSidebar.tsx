"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
          <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
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
