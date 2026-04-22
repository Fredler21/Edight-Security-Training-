"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart2,
  ChevronRight,
  Circle,
  Loader2,
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { modules } from "@/data/modules";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";

export default function ProgressPage() {
  const { user } = useAuth();
  const { getModuleProgress, loading } = useProgress(user?.uid);

  const completedModules = modules.filter(
    (m) => getModuleProgress(m.id).status === "completed"
  );
  const inProgressModules = modules.filter(
    (m) => getModuleProgress(m.id).status === "in_progress"
  );
  const remainingModules = modules.filter(
    (m) => getModuleProgress(m.id).status === "not_started"
  );

  const overallPercent = Math.round((completedModules.length / modules.length) * 100);
  const avgScore =
    completedModules.length > 0
      ? Math.round(
          completedModules.reduce(
            (sum, m) => sum + (getModuleProgress(m.id).score ?? 0),
            0
          ) / completedModules.length
        )
      : null;

  const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);
  const minutesDone = completedModules.reduce((sum, m) => sum + m.estimatedMinutes, 0);

  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Progress Report
        </p>
        <h1 className="text-2xl font-bold text-slate-900">My Training Progress</h1>
        <p className="text-slate-500 mt-1">Track your completion and quiz performance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: "Overall Progress", value: loading ? "—" : `${overallPercent}%`, color: "text-teal-600", bg: "bg-teal-50" },
          { icon: CheckCircle2, label: "Modules Done", value: loading ? "—" : `${completedModules.length} / ${modules.length}`, color: "text-green-600", bg: "bg-green-50" },
          { icon: BarChart2, label: "Avg. Quiz Score", value: loading ? "—" : avgScore !== null ? `${avgScore}%` : "—", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Clock, label: "Time Completed", value: loading ? "—" : `${minutesDone} min`, color: "text-slate-600", bg: "bg-slate-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Completion Overview</h2>
          <span className="text-lg font-bold text-teal-600">{overallPercent}%</span>
        </div>
        <ProgressBar value={overallPercent} size="lg" />
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>{minutesDone} min completed</span>
          <span>{totalMinutes - minutesDone} min remaining</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-900">Module Breakdown</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {modules.map((mod) => {
            const prog = getModuleProgress(mod.id);
            return (
              <div key={mod.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                  {prog.status === "completed" ? (
                    <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    </div>
                  ) : prog.status === "in_progress" ? (
                    <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-amber-600" />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                      <Circle className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-semibold text-slate-900">{mod.title}</p>
                    <StatusBadge variant={prog.status} />
                  </div>
                  {prog.status === "in_progress" && <ProgressBar value={prog.progress} size="sm" />}
                  {prog.status === "completed" && prog.completedAt && (
                    <p className="text-xs text-slate-400">Completed {new Date(prog.completedAt).toLocaleDateString()}</p>
                  )}
                  {prog.status === "not_started" && (
                    <p className="text-xs text-slate-400">{mod.estimatedMinutes} min</p>
                  )}
                </div>
                <div className="flex-shrink-0 flex items-center gap-4">
                  {prog.score !== null ? (
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Quiz Score</p>
                      <p className={`text-sm font-bold ${prog.score >= 75 ? "text-teal-600" : "text-amber-600"}`}>{prog.score}%</p>
                    </div>
                  ) : prog.status !== "completed" ? (
                    <Link href={`/modules/${mod.slug}`} className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                      {prog.status === "in_progress" ? "Continue" : "Start"}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!loading && completedModules.length === modules.length ? (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-teal-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-teal-900 mb-1">All modules completed!</h3>
          <p className="text-sm text-teal-700">You have finished the EdLight Security Training program. Great job.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-slate-900 mb-1">
              {remainingModules.length + inProgressModules.length} module{remainingModules.length + inProgressModules.length !== 1 ? "s" : ""} left to complete
            </p>
            <p className="text-sm text-slate-500">Keep going — you&apos;re {overallPercent}% through the program.</p>
          </div>
          <Link href="/modules" className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors">
            Continue Training <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
