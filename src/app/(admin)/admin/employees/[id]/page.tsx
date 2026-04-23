"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Mail,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Activity,
  BookOpen,
  LogIn,
  HelpCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import {
  getUserById,
  getCompletionsForUser,
  getUserProgress,
  getAuditLogs,
  resetModuleCompletion,
  resetAllUserProgress,
  AdminUser,
} from "@/lib/firestore";
import { modules } from "@/data/modules";
import type { ModuleCompletion, EmployeeTrainingProgress, AuditLog } from "@/types";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user: adminUser } = useAuth();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [completions, setCompletions] = useState<Record<string, ModuleCompletion>>({});
  const [progress, setProgress] = useState<EmployeeTrainingProgress | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resettingModuleId, setResettingModuleId] = useState<string | null>(null);
  const [resettingAll, setResettingAll] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    (async () => {
      // Critical: user profile. If this fails, surface the error.
      try {
        const u = await getUserById(id);
        if (cancelled) return;
        setUser(u);
      } catch (err) {
        console.error("Failed to load employee", err);
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : "Could not load this employee."
          );
        }
      }

      // Optional sections: failures shouldn't block the page.
      const [c, p, logs] = await Promise.all([
        getCompletionsForUser(id).catch((err) => {
          console.error("Failed to load completions", err);
          return {} as Record<string, ModuleCompletion>;
        }),
        getUserProgress(id).catch((err) => {
          console.error("Failed to load progress", err);
          return null;
        }),
        getAuditLogs(id).catch((err) => {
          console.error("Failed to load audit logs", err);
          return [] as AuditLog[];
        }),
      ]);

      if (cancelled) return;
      setCompletions(c);
      setProgress(p);
      setAuditLogs(logs);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function refreshProgressData() {
    if (!id) return;
    const [c, p, logs] = await Promise.all([
      getCompletionsForUser(id).catch(() => ({} as Record<string, ModuleCompletion>)),
      getUserProgress(id).catch(() => null),
      getAuditLogs(id).catch(() => [] as AuditLog[]),
    ]);
    setCompletions(c);
    setProgress(p);
    setAuditLogs(logs);
  }

  async function handleResetModule(moduleId: string, moduleTitle: string) {
    if (!id) return;
    if (!confirm(`Reset progress for "${moduleTitle}"? The employee will need to retake the quiz.`)) {
      return;
    }
    setResettingModuleId(moduleId);
    setResetError(null);
    try {
      await resetModuleCompletion(id, moduleId, modules.length, adminUser?.uid, moduleTitle);
      await refreshProgressData();
    } catch (err) {
      console.error("Failed to reset module", err);
      setResetError(
        err instanceof Error ? err.message : "Could not reset this module."
      );
    } finally {
      setResettingModuleId(null);
    }
  }

  async function handleResetAll() {
    if (!id) return;
    setResettingAll(true);
    setResetError(null);
    try {
      await resetAllUserProgress(id, modules.length, adminUser?.uid);
      await refreshProgressData();
      setConfirmResetAll(false);
    } catch (err) {
      console.error("Failed to reset all progress", err);
      setResetError(
        err instanceof Error ? err.message : "Could not reset progress."
      );
    } finally {
      setResettingAll(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (loadError && !user) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
        <p className="text-rose-600 text-sm font-medium mb-2">Could not load employee</p>
        <p className="text-slate-500 text-sm mb-4">{loadError}</p>
        <Link href="/admin/employees" className="text-sm text-teal-600 hover:underline">
          ← Back to employees
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
        <p className="text-slate-500">Employee not found.</p>
        <Link href="/admin/employees" className="text-sm text-teal-600 hover:underline mt-2 block">
          ← Back to employees
        </Link>
      </div>
    );
  }

  const overallPercent = progress?.overallProgress ?? 0;
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/employees"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Employees
      </Link>

      {/* Profile card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 flex items-start gap-5">
        {user.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profileImage}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover flex-shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <StatusBadge variant={progress?.status ?? "not_started"} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </span>
            {user.jobTitle && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> {user.jobTitle}
              </span>
            )}
            {user.department && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> {user.department}
              </span>
            )}
            {user.lastLoginAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
              </span>
            )}
            {user.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-bold text-teal-600">{overallPercent}%</p>
          <p className="text-xs text-slate-400 mt-0.5">Overall progress</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-[15px] font-semibold text-slate-900">Training Progress</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {progress?.completedModulesCount ?? 0} / {modules.length} modules
            </span>
            {!confirmResetAll ? (
              <button
                type="button"
                onClick={() => setConfirmResetAll(true)}
                disabled={resettingAll || (progress?.completedModulesCount ?? 0) === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset All Progress
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-medium">Confirm reset?</span>
                <button
                  type="button"
                  onClick={handleResetAll}
                  disabled={resettingAll}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                >
                  {resettingAll ? "Resetting…" : "Yes, reset all"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetAll(false)}
                  disabled={resettingAll}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        {resetError && (
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            {resetError}
          </div>
        )}
        <ProgressBar value={overallPercent} size="lg" />
      </div>

      {/* Module breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-900">Module Breakdown</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {modules.map((mod) => {
            const completion = completions[mod.id];
            const completed = completion?.completed ?? false;

            return (
              <div key={mod.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                  {completed ? (
                    <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                      <Circle className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{mod.title}</p>
                  {completed && completion?.completedAt && (
                    <p className="text-xs text-slate-400">
                      Completed{" "}
                      {typeof completion.completedAt === "object" &&
                      "toDate" in completion.completedAt
                        ? (completion.completedAt as unknown as { toDate: () => Date })
                            .toDate()
                            .toLocaleDateString()
                        : new Date(completion.completedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!completed && (
                    <p className="text-xs text-slate-400">{mod.estimatedMinutes} min</p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right flex items-center gap-3">
                  <div>
                    {completion?.score != null ? (
                      <>
                        <p className="text-xs text-slate-400">Quiz Score</p>
                        <p
                          className={`text-sm font-bold ${
                            completion.score >= 75 ? "text-teal-600" : "text-amber-600"
                          }`}
                        >
                          {completion.score}%
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {completed ? "No score" : "Not started"}
                      </span>
                    )}
                  </div>
                  {(completed || completion) && (
                    <button
                      type="button"
                      onClick={() => handleResetModule(mod.id, mod.title)}
                      disabled={resettingModuleId === mod.id}
                      title="Reset this module's score"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resettingModuleId === mod.id ? (
                        <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit History */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-500" />
          <h2 className="text-[15px] font-semibold text-slate-900">Activity Log</h2>
        </div>
        {auditLogs.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-400">
            No activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => {
              const Icon =
                log.action === "module_completed"
                  ? CheckCircle2
                  : log.action === "module_started"
                  ? BookOpen
                  : log.action === "quiz_attempted"
                  ? HelpCircle
                  : log.action === "login"
                  ? LogIn
                  : Activity;
              const iconColor =
                log.action === "module_completed"
                  ? "text-teal-600 bg-teal-100"
                  : log.action === "module_started"
                  ? "text-blue-600 bg-blue-100"
                  : log.action === "quiz_attempted"
                  ? "text-purple-600 bg-purple-100"
                  : log.action === "login"
                  ? "text-slate-500 bg-slate-100"
                  : "text-amber-600 bg-amber-100";
              const actionLabel =
                log.action === "module_completed"
                  ? "Completed"
                  : log.action === "module_started"
                  ? "Started"
                  : log.action === "quiz_attempted"
                  ? "Quiz attempt"
                  : log.action === "login"
                  ? "Logged in"
                  : log.action === "reminder_sent"
                  ? "Reminder sent"
                  : log.action;

              return (
                <div key={log.id} className="flex items-start gap-3 px-6 py-3.5">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{actionLabel}</span>
                      {log.moduleTitle && (
                        <span className="text-slate-500"> · {log.moduleTitle}</span>
                      )}
                    </p>
                    {log.score != null && (
                      <p
                        className={`text-xs font-semibold mt-0.5 ${
                          log.score >= 75 ? "text-teal-600" : "text-amber-600"
                        }`}
                      >
                        Score: {log.score}%
                      </p>
                    )}
                    {log.details && (
                      <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString()}{" "}
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
