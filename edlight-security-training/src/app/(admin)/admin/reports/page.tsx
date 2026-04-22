"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Search,
  FileText,
  Filter,
} from "lucide-react";
import {
  getAllUsers,
  getAllProgressRecords,
  getAllModuleCompletions,
  AdminUser,
} from "@/lib/firestore";
import { modules } from "@/data/modules";
import type { EmployeeTrainingProgress, ModuleCompletion } from "@/types";
import StatusBadge from "@/components/StatusBadge";

type StatusFilter = "all" | "completed" | "in_progress" | "not_started";

function exportCSV(
  users: AdminUser[],
  progressMap: Record<string, EmployeeTrainingProgress>,
  completionMap: Record<string, Record<string, ModuleCompletion>>
) {
  const headers = [
    "Name",
    "Email",
    "Department",
    "Job Title",
    "Status",
    "Overall Progress (%)",
    "Completed Modules",
    "Total Modules",
    "Last Activity",
    ...modules.map((m) => `${m.title} - Score`),
  ];

  const rows = users.map((u) => {
    const prog = progressMap[u.id];
    const userCompletions = completionMap[u.id] ?? {};
    return [
      u.name,
      u.email,
      u.department || "",
      u.jobTitle || "",
      prog?.status ?? "not_started",
      prog?.overallProgress ?? 0,
      prog?.completedModulesCount ?? 0,
      modules.length,
      prog?.lastActivityAt
        ? new Date(prog.lastActivityAt).toLocaleDateString()
        : "",
      ...modules.map((m) => {
        const c = userCompletions[m.id];
        return c?.score != null ? c.score : "";
      }),
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `edlight-training-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [progressRecords, setProgressRecords] = useState<EmployeeTrainingProgress[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deptFilter, setDeptFilter] = useState("all");

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

  // completionMap[userId][moduleId] = ModuleCompletion
  const completionMap = useMemo(() => {
    const map: Record<string, Record<string, ModuleCompletion>> = {};
    for (const c of completions) {
      if (!map[c.userId]) map[c.userId] = {};
      map[c.userId][c.moduleId] = c;
    }
    return map;
  }, [completions]);

  const departments = useMemo(() => {
    const depts = new Set(users.map((u) => u.department).filter(Boolean));
    return ["all", ...Array.from(depts).sort()];
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const prog = progressMap[u.id];
      const status = prog?.status ?? "not_started";
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesDept =
        deptFilter === "all" || u.department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [users, search, statusFilter, deptFilter, progressMap]);

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "In Progress", value: "in_progress" },
    { label: "Not Started", value: "not_started" },
  ];

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
            Admin · Reports
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Training Reports</h1>
          <p className="text-slate-500">
            Export employee training data as a CSV file for compliance and auditing.
          </p>
        </div>
        <button
          onClick={() => exportCSV(filtered, progressMap, completionMap)}
          disabled={loading || filtered.length === 0}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-slate-400"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                statusFilter === value
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Department filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none text-slate-700"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Departments" : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary row */}
      {!loading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
          <FileText className="h-4 w-4" />
          <span>
            Showing <strong className="text-slate-700">{filtered.length}</strong> of{" "}
            <strong className="text-slate-700">{users.length}</strong> employees
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Progress
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Modules Done
                </th>
                {modules.map((m) => (
                  <th
                    key={m.id}
                    className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    M{m.order}
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6 + modules.length}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6 + modules.length}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No employees match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const prog = progressMap[u.id];
                  const userCompletions = completionMap[u.id] ?? {};
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900 whitespace-nowrap">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {u.department || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={prog?.status ?? "not_started"} />
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {prog?.overallProgress ?? 0}%
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {prog?.completedModulesCount ?? 0}/{modules.length}
                      </td>
                      {modules.map((m) => {
                        const c = userCompletions[m.id];
                        return (
                          <td key={m.id} className="px-3 py-3 text-right">
                            {c?.score != null ? (
                              <span
                                className={`text-xs font-bold ${
                                  c.score >= 75
                                    ? "text-teal-600"
                                    : "text-amber-600"
                                }`}
                              >
                                {c.score}%
                              </span>
                            ) : c?.completed ? (
                              <span className="text-xs text-slate-400">✓</span>
                            ) : (
                              <span className="text-xs text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-5 py-3 text-right text-xs text-slate-400 whitespace-nowrap">
                        {prog?.lastActivityAt
                          ? new Date(prog.lastActivityAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export note */}
      <p className="mt-4 text-xs text-slate-400">
        The exported CSV includes all filtered rows, per-module quiz scores, and progress
        data. Use it for compliance reporting or HR audits.
      </p>
    </div>
  );
}
