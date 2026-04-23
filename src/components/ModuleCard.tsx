"use client";

import Link from "next/link";
import Image from "next/image";
import { TrainingModule, ModuleStatus } from "@/types";

const emerald = "#10b981";
const emeraldDeep = "#047857";
const emeraldLight = "#34d399";
const indigo = "#6366f1";

const accentMap: Record<string, { a: string; b: string }> = {
  teal: { a: "#0d9488", b: "#2dd4bf" },
  red: { a: "#dc2626", b: "#f87171" },
  blue: { a: "#2563eb", b: "#60a5fa" },
  purple: { a: "#7c3aed", b: "#a78bfa" },
  green: { a: "#059669", b: "#34d399" },
};

interface ModuleCardProps {
  module: TrainingModule;
  status?: ModuleStatus;
  progress?: number;
}

export default function ModuleCard({
  module,
  status = "not_started",
  progress = 0,
}: ModuleCardProps) {
  const accent = accentMap[module.color] ?? accentMap.teal;

  const statusPill =
    status === "completed"
      ? { label: "Completed", bg: `${emerald}22`, border: `${emerald}55`, color: emeraldLight, icon: "check_circle" }
      : status === "in_progress"
      ? { label: "In Progress", bg: `${indigo}22`, border: `${indigo}55`, color: "#a5b4fc", icon: "play_arrow" }
      : { label: "Not Started", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", icon: "circle" };

  const ctaText = status === "completed" ? "Review" : status === "in_progress" ? "Continue" : "Start";

  return (
    <Link
      href={`/modules/${module.slug}`}
      className="dash-module-card"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <style>{`
        .dash-module-card:hover { transform: translateY(-5px); border-color: rgba(16,185,129,0.4) !important; box-shadow: 0 18px 44px rgba(16,185,129,0.18); }
        .dash-module-card:hover .dash-mod-img { transform: scale(1.07); }
        .dash-module-card:hover .dash-mod-cta { gap: 8px; color: ${emeraldLight} !important; }
        .dash-module-card:hover .dash-mod-arrow { transform: translateX(3px); }
      `}</style>

      {/* Top gradient accent bar */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", backgroundImage: `linear-gradient(90deg, ${accent.a}, ${accent.b}, transparent)`, zIndex: 2 }} />

      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", height: "140px", background: "#0a0f1c", overflow: "hidden" }}>
        <Image
          src={module.image}
          alt={`${module.title} illustration`}
          fill
          className="dash-mod-img"
          style={{ objectFit: "cover", transition: "transform 0.35s ease" }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(5,8,16,0.75))", pointerEvents: "none" }} />

        {/* Status pill */}
        <div style={{ position: "absolute", top: "12px", right: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 9px", borderRadius: "999px", background: statusPill.bg, border: `1px solid ${statusPill.border}`, backdropFilter: "blur(8px)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "12px", color: statusPill.color }}>{statusPill.icon}</span>
          <span style={{ fontSize: "10.5px", fontWeight: 700, color: statusPill.color, letterSpacing: "0.04em" }}>{statusPill.label}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", backgroundImage: `linear-gradient(135deg, ${accent.a}, ${accent.b})`, boxShadow: `0 4px 12px ${accent.a}55`, flexShrink: 0 }}>
            {module.icon}
          </div>
          <p style={{ fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Module {module.order}</p>
        </div>

        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{module.title}</h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>{module.description}</p>

        {status === "in_progress" && (
          <div style={{ marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: "5px" }}>
              <span>Progress</span><span>{progress}%</span>
            </div>
            <div style={{ height: "5px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", borderRadius: "999px", backgroundImage: `linear-gradient(90deg, ${emeraldDeep}, ${emeraldLight})`, boxShadow: `0 0 8px ${emerald}66` }} />
            </div>
          </div>
        )}

        {/* Dashed divider + footer */}
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px dashed rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
            {module.estimatedMinutes} min
          </div>
          <span className="dash-mod-cta" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: status === "completed" ? emeraldLight : "rgba(255,255,255,0.65)", transition: "all 0.2s", letterSpacing: "-0.005em" }}>
            {ctaText}
            <span className="material-symbols-outlined dash-mod-arrow" style={{ fontSize: "15px", transition: "transform 0.2s" }}>arrow_forward</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
