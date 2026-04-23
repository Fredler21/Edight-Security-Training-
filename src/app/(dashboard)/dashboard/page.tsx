"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/modules";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { db } from "@/lib/firebase";
import { getTrainingAssignments } from "@/lib/firestore";
import type { TrainingAssignment } from "@/types";

// Dashboard palette — refined blue (matches landing for a unified professional look)
const blue = "#0ea5e9";
const blueDeep = "#0369a1";
const blueLight = "#38bdf8";
const slate700 = "#334155";
const success = "#059669";

const text = "#0f172a";
const textMuted = "#64748b";
const cardBg = "#ffffff";
const border = "#e2e8f0";

export default function DashboardPage() {
  const { user } = useAuth();
  const { getModuleProgress, loading } = useProgress(user?.uid);
  const [profile, setProfile] = useState<{ jobTitle: string; department: string } | null>(null);
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({ jobTitle: d.jobTitle ?? "", department: d.department ?? "" });
      }
    });
    getTrainingAssignments()
      .then(setAssignments)
      .catch((err) => console.error("Failed to load assignments", err));
  }, [user]);

  const completedCount = modules.filter(
    (m) => getModuleProgress(m.id).status === "completed"
  ).length;
  const inProgressCount = modules.filter(
    (m) => getModuleProgress(m.id).status === "in_progress"
  ).length;
  const overallPercent = Math.round((completedCount / modules.length) * 100);
  const remainingCount = modules.length - completedCount;

  const nextModule = modules.find(
    (m) => getModuleProgress(m.id).status !== "completed"
  );

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  // ─── To-Do list from admin assignments ──────────────────────────────────────
  const dept = (profile?.department ?? "").trim().toLowerCase();
  const matchedAssignments = assignments.filter((a) => {
    const aDept = (a.department ?? "").trim().toLowerCase();
    return aDept === dept || aDept === "all" || aDept === "*" || aDept === "everyone";
  });
  const requiredModuleIdSet = new Set<string>();
  let earliestDueDate: string | null = null;
  for (const a of matchedAssignments) {
    a.requiredModuleIds.forEach((id) => requiredModuleIdSet.add(id));
    if (a.dueDate) {
      if (!earliestDueDate || a.dueDate < earliestDueDate) earliestDueDate = a.dueDate;
    }
  }
  const todoModules = modules
    .filter((m) => requiredModuleIdSet.has(m.id))
    .map((m) => ({ module: m, progress: getModuleProgress(m.id) }))
    .filter((x) => x.progress.status !== "completed");

  const dueDateLabel = earliestDueDate
    ? new Date(earliestDueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const isOverdue = earliestDueDate ? new Date(earliestDueDate) < new Date() : false;

  const stats = [
    { label: "Overall Progress", value: loading ? "\u2014" : `${overallPercent}%`, sub: `${completedCount} of ${modules.length} modules`, icon: "trending_up", color: blueDeep },
    { label: "Completed", value: loading ? "\u2014" : `${completedCount}`, sub: "modules finished", icon: "check_circle", color: success },
    { label: "In Progress", value: loading ? "\u2014" : `${inProgressCount}`, sub: "currently active", icon: "auto_stories", color: blue },
    { label: "Remaining", value: loading ? "\u2014" : `${remainingCount}`, sub: "left to complete", icon: "schedule", color: slate700 },
  ];

  return (
    <div style={{ padding: "40px clamp(20px, 5vw, 48px)", maxWidth: "1200px", margin: "0 auto", color: text }}>
      <style>{`
        @keyframes dash-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dash-pulse-ring { 0% { transform: scale(0.95); opacity: 0.5; } 70% { transform: scale(1.35); opacity: 0; } 100% { opacity: 0; } }
        .dash-fade { animation: dash-fade-up 0.5s ease-out both; }
        .dash-card { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 1px 3px rgba(15,23,42,0.04); }
        .dash-card:hover { transform: translateY(-3px); border-color: rgba(14,165,233,0.35) !important; box-shadow: 0 10px 28px rgba(15,23,42,0.08); }
      `}</style>

      {/* Header */}
      <div className="dash-fade" style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "rgba(14,165,233,0.08)", border: `1px solid ${blue}33`, marginBottom: "12px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: blue }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: blueDeep, letterSpacing: "0.08em", textTransform: "uppercase" }}>Welcome back</span>
            </div>
            <h1 style={{ fontSize: "clamp(26px, 3.2vw, 34px)", fontWeight: 700, letterSpacing: "-0.022em", margin: "0 0 6px", lineHeight: 1.15, color: text }}>
              Hi {firstName}
            </h1>
            {(profile?.jobTitle || profile?.department) && (
              <p style={{ fontSize: "14px", color: textMuted, margin: 0 }}>
                {[profile?.jobTitle, profile?.department].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", background: cardBg, border: `1px solid ${border}`, backdropFilter: "blur(10px)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: blueDeep }}>notifications_active</span>
            <span style={{ fontSize: "13px", color: text, fontWeight: 500 }}>
              {remainingCount > 0 ? `${remainingCount} module${remainingCount !== 1 ? "s" : ""} remaining` : "All modules complete"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="dash-card dash-fade"
            style={{
              position: "relative",
              padding: "22px",
              borderRadius: "16px",
              background: cardBg,
              border: `1px solid ${border}`,
              overflow: "hidden",
              animationDelay: `${0.05 + i * 0.07}s`,
            }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", backgroundImage: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <div aria-hidden style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: `radial-gradient(circle, ${s.color}22, transparent 70%)`, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: textMuted, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{s.label}</p>
              <div style={{ width: "36px", height: "36px", borderRadius: "11px", backgroundImage: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${s.color}44` }}>
                <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "18px" }}>{s.icon}</span>
              </div>
            </div>
            <p style={{ fontSize: "28px", fontWeight: 800, color: text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: textMuted, margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress Panel */}
      <div className="dash-fade" style={{ position: "relative", padding: "26px 28px", borderRadius: "18px", background: cardBg, border: `1px solid ${border}`, marginBottom: "32px", overflow: "hidden", animationDelay: "0.35s" }}>
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundImage: `linear-gradient(90deg, ${blueDeep}, ${blue}, ${blueLight})` }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: text, margin: "0 0 4px", letterSpacing: "-0.01em" }}>Training Completion</h2>
            <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>{completedCount} of {modules.length} modules completed</p>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", color: blueDeep }}>{overallPercent}%</span>
          </div>
        </div>

        {/* Custom gradient progress bar */}
        <div style={{ position: "relative", height: "10px", borderRadius: "999px", background: "#e2e8f0", overflow: "hidden", marginBottom: "18px" }}>
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: `${overallPercent}%`,
              borderRadius: "999px",
              backgroundImage: `linear-gradient(90deg, ${blueDeep}, ${blue}, ${blueLight})`,
              boxShadow: `0 0 12px ${blue}77`,
              transition: "width 0.6s ease",
            }}
          />
        </div>

        {/* Module dots */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${modules.length}, 1fr)`, gap: "6px" }}>
          {modules.map((m) => {
            const s = getModuleProgress(m.id).status;
            const color = s === "completed" ? blue : s === "in_progress" ? blueDeep : "#e2e8f0";
            return (
              <div
                key={m.id}
                title={m.title}
                style={{ height: "6px", borderRadius: "999px", background: color, boxShadow: s === "completed" ? `0 0 6px ${blue}99` : "none", transition: "background 0.3s" }}
              />
            );
          })}
        </div>
      </div>

      {/* Assigned To-Do List (from admin assignments) */}
      {todoModules.length > 0 && !loading && (
        <div
          className="dash-fade"
          style={{
            position: "relative",
            padding: "26px 28px",
            borderRadius: "18px",
            background: cardBg,
            border: `1px solid ${border}`,
            marginBottom: "32px",
            overflow: "hidden",
            animationDelay: "0.4s",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              backgroundImage: `linear-gradient(90deg, ${isOverdue ? "#dc2626" : blueDeep}, ${isOverdue ? "#f97316" : blue})`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: isOverdue ? "rgba(220,38,38,0.1)" : "rgba(3,105,161,0.1)",
                  border: `1px solid ${isOverdue ? "#dc262644" : `${blueDeep}33`}`,
                  marginBottom: "10px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "13px", color: isOverdue ? "#dc2626" : blueDeep }}
                >
                  {isOverdue ? "warning" : "assignment"}
                </span>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: isOverdue ? "#dc2626" : blueDeep,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Assigned to you
                </span>
              </div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: text, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                Your To-Do List
              </h2>
              <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>
                {todoModules.length} module{todoModules.length !== 1 ? "s" : ""} required
                {dueDateLabel && (
                  <>
                    {" · "}
                    <span style={{ color: isOverdue ? "#dc2626" : textMuted, fontWeight: isOverdue ? 600 : 400 }}>
                      {isOverdue ? "Overdue " : "Due "}
                      {dueDateLabel}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {todoModules.map(({ module: m, progress: p }) => {
              const isInProgress = p.status === "in_progress";
              return (
                <Link
                  key={m.id}
                  href={`/modules/${m.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: `1px solid ${border}`,
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.15s ease, border-color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = `${blue}66`;
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundImage: `linear-gradient(135deg, ${m.color}, ${m.color}aa)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 4px 10px ${m.color}33`,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "18px" }}>
                      {m.icon}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: text, margin: "0 0 2px", letterSpacing: "-0.01em" }}>
                      {m.title}
                    </p>
                    <p style={{ fontSize: "12px", color: textMuted, margin: 0 }}>
                      {isInProgress ? "In progress" : "Not started"} · About {m.estimatedMinutes} min
                    </p>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: blueDeep,
                      flexShrink: 0,
                    }}
                  >
                    {isInProgress ? "Resume" : "Start"}
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue Learning */}
      {nextModule && !loading && (
        <div className="dash-fade" style={{ position: "relative", padding: "28px clamp(20px, 3vw, 32px)", borderRadius: "20px", marginBottom: "32px", overflow: "hidden", backgroundImage: `linear-gradient(135deg, ${blueDeep} 0%, ${blue} 100%)`, boxShadow: `0 16px 44px ${blue}55`, animationDelay: "0.45s" }}>
          <div aria-hidden style={{ position: "absolute", top: "-80px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", position: "relative", zIndex: 1 }}>
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.15)", marginBottom: "12px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#fff" }}>local_fire_department</span>
                <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>Continue Learning</span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{nextModule.title}</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55, margin: "0 0 10px", maxWidth: "560px" }}>{nextModule.description}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
                About {nextModule.estimatedMinutes} min to complete
              </div>
            </div>
            <Link
              href={`/modules/${nextModule.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                padding: "13px 22px",
                borderRadius: "12px",
                background: "#fff",
                color: blueDeep,
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {getModuleProgress(nextModule.id).status === "in_progress" ? "Continue Module" : "Start Module"}
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* All complete celebration */}
      {completedCount === modules.length && !loading && (
        <div className="dash-fade" style={{ padding: "22px 24px", borderRadius: "16px", background: "rgba(14,165,233,0.1)", border: `1px solid ${blue}44`, marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
            <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${blue}55`, animation: "dash-pulse-ring 2.2s ease-out infinite" }} />
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blue})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${blue}66` }}>
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "24px" }}>emoji_events</span>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, color: text, margin: "0 0 2px", fontSize: "15px" }}>All modules complete, {firstName}.</p>
            <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>You&apos;ve finished your security training. Check your progress page for details.</p>
          </div>
        </div>
      )}

      {/* All modules section */}
      <div className="dash-fade" style={{ animationDelay: "0.55s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", borderRadius: "999px", background: "rgba(3,105,161,0.1)", border: `1px solid ${blueDeep}33`, marginBottom: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "13px", color: blueDeep }}>library_books</span>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: blueDeep, letterSpacing: "0.08em", textTransform: "uppercase" }}>Modules</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: text, margin: 0, letterSpacing: "-0.015em" }}>All Training Modules</h2>
          </div>
          <Link href="/modules" style={{ fontSize: "13px", color: blueDeep, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            View all
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
          {modules.map((mod) => {
            const p = getModuleProgress(mod.id);
            return (
              <ModuleCard
                key={mod.id}
                module={mod}
                status={p.status}
                progress={p.progress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
