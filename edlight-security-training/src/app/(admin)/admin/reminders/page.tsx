"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  ChevronRight,
  Save,
  ToggleLeft,
  ToggleRight,
  Clock,
} from "lucide-react";
import {
  getAllUsers,
  getAllProgressRecords,
  getReminderConfig,
  saveReminderConfig,
  AdminUser,
} from "@/lib/firestore";
import type { EmployeeTrainingProgress, ReminderConfig } from "@/types";
import StatusBadge from "@/components/StatusBadge";

export default function RemindersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [progressRecords, setProgressRecords] = useState<EmployeeTrainingProgress[]>([]);
  const [config, setConfig] = useState<ReminderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [enabled, setEnabled] = useState(false);
  const [frequencyDays, setFrequencyDays] = useState(7);
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState(
    "This is a reminder to complete your required cybersecurity training. Please log in and finish all modules as soon as possible."
  );

  useEffect(() => {
    Promise.all([
      getAllUsers(),
      getAllProgressRecords(),
      getReminderConfig(),
    ]).then(([u, p, cfg]) => {
      setUsers(u);
      setProgressRecords(p);
      setConfig(cfg);
      if (cfg) {
        setEnabled(cfg.enabled);
        setFrequencyDays(cfg.frequencyDays);
        setDueDate(cfg.dueDate ?? "");
        setMessage(cfg.message || message);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressMap = useMemo(
    () => Object.fromEntries(progressRecords.map((p) => [p.userId, p])),
    [progressRecords]
  );

  // Overdue = not completed and past due date (if set) or not started at all
  const overdueUsers = useMemo(() => {
    const now = new Date();
    const due = dueDate ? new Date(dueDate) : null;

    return users.filter((u) => {
      const prog = progressMap[u.id];
      const status = prog?.status ?? "not_started";
      if (status === "completed") return false;

      if (due) {
        return now > due;
      }
      // Without a due date, flag anyone who hasn't started
      return status === "not_started";
    });
  }, [users, progressMap, dueDate]);

  async function handleSave() {
    setSaving(true);
    await saveReminderConfig({
      enabled,
      frequencyDays,
      dueDate: dueDate || null,
      message,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Admin · Reminders
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Reminders & Overdue Alerts</h1>
        <p className="text-slate-500">
          Configure automated training reminders and view employees who are overdue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reminder Configuration */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-4 w-4 text-slate-500" />
            <h2 className="text-[15px] font-semibold text-slate-900">Reminder Settings</h2>
          </div>

          {/* Enable toggle */}
          <div className="flex items-center justify-between mb-5 p-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enable Reminders</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Send automatic reminders to incomplete employees
              </p>
            </div>
            <button
              onClick={() => setEnabled((v) => !v)}
              className="flex-shrink-0 ml-4"
              aria-label="Toggle reminders"
            >
              {enabled ? (
                <ToggleRight className="h-8 w-8 text-teal-600" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* Due date */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Training Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-700"
            />
            <p className="text-xs text-slate-400 mt-1">
              Employees not finished by this date will be marked overdue.
            </p>
          </div>

          {/* Frequency */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Reminder Frequency
            </label>
            <select
              value={frequencyDays}
              onChange={(e) => setFrequencyDays(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-700"
            >
              <option value={1}>Daily</option>
              <option value={3}>Every 3 days</option>
              <option value={7}>Weekly</option>
              <option value={14}>Every 2 weeks</option>
              <option value={30}>Monthly</option>
            </select>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Reminder Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-700 resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
          </button>

          {config?.updatedAt && !saving && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              Last saved: {new Date(config.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Overdue Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h2 className="text-[15px] font-semibold text-slate-900">
                Overdue Employees
              </h2>
            </div>
            {!loading && (
              <span
                className={`text-xs font-bold rounded-full px-2.5 py-0.5 ${
                  overdueUsers.length === 0
                    ? "bg-teal-100 text-teal-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {overdueUsers.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">Loading…</div>
          ) : overdueUsers.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                <Bell className="h-5 w-5 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">
                {dueDate
                  ? "No employees are overdue."
                  : "Set a due date to track overdue employees."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {overdueUsers.map((u) => {
                const prog = progressMap[u.id];
                return (
                  <Link
                    key={u.id}
                    href={`/admin/employees/${u.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold flex-shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge variant={prog?.status ?? "not_started"} />
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* All incomplete employees */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <h2 className="text-[15px] font-semibold text-slate-900">
            All Incomplete Employees
          </h2>
          {!loading && (
            <span className="ml-auto text-xs text-slate-400">
              {users.filter((u) => progressMap[u.id]?.status !== "completed").length} employees
            </span>
          )}
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter((u) => progressMap[u.id]?.status !== "completed")
                  .sort(
                    (a, b) =>
                      (progressMap[a.id]?.overallProgress ?? 0) -
                      (progressMap[b.id]?.overallProgress ?? 0)
                  )
                  .map((u) => {
                    const prog = progressMap[u.id];
                    const isOverdue = overdueUsers.some((o) => o.id === u.id);
                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isOverdue ? "bg-red-50/50" : ""
                        }`}
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/employees/${u.id}`}
                            className="font-semibold text-slate-900 hover:text-teal-600 transition-colors"
                          >
                            {u.name}
                          </Link>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{u.department || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StatusBadge variant={prog?.status ?? "not_started"} />
                            {isOverdue && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                                OVERDUE
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">
                          {prog?.overallProgress ?? 0}%
                        </td>
                        <td className="px-5 py-3 text-right text-xs text-slate-400">
                          {prog?.lastActivityAt
                            ? new Date(prog.lastActivityAt).toLocaleDateString()
                            : "Never"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
