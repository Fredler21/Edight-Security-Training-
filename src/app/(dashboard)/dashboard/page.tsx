"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Flame,
  Bell,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import ModuleCard from "@/components/ModuleCard";
import ProgressBar from "@/components/ProgressBar";
import { modules } from "@/data/modules";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const { user } = useAuth();
  const { getModuleProgress, loading } = useProgress(user?.uid);
  const [profile, setProfile] = useState<{ jobTitle: string; department: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({ jobTitle: d.jobTitle ?? "", department: d.department ?? "" });
      }
    });
  }, [user]);

  const completedCount = modules.filter(
    (m) => getModuleProgress(m.id).status === "completed"
  ).length;
  const inProgressCount = modules.filter(
    (m) => getModuleProgress(m.id).status === "in_progress"
  ).length;
  const overallPercent = Math.round((completedCount / modules.length) * 100);
  const remainingCount = modules.length - completedCount;

  const nextModule = modules.find(
    (m) => getModuleProgress(m.id).status !== "completed"
  );

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-sm text-slate-500 mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold text-slate-900">{user?.displayName ?? "—"}</h1>
          {(profile?.jobTitle || profile?.department) && (
            <p className="text-sm text-teal-600 mt-0.5">
              {[profile.jobTitle, profile.department].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Bell className="h-4 w-4 text-slate-400" />
          <span>
            {remainingCount > 0
              ? `${remainingCount} module${remainingCount !== 1 ? "s" : ""} remaining`
              : "All modules complete!"}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Overall Progress",
            value: loading ? "—" : `${overallPercent}%`,
            icon: TrendingUp,
            sub: `${completedCount} of ${modules.length} modules done`,
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            label: "Completed",
            value: loading ? "—" : `${completedCount}`,
            icon: CheckCircle2,
            sub: "modules finished",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "In Progress",
            value: loading ? "—" : `${inProgressCount}`,
            icon: BookOpen,
            sub: "currently active",
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Remaining",
            value: loading ? "—" : `${remainingCount}`,
            icon: Clock,
            sub: "modules to complete",
            color: "text-slate-600",
            bg: "bg-slate-50",
          },
        ].map(({ label, value, icon: Icon, sub, color, bg }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">Training Completion</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {completedCount} of {modules.length} modules completed
            </p>
          </div>
          <span className="text-2xl font-bold text-teal-600">{overallPercent}%</span>
        </div>
        <ProgressBar value={overallPercent} size="lg" />
        <div className="mt-5 grid grid-cols-5 gap-2">
          {modules.map((m) => {
            const s = getModuleProgress(m.id).status;
            return (
              <div
                key={m.id}
                className={`h-2 rounded-full transition-all ${
                  s === "completed"
                    ? "bg-teal-500"
                    : s === "in_progress"
                    ? "bg-amber-400"
                    : "bg-slate-100"
                }`}
                title={m.title}
              />
            );
          })}
        </div>
      </div>

      {/* Continue Learning */}
      {nextModule && !loading && (
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 mb-10 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-teal-200" />
                <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">
                  Continue Learning
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1">
                {nextModule.title}
              </h2>
              <p className="text-sm text-teal-100 leading-relaxed max-w-lg">
                {nextModule.description}
              </p>
              <p className="text-xs text-teal-200 mt-2">
                ≈ {nextModule.estimatedMinutes} minutes to complete
              </p>
            </div>
            <Link
              href={`/modules/${nextModule.slug}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors shadow-sm"
            >
              {getModuleProgress(nextModule.id).status === "in_progress"
                ? "Continue Module"
                : "Start Module"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Greeting when all complete */}
      {completedCount === modules.length && !loading && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-10 flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-teal-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-teal-900">
              All modules complete, {firstName}! 🎉
            </p>
            <p className="text-sm text-teal-700 mt-0.5">
              You&apos;ve finished your security training. Check your progress page for details.
            </p>
          </div>
        </div>
      )}

      {/* All modules */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">All Modules</h2>
          <Link
            href="/modules"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const p = getModuleProgress(mod.id);
            return (
              <ModuleCard
                key={mod.id}
                module={mod}
                status={p.status}
                progress={p.progress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
