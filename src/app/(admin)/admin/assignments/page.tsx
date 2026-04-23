"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Calendar,
  CheckSquare,
  X,
  Save,
} from "lucide-react";
import {
  getTrainingAssignments,
  saveTrainingAssignment,
  deleteTrainingAssignment,
  getAllUsers,
} from "@/lib/firestore";
import { modules } from "@/data/modules";
import type { TrainingAssignment } from "@/types";

const ALL_MODULE_IDS = modules.map((m) => m.id);

function AssignmentModal({
  initial,
  departments,
  onClose,
  onSaved,
}: {
  initial?: TrainingAssignment;
  departments: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [customDept, setCustomDept] = useState(
    departments.includes(initial?.department ?? "") ? "" : (initial?.department ?? "")
  );
  const [requiredModuleIds, setRequiredModuleIds] = useState<string[]>(
    initial?.requiredModuleIds ?? ALL_MODULE_IDS
  );
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveDept = department === "__custom__" ? customDept : department;

  function toggleModule(id: string) {
    setRequiredModuleIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!effectiveDept.trim()) {
      setError("Pick a department, or add a custom one.");
      return;
    }
    if (requiredModuleIds.length === 0) {
      setError("Select at least one required module.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await saveTrainingAssignment({
        id: initial?.id ?? crypto.randomUUID(),
        department: effectiveDept.trim(),
        requiredModuleIds,
        dueDate: dueDate || null,
        isNew: !initial,
      });
      onSaved();
    } catch (err) {
      console.error("Failed to save assignment", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not save the assignment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">
            {initial ? "Edit Assignment" : "New Training Assignment"}
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required={department !== "__custom__"}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            >
              <option value="">Select a department…</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option value="__custom__">+ Custom department</option>
            </select>
            {department === "__custom__" && (
              <input
                type="text"
                placeholder="Enter department name…"
                value={customDept}
                onChange={(e) => setCustomDept(e.target.value)}
                required
                className="mt-2 w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
              />
            )}
          </div>

          {/* Required modules */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Required Modules
            </label>
            <div className="space-y-2">
              {modules.map((mod) => (
                <label
                  key={mod.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={requiredModuleIds.includes(mod.id)}
                    onChange={() => toggleModule(mod.id)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700">
                    <strong className="text-slate-900">M{mod.order}</strong> — {mod.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Completion Due Date{" "}
              <span className="text-slate-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Assignment"}
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TrainingAssignment | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const [a, users] = await Promise.all([getTrainingAssignments(), getAllUsers()]);
    setAssignments(a);
    const depts = [...new Set(users.map((u) => u.department).filter(Boolean))].sort();
    setDepartments(depts);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    await deleteTrainingAssignment(id);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  }

  function handleEdit(assignment: TrainingAssignment) {
    setEditing(assignment);
    setShowModal(true);
  }

  function handleNew() {
    setEditing(undefined);
    setShowModal(true);
  }

  async function handleSaved() {
    setShowModal(false);
    setEditing(undefined);
    const updated = await getTrainingAssignments();
    setAssignments(updated);
  }

  const today = new Date();

  return (
    <>
      {showModal && (
        <AssignmentModal
          initial={editing}
          departments={departments}
          onClose={() => {
            setShowModal(false);
            setEditing(undefined);
          }}
          onSaved={handleSaved}
        />
      )}

      <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
              Admin · Assignments
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Training Assignments</h1>
            <p className="text-slate-500">
              Define which modules are required for each department and set due dates.
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Assignment
          </button>
        </div>

        {/* Assignment cards */}
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading…</div>
        ) : assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="h-6 w-6 text-teal-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">No assignments yet</p>
            <p className="text-xs text-slate-400 mb-4">
              Create your first training assignment to define department requirements.
            </p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => {
              const due = a.dueDate ? new Date(a.dueDate) : null;
              const isOverdue = due ? today > due : false;
              const isDueSoon =
                due && !isOverdue
                  ? (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 14
                  : false;
              const assignedModules = modules.filter((m) =>
                a.requiredModuleIds.includes(m.id)
              );

              return (
                <div
                  key={a.id}
                  className={`bg-white border rounded-2xl shadow-sm p-5 transition-colors ${
                    isOverdue
                      ? "border-red-200 bg-red-50/30"
                      : isDueSoon
                      ? "border-amber-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {a.department}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {assignedModules.length} module
                          {assignedModules.length !== 1 ? "s" : ""} required
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {due && (
                        <span
                          className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 ${
                            isOverdue
                              ? "bg-red-100 text-red-700"
                              : isDueSoon
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Calendar className="h-3 w-3" />
                          {isOverdue ? "Overdue · " : isDueSoon ? "Due soon · " : "Due · "}
                          {due.toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleEdit(a)}
                        className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        className="h-8 w-8 rounded-lg border border-red-100 hover:bg-red-50 flex items-center justify-center transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {assignedModules.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        <span className="text-slate-400">M{m.order}</span>
                        {m.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
