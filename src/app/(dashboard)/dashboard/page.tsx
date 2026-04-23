"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/modules";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { db } from "@/lib/firebase";

// Dashboard palette — emerald + indigo (different from landing's blue)
const emerald = "#10b981";
const emeraldDeep = "#047857";
const emeraldLight = "#34d399";
const indigo = "#6366f1";
const violet = "#7c3aed";

const text = "#f1f5f9";
const textMuted = "rgba(255,255,255,0.55)";
const cardBg = "rgba(15,23,42,0.6)";
const border = "rgba(255,255,255,0.07)";

export default function DashboardPage() {
  const { user } = useAuth();
  const { getModuleProgress, loading } = useProgress(user?.uid);
  const [profile, setProfile] = useState<{ jobTitle: string; department: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({ jobTitle: d.jobTitle ?? "", department: d.department ?? "" });
      }
    });
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

  const stats = [
    { label: "Overall Progress", value: loading ? "—" : `${overallPercent}%`, sub: `${completedCount} of ${modules.length} modules`, icon: "trending_up", color: emerald },
    { label: "Completed", value: loading ? "—" : `${completedCount}`, sub: "modules finished", icon: "check_circle", color: emeraldLight },
    { label: "In Progress", value: loading ? "—" : `${inProgressCount}`, sub: "currently active", icon: "auto_stories", color: indigo },
    { label: "Remaining", value: loading ? "—" : `${remainingCount}`, sub: "left to complete", icon: "schedule", color: violet },
  ];

  return (
    <div style={{ padding: "40px clamp(20px, 5vw, 48px)", maxWidth: "1200px", margin: "0 auto", color: text }}>
      <style>{`
        @keyframes dash-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dash-headline-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes dash-pulse-ring { 0% { transform: scale(0.95); opacity: 0.5; } 70% { transform: scale(1.35); opacity: 0; } 100% { opacity: 0; } }
        @keyframes dash-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .dash-fade { animation: dash-fade-up 0.6s ease-out both; }
        .dash-headline-grad {
          background-image: linear-gradient(120deg, ${emeraldDeep} 0%, ${emerald} 35%, ${emeraldLight} 65%, ${emeraldDeep} 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: dash-headline-shift 7s ease-in-out infinite;
        }
        .dash-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .dash-card:hover { transform: translateY(-4px); border-color: rgba(16,185,129,0.4) !important; box-shadow: 0 14px 40px rgba(16,185,129,0.15); }
        .dash-cta-btn { position: relative; overflow: hidden; }
        .dash-cta-btn::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); background-size: 200% 100%; animation: dash-shimmer 3.5s linear infinite; pointer-events: none; }
      `}</style>

      {/* Header */}
      <div className="dash-fade" style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "rgba(16,185,129,0.1)", border: `1px solid ${emerald}33`, marginBottom: "12px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: emerald, boxShadow: `0 0 8px ${emerald}` }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: emeraldLight, letterSpacing: "0.08em", textTransform: "uppercase" }}>Welcome back</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 6px", lineHeight: 1.1 }}>
              Hi <span className="dash-headline-grad">{firstName}</span>
            </h1>
            {(profile?.jobTitle || profile?.department) && (
              <p style={{ fontSize: "14px", color: textMuted, margin: 0 }}>
                {[profile?.jobTitle, profile?.department].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", background: cardBg, border: `1px solid ${border}`, backdropFilter: "blur(10px)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: emeraldLight }}>notifications_active</span>
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
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundImage: `linear-gradient(90deg, ${emeraldDeep}, ${emerald}, ${emeraldLight})` }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: text, margin: "0 0 4px", letterSpacing: "-0.01em" }}>Training Completion</h2>
            <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>{completedCount} of {modules.length} modules completed</p>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }} className="dash-headline-grad">{overallPercent}%</span>
          </div>
        </div>

        {/* Custom gradient progress bar */}
        <div style={{ position: "relative", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: "18px" }}>
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: `${overallPercent}%`,
              borderRadius: "999px",
              backgroundImage: `linear-gradient(90deg, ${emeraldDeep}, ${emerald}, ${emeraldLight})`,
              boxShadow: `0 0 12px ${emerald}77`,
              transition: "width 0.6s ease",
            }}
          />
        </div>

        {/* Module dots */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${modules.length}, 1fr)`, gap: "6px" }}>
          {modules.map((m) => {
            const s = getModuleProgress(m.id).status;
            const color = s === "completed" ? emerald : s === "in_progress" ? indigo : "rgba(255,255,255,0.08)";
            return (
              <div
                key={m.id}
                title={m.title}
                style={{ height: "6px", borderRadius: "999px", background: color, boxShadow: s === "completed" ? `0 0 6px ${emerald}99` : "none", transition: "background 0.3s" }}
              />
            );
          })}
        </div>
      </div>

      {/* Continue Learning */}
      {nextModule && !loading && (
        <div className="dash-fade" style={{ position: "relative", padding: "28px clamp(20px, 3vw, 32px)", borderRadius: "20px", marginBottom: "32px", overflow: "hidden", backgroundImage: `linear-gradient(135deg, ${emeraldDeep} 0%, ${emerald} 100%)`, boxShadow: `0 16px 44px ${emerald}55`, animationDelay: "0.45s" }}>
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
              className="dash-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                padding: "13px 22px",
                borderRadius: "12px",
                background: "#fff",
                color: emeraldDeep,
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
        <div className="dash-fade" style={{ padding: "22px 24px", borderRadius: "16px", background: "rgba(16,185,129,0.1)", border: `1px solid ${emerald}44`, marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
            <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${emerald}55`, animation: "dash-pulse-ring 2.2s ease-out infinite" }} />
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundImage: `linear-gradient(135deg, ${emeraldDeep}, ${emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${emerald}66` }}>
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
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", borderRadius: "999px", background: "rgba(99,102,241,0.1)", border: `1px solid ${indigo}33`, marginBottom: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "13px", color: indigo }}>library_books</span>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: indigo, letterSpacing: "0.08em", textTransform: "uppercase" }}>Modules</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: text, margin: 0, letterSpacing: "-0.015em" }}>All Training Modules</h2>
          </div>
          <Link href="/modules" style={{ fontSize: "13px", color: emeraldLight, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
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
