"use client";

import { useEffect, useState } from "react";
import { getModuleCompletions } from "@/lib/firestore";
import type { ModuleCompletion, ModuleStatus } from "@/types";

export interface ModuleProgressEntry {
  status: ModuleStatus;
  score: number | null;
  completedAt: string | null;
  progress: number;
}

export function useProgress(userId: string | undefined) {
  const [completions, setCompletions] = useState<Record<string, ModuleCompletion>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getModuleCompletions(userId)
      .then(setCompletions)
      .finally(() => setLoading(false));
  }, [userId]);

  function getModuleProgress(moduleId: string): ModuleProgressEntry {
    const c = completions[moduleId];
    if (!c) return { status: "not_started", score: null, completedAt: null, progress: 0 };
    if (c.completed) {
      return {
        status: "completed",
        score: c.score ?? null,
        completedAt: c.completedAt ?? null,
        progress: 100,
      };
    }
    return { status: "in_progress", score: null, completedAt: null, progress: 45 };
  }

  function refresh(uid: string) {
    setLoading(true);
    getModuleCompletions(uid)
      .then(setCompletions)
      .finally(() => setLoading(false));
  }

  return { completions, loading, getModuleProgress, refresh };
}
