"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  Building2,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import {
  getAllUsers,
  getAllProgressRecords,
  getAllModuleCompletions,
  AdminUser,
} from "@/lib/firestore";
import { modules } from "@/data/modules";
import type {
  EmployeeTrainingProgress,
  ModuleCompletion,
  DepartmentStat,
} from "@/types";
import ProgressBar from "@/components/ProgressBar";

// ─── Bar chart component ───────────────────────────────────────────────────────

function BarSegment({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-slate-500 text-right truncate">{label}</span>
      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs font-semibold text-slate-700 text-right">{value}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [progressRecords, setProgressRecords] = useState<EmployeeTrainingProgress[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllUsers(),
      getAllProgressRecords(),
      getAllModuleCompletions(),
    ]).then(([u, p, c]) => {
      setUsers(u);
      setProgressRecords(p);
      setCompletions(c);
      setLoading(false);
    });
  }, []);

  const progressMap = useMemo(
    () => Object.fromEntries(progressRecords.map((p) => [p.userId, p])),
    [progressRecords]
  );

  // ─── Department stats ────────────────────────────────────────────────────────
  const departmentStats = useMemo((): DepartmentStat[] => {
    const map: Record<string, { users: AdminUser[] }> = {};
    for (const u of users) {
      const dept = u.department || "Unassigned";
      if (!map[dept]) map[dept] = { users: [] };
      map[dept].users.push(u);
    }
    return Object.entries(map)
      .map(([department, { users: dUsers }]) => {
        const total = dUsers.length;
        const completed = dUsers.filter(
          (u) => progressMap[u.id]?.status === "completed"
        ).length;
        const inProgress = dUsers.filter(
          (u) => progressMap[u.id]?.status === "in_progress"
        ).length;
        const notStarted = dUsers.filter(
          (u) => !progressMap[u.id] || progressMap[u.id].status === "not_started"
        ).length;
        const avgProgress =
          total > 0
            ? Math.round(
                dUsers.reduce(
                  (acc, u) => acc + (progressMap[u.id]?.overallProgress ?? 0),
                  0
                ) / total
              )
            : 0;
        return {
          department,
          totalUsers: total,
          completedUsers: completed,
          inProgressUsers: inProgress,
          notStartedUsers: notStarted,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
          avgProgress,
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);
  }, [users, progressMap]);

  // ─── Module stats ────────────────────────────────────────────────────────────
  const moduleStats = useMemo(() => {
    return modules.map((mod) => {
      const modCompletions = completions.filter(
        (c) => c.moduleId === mod.id && c.completed
      );
      const completedCount = modCompletions.length;
      const totalUsers = users.length;
      const scores = modCompletions
        .map((c) => c.score ?? 0)
        .filter((s) => s > 0);
      const avgScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;
      const attempts = modCompletions.reduce((acc, c) => acc + (c.attempts ?? 1), 0);
      return {
        mod,
        completedCount,
        completionRate: totalUsers > 0 ? Math.round((completedCount / totalUsers) * 100) : 0,
        avgScore,
        attempts,
      };
    });
  }, [completions, users]);

  // ─── Score distribution ──────────────────────────────────────────────────────
  const scoreDistribution = useMemo(() => {
    const allScores = completions
      .filter((c) => c.score != null && c.score > 0)
      .map((c) => c.score as number);
    const buckets = [
      { label: "90–100%", min: 90, max: 100, count: 0, color: "bg-teal-500" },
      { label: "75–89%", min: 75, max: 89, count: 0, color: "bg-blue-500" },
      { label: "50–74%", min: 50, max: 74, count: 0, color: "bg-amber-400" },
      { label: "< 50%", min: 0, max: 49, count: 0, color: "bg-red-400" },
    ];
    for (const score of allScores) {
      for (const bucket of buckets) {
        if (score >= bucket.min && score <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    }
    return buckets;
  }, [completions]);

  const maxScoreBucket = Math.max(...scoreDistribution.map((b) => b.count), 1);

  // ─── Summary stats ───────────────────────────────────────────────────────────
  const totalUsers = users.length;
  const overallCompletion =
    totalUsers > 0
      ? Math.round(
          progressRecords.reduce((acc, p) => acc + (p.overallProgress ?? 0), 0) /
            totalUsers
        )
      : 0;
  const avgScore = useMemo(() => {
    const scores = completions
      .filter((c) => c.score != null && c.score > 0)
      .map((c) => c.score as number);
    return scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
  }, [completions]);
  const completedAll = progressRecords.filter((p) => p.status === "completed").length;

  const summaryCards = [
    {
      label: "Avg. Progress",
      value: loading ? "—" : `${overallCompletion}%`,
      icon: TrendingUp,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Employees Done",
      value: loading ? "—" : completedAll,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Employees",
      value: loading ? "—" : totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Quiz Score",
      value: loading ? "—" : avgScore != null ? `${avgScore}%` : "N/A",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Admin · Analytics
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Advanced Analytics</h1>
        <p className="text-slate-500">
          Department-level insights, module performance, and score distribution.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-5 shadow-sm"
          >
            <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <h2 className="text-[15px] font-semibold text-slate-900">
              Completion by Department
            </h2>
          </div>
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">Loading…</div>
          ) : departmentStats.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">
              No department data yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {departmentStats.map((dept) => (
                <div key={dept.department} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {dept.department}
                      </p>
                      <p className="text-xs text-slate-400">
                        {dept.totalUsers} employee{dept.totalUsers !== 1 ? "s" : ""} ·{" "}
                        {dept.completedUsers} completed
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        dept.completionRate >= 75
                          ? "text-teal-600"
                          : dept.completionRate >= 40
                          ? "text-amber-600"
                          : "text-red-500"
                      }`}
                    >
                      {dept.completionRate}%
                    </span>
                  </div>
                  <ProgressBar value={dept.completionRate} size="sm" />
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] text-teal-600 font-medium">
                      ✓ {dept.completedUsers} done
                    </span>
                    <span className="text-[10px] text-amber-600 font-medium">
                      ◷ {dept.inProgressUsers} in progress
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ○ {dept.notStartedUsers} not started
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Module Performance */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-slate-500" />
            <h2 className="text-[15px] font-semibold text-slate-900">Module Performance</h2>
          </div>
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">Loading…</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {moduleStats.map(({ mod, completedCount, completionRate, avgScore, attempts }) => (
                <div key={mod.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {mod.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {completedCount}/{totalUsers} completed ·{" "}
                        {attempts} attempt{attempts !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-700">{completionRate}%</p>
                      {avgScore != null && (
                        <p
                          className={`text-xs font-semibold ${
                            avgScore >= 75 ? "text-teal-600" : "text-amber-600"
                          }`}
                        >
                          avg {avgScore}%
                        </p>
                      )}
                    </div>
                  </div>
                  <ProgressBar value={completionRate} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-4 w-4 text-slate-500" />
          <h2 className="text-[15px] font-semibold text-slate-900">Quiz Score Distribution</h2>
        </div>
        {loading ? (
          <div className="py-6 text-center text-sm text-slate-400">Loading…</div>
        ) : (
          <div className="space-y-3">
            {scoreDistribution.map((bucket) => (
              <BarSegment
                key={bucket.label}
                label={bucket.label}
                value={bucket.count}
                max={maxScoreBucket}
                color={bucket.color}
              />
            ))}
          </div>
        )}
        {!loading && (
          <p className="text-xs text-slate-400 mt-4">
            Based on {completions.filter((c) => c.score != null && c.score > 0).length} quiz
            submissions across all modules.
          </p>
        )}
      </div>

      {/* Department avg progress table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-900">
            Department Summary Table
          </h2>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    In Progress
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Not Started
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Completion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentStats.map((dept) => (
                  <tr key={dept.department} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {dept.department}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {dept.totalUsers}
                    </td>
                    <td className="px-4 py-3 text-right text-teal-600 font-semibold">
                      {dept.completedUsers}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-semibold">
                      {dept.inProgressUsers}
                    </td>
                    <td className="px-4 py-3 text-right text-red-500 font-semibold">
                      {dept.notStartedUsers}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          dept.completionRate >= 75
                            ? "bg-teal-100 text-teal-700"
                            : dept.completionRate >= 40
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {dept.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
