"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  BookOpen,
  Bell,
  PieChart,
  FileText,
  ClipboardList,
} from "lucide-react";
import { getAllUsers, getAllProgressRecords, AdminUser } from "@/lib/firestore";
import { modules } from "@/data/modules";
import type { EmployeeTrainingProgress } from "@/types";
import ProgressBar from "@/components/ProgressBar";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [progressRecords, setProgressRecords] = useState<EmployeeTrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllProgressRecords()]).then(([u, p]) => {
      setUsers(u);
      setProgressRecords(p);
      setLoading(false);
    });
  }, []);

  const totalUsers = users.length;
  const progressMap = Object.fromEntries(progressRecords.map((p) => [p.userId, p]));

  const completedUsers = users.filter(
    (u) => progressMap[u.id]?.status === "completed"
  ).length;

  const inProgressUsers = users.filter(
    (u) => progressMap[u.id]?.status === "in_progress"
  ).length;

  const notStartedUsers = users.filter(
    (u) => !progressMap[u.id] || progressMap[u.id].status === "not_started"
  ).length;

  const completionRate =
    totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;

  // Per-module completion counts
  const moduleStats = modules.map((mod) => {
    const completed = progressRecords.filter(
      (p) => (p.completedModulesCount ?? 0) >= mod.order
    ).length;
    return { mod, completed, rate: totalUsers > 0 ? Math.round((completed / totalUsers) * 100) : 0 };
  });

  // Recently active employees (sorted by lastLoginAt)
  const recentUsers = [...users]
    .filter((u) => u.lastLoginAt)
    .sort((a, b) => (b.lastLoginAt! > a.lastLoginAt! ? 1 : -1))
    .slice(0, 5);

  const stats = [
    {
      label: "Total Employees",
      value: loading ? "—" : totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: loading ? "—" : completedUsers,
      icon: CheckCircle2,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "In Progress",
      value: loading ? "—" : inProgressUsers,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Not Started",
      value: loading ? "—" : notStartedUsers,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-slate-500">
          Organization-wide training progress and activity.
        </p>
      </div>

      {/* Overdue alert banner */}
      {!loading && notStartedUsers > 0 && (
        <div className="flex items-center justify-between gap-4 mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Bell className="h-4.5 w-4.5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">
                {notStartedUsers} employee{notStartedUsers !== 1 ? "s" : ""} {notStartedUsers === 1 ? "has" : "have"} not started training
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Configure reminders to notify them automatically.
              </p>
            </div>
          </div>
          <Link
            href="/admin/reminders"
            className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 flex-shrink-0 transition-colors"
          >
            Manage reminders <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Completion Rate */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-teal-600" />
            <h2 className="text-[15px] font-semibold text-slate-900">Overall Completion Rate</h2>
          </div>
          <span className="text-2xl font-bold text-teal-600">
            {loading ? "—" : `${completionRate}%`}
          </span>
        </div>
        <ProgressBar value={completionRate} size="lg" />
        {!loading && (
          <p className="text-xs text-slate-400 mt-2">
            {completedUsers} of {totalUsers} employees have finished all modules.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Module Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <h2 className="text-[15px] font-semibold text-slate-900">Module Completion</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {moduleStats.map(({ mod, completed, rate }) => (
              <div key={mod.id} className="px-6 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-slate-800">{mod.title}</p>
                  <span className="text-xs font-semibold text-slate-500">
                    {loading ? "—" : `${completed}/${totalUsers}`}
                  </span>
                </div>
                <ProgressBar value={loading ? 0 : rate} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-900">Recent Activity</h2>
            <Link
              href="/admin/employees"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-6 py-8 text-center text-sm text-slate-400">Loading…</div>
            ) : recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-slate-400">
                No activity yet.
              </div>
            ) : (
              recentUsers.map((u) => {
                const prog = progressMap[u.id];
                return (
                  <Link
                    key={u.id}
                    href={`/admin/employees/${u.id}`}
                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    {u.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.profileImage}
                        alt={u.name}
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-slate-700">
                        {prog ? `${prog.overallProgress}%` : "0%"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {prog?.status === "completed"
                          ? "Done"
                          : prog?.status === "in_progress"
                          ? "In Progress"
                          : "Not Started"}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CTA to employee table */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-slate-900 mb-1">Manage Employees</p>
          <p className="text-sm text-slate-500">
            View all employees, search by name, and inspect individual progress.
          </p>
        </div>
        <Link
          href="/admin/employees"
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          Employee List <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* V4 Quick Access */}
      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 px-1">
          Enterprise Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: PieChart,
              label: "Analytics",
              desc: "Department-level insights and module performance.",
              href: "/admin/analytics",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              icon: FileText,
              label: "Reports",
              desc: "Export training data as CSV for compliance auditing.",
              href: "/admin/reports",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Bell,
              label: "Reminders",
              desc: "Configure overdue alerts and notification settings.",
              href: "/admin/reminders",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              icon: ClipboardList,
              label: "Assignments",
              desc: "Set department-based training rules and due dates.",
              href: "/admin/assignments",
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
          ].map(({ icon: Icon, label, desc, href, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-4.5 w-4.5 ${color}`} />
              </div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors mb-1">
                {label}
              </p>
              <p className="text-xs text-slate-400">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
