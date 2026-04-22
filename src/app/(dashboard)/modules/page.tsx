"use client";

import { Search, Filter, Clock, CheckCircle2, Lock } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/modules";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";

const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);

export default function ModulesPage() {
  const { user } = useAuth();
  const { getModuleProgress, loading } = useProgress(user?.uid);

  const completedCount = modules.filter(
    (m) => getModuleProgress(m.id).status === "completed"
  ).length;

  function isLocked(order: number) {
    if (order === 1) return false;
    const prev = modules.find((m) => m.order === order - 1);
    if (!prev) return false;
    return getModuleProgress(prev.id).status !== "completed";
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Training Curriculum
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Training Modules</h1>
        <p className="text-slate-500">
          Complete all modules to finish your security certification.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: CheckCircle2, label: "Completed", value: loading ? "—" : `${completedCount} / ${modules.length}`, color: "text-teal-600", bg: "bg-teal-50" },
          { icon: Clock, label: "Total Time", value: `${totalMinutes} min`, color: "text-slate-600", bg: "bg-slate-50" },
          { icon: Filter, label: "Remaining", value: loading ? "—" : `${modules.length - completedCount}`, color: "text-amber-600", bg: "bg-amber-50" },
          { icon: Search, label: "Topics", value: `${modules.length}`, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
            <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sequential notice */}
      <div className="flex items-center gap-2.5 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 mb-8">
        <div className="h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0" />
        <p className="text-sm text-teal-700">
          <strong>Modules are sequential.</strong> You must complete each module before unlocking the next one.
        </p>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((mod) => {
          const locked = !loading && isLocked(mod.order);
          const prog = getModuleProgress(mod.id);
          return (
            <div key={mod.id} className="relative">
              <ModuleCard
                module={mod}
                status={prog.status}
                progress={prog.progress}
              />
              {locked && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-200">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    Complete Module {mod.order - 1} first
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-teal-500" /><span>Completed</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-amber-400" /><span>In Progress</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-slate-200" /><span>Not Started</span></div>
        <div className="flex items-center gap-2"><Lock className="h-3 w-3 text-slate-400" /><span>Locked</span></div>
      </div>
    </div>
  );
}
