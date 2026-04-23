import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  ModuleCompletion,
  EmployeeTrainingProgress,
  AuditLog,
  AuditAction,
  ReminderConfig,
  TrainingAssignment,
} from "@/types";

// ─── Module Completions ───────────────────────────────────────────────────────

export async function getModuleCompletions(
  userId: string
): Promise<Record<string, ModuleCompletion>> {
  const q = query(
    collection(db, "moduleCompletions"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const result: Record<string, ModuleCompletion> = {};
  snap.forEach((d) => {
    const data = d.data() as ModuleCompletion;
    result[data.moduleId] = data;
  });
  return result;
}

export async function saveModuleCompletion(
  userId: string,
  moduleId: string,
  score: number,
  totalModules: number,
  moduleTitle?: string
): Promise<void> {
  const completionRef = doc(db, "moduleCompletions", `${userId}_${moduleId}`);

  // Atomic increment so we don't need to read the doc first (avoids rules read-on-create issue).
  await setDoc(
    completionRef,
    {
      id: `${userId}_${moduleId}`,
      userId,
      moduleId,
      completed: true,
      completedAt: serverTimestamp(),
      score,
      attempts: increment(1),
      lastViewedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Audit log is best-effort — never block completion if rules disallow it.
  try {
    await addDoc(collection(db, "auditLogs"), {
      userId,
      action: "module_completed",
      moduleId,
      moduleTitle: moduleTitle ?? moduleId,
      score,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Audit log write failed (non-fatal)", err);
  }

  // Recalculate overall progress (also best-effort to avoid breaking the flow).
  try {
    await recalculateUserProgress(userId, totalModules);
  } catch (err) {
    console.warn("Progress recalculation failed (non-fatal)", err);
  }
}

// ─── User Overall Progress ────────────────────────────────────────────────────

export async function getUserProgress(
  userId: string
): Promise<EmployeeTrainingProgress | null> {
  const snap = await getDoc(doc(db, "userProgress", userId));
  return snap.exists() ? (snap.data() as EmployeeTrainingProgress) : null;
}

async function recalculateUserProgress(
  userId: string,
  totalModules: number
): Promise<void> {
  const completions = await getModuleCompletions(userId);
  const completedCount = Object.values(completions).filter((c) => c.completed).length;
  const overallProgress = Math.round((completedCount / totalModules) * 100);

  await setDoc(
    doc(db, "userProgress", userId),
    {
      id: userId,
      userId,
      overallProgress,
      completedModulesCount: completedCount,
      totalModulesCount: totalModules,
      status: completedCount === totalModules ? "completed" : completedCount > 0 ? "in_progress" : "not_started",
      lastActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  jobTitle: string;
  profileImage: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string | null;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const snap = await getDocs(
    query(collection(db, "users"), orderBy("name"))
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? "",
      email: data.email ?? "",
      role: data.role ?? "employee",
      department: data.department ?? "",
      jobTitle: data.jobTitle ?? "",
      profileImage: data.profileImage ?? "",
      status: data.status ?? "active",
      lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() ?? null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    };
  });
}

export async function getUserById(userId: string): Promise<AdminUser | null> {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? "",
    email: data.email ?? "",
    role: data.role ?? "employee",
    department: data.department ?? "",
    jobTitle: data.jobTitle ?? "",
    profileImage: data.profileImage ?? "",
    status: data.status ?? "active",
    lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() ?? null,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  };
}

export async function getCompletionsForUser(
  userId: string
): Promise<Record<string, import("@/types").ModuleCompletion>> {
  const q = query(
    collection(db, "moduleCompletions"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const result: Record<string, import("@/types").ModuleCompletion> = {};
  snap.forEach((d) => {
    const data = d.data() as import("@/types").ModuleCompletion;
    result[data.moduleId] = data;
  });
  return result;
}

export async function getAllProgressRecords(): Promise<import("@/types").EmployeeTrainingProgress[]> {
  const snap = await getDocs(collection(db, "userProgress"));
  return snap.docs.map((d) => d.data() as import("@/types").EmployeeTrainingProgress);
}

// ─── V4 — Audit Logs ─────────────────────────────────────────────────────────

export async function getAuditLogs(userId: string): Promise<AuditLog[]> {
  const q = query(
    collection(db, "auditLogs"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId ?? userId,
      action: (data.action ?? "login") as AuditAction,
      moduleId: data.moduleId,
      moduleTitle: data.moduleTitle,
      score: data.score,
      timestamp: data.timestamp?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      details: data.details,
    } as AuditLog;
  });
}

export async function writeAuditLog(
  entry: Omit<AuditLog, "id" | "timestamp">
): Promise<void> {
  await addDoc(collection(db, "auditLogs"), {
    ...entry,
    timestamp: serverTimestamp(),
  });
}

// ─── V4 — Reminder Config ─────────────────────────────────────────────────────

export async function getReminderConfig(): Promise<ReminderConfig | null> {
  const snap = await getDoc(doc(db, "config", "reminders"));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: "reminders",
    enabled: data.enabled ?? false,
    frequencyDays: data.frequencyDays ?? 7,
    dueDate: data.dueDate ?? null,
    message: data.message ?? "",
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function saveReminderConfig(
  config: Omit<ReminderConfig, "id" | "updatedAt">
): Promise<void> {
  await setDoc(doc(db, "config", "reminders"), {
    ...config,
    updatedAt: serverTimestamp(),
  });
}

// ─── V4 — Training Assignments ───────────────────────────────────────────────

export async function getTrainingAssignments(): Promise<TrainingAssignment[]> {
  const snap = await getDocs(collection(db, "trainingAssignments"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      department: data.department ?? "",
      requiredModuleIds: data.requiredModuleIds ?? [],
      dueDate: data.dueDate ?? null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as TrainingAssignment;
  });
}

export async function saveTrainingAssignment(
  assignment: Omit<TrainingAssignment, "createdAt" | "updatedAt"> & { isNew?: boolean }
): Promise<void> {
  const { isNew, ...rest } = assignment;
  const ref = isNew
    ? doc(collection(db, "trainingAssignments"))
    : doc(db, "trainingAssignments", assignment.id);
  await setDoc(
    ref,
    {
      ...rest,
      updatedAt: serverTimestamp(),
      ...(isNew ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
}

export async function deleteTrainingAssignment(id: string): Promise<void> {
  await deleteDoc(doc(db, "trainingAssignments", id));
}

// ─── V4 — All Module Completions (for analytics) ─────────────────────────────

export async function getAllModuleCompletions(): Promise<ModuleCompletion[]> {
  const snap = await getDocs(collection(db, "moduleCompletions"));
  return snap.docs.map((d) => d.data() as ModuleCompletion);
}

// ─── Admin — Reset Employee Progress ─────────────────────────────────────────

/**
 * Delete a single module's completion for an employee. Admin only.
 * Best-effort recalculates the user's overall progress afterward.
 */
export async function resetModuleCompletion(
  userId: string,
  moduleId: string,
  totalModules: number,
  adminUserId?: string,
  moduleTitle?: string
): Promise<void> {
  await deleteDoc(doc(db, "moduleCompletions", `${userId}_${moduleId}`));

  try {
    await recalculateUserProgress(userId, totalModules);
  } catch (err) {
    console.warn("Progress recalculation failed (non-fatal)", err);
  }

  // Best-effort audit log so the reset is traceable.
  try {
    await addDoc(collection(db, "auditLogs"), {
      userId: adminUserId ?? userId,
      action: "module_completed",
      moduleId,
      moduleTitle: moduleTitle ?? moduleId,
      details: `Admin reset progress for user ${userId}`,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Audit log write failed (non-fatal)", err);
  }
}

/**
 * Reset ALL module completions for an employee and clear their overall progress.
 * Admin only.
 */
export async function resetAllUserProgress(
  userId: string,
  totalModules: number,
  adminUserId?: string
): Promise<void> {
  const q = query(
    collection(db, "moduleCompletions"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

  try {
    await recalculateUserProgress(userId, totalModules);
  } catch (err) {
    console.warn("Progress recalculation failed (non-fatal)", err);
  }

  try {
    await addDoc(collection(db, "auditLogs"), {
      userId: adminUserId ?? userId,
      action: "module_completed",
      details: `Admin reset ALL progress for user ${userId}`,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Audit log write failed (non-fatal)", err);
  }
}
