"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  CheckCircle2,
  Clock,
  Circle,
  Users,
} from "lucide-react";
import { getAllUsers, getAllProgressRecords, AdminUser } from "@/lib/firestore";
import type { EmployeeTrainingProgress } from "@/types";
import StatusBadge from "@/components/StatusBadge";

type Filter = "all" | "completed" | "in_progress" | "not_started";

export default function EmployeesPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [progressRecords, setProgressRecords] = useState<EmployeeTrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    Promise.all([getAllUsers(), getAllProgressRecords()]).then(([u, p]) => {
      setUsers(u);
      setProgressRecords(p);
      setLoading(false);
    });
  }, []);

  const progressMap = useMemo(
    () => Object.fromEntries(progressRecords.map((p) => [p.userId, p])),
    [progressRecords]
  );

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const prog = progressMap[u.id];
      const status = prog?.status ?? "not_started";
      const matchesFilter = filter === "all" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter, progressMap]);

  const filterTabs: { label: string; value: Filter; icon: React.ElementType }[] = [
    { label: "All", value: "all", icon: Users },
    { label: "Completed", value: "completed", icon: CheckCircle2 },
    { label: "In Progress", value: "in_progress", icon: Clock },
    { label: "Not Started", value: "not_started", icon: Circle },
  ];

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Employee Management</h1>
        <p className="text-slate-500">
          {loading ? "Loading…" : `${users.length} employee${users.length !== 1 ? "s" : ""} in the system.`}
        </p>
      </div>

      {/* Search + Filters */}
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
        <div className="flex gap-2">
          {filterTabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === value
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-400"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">Loading employees…</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              No employees match your search.
            </div>
          ) : (
            filtered.map((u) => {
              const prog = progressMap[u.id];
              const status = prog?.status ?? "not_started";
              const percent = prog?.overallProgress ?? 0;
              const lastLogin = u.lastLoginAt
                ? new Date(u.lastLoginAt).toLocaleDateString()
                : "Never";

              return (
                <Link
                  key={u.id}
                  href={`/admin/employees/${u.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Avatar */}
                  {u.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.profileImage}
                      alt={u.name}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    {u.department && (
                      <p className="text-xs text-slate-400 truncate">{u.department}</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className="hidden sm:block flex-shrink-0">
                    <StatusBadge variant={status} />
                  </div>

                  {/* Progress % */}
                  <div className="hidden md:block w-20 text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">{percent}%</p>
                    <p className="text-xs text-slate-400">complete</p>
                  </div>

                  {/* Last login */}
                  <div className="hidden lg:block w-28 text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">{lastLogin}</p>
                    <p className="text-xs text-slate-400">last login</p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
