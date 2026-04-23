"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { useTheme } from "@/context/ThemeContext";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";

  useEffect(() => { setMounted(true); }, []);

  const bg = dark ? "#080c14" : "#ffffff";
  const surface = dark ? "#0f1724" : "#f8fafc";
  const surfaceAlt = dark ? "#141d2e" : "#f1f5f9";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";
  const cardBg = dark ? "rgba(15,23,42,0.96)" : "#ffffff";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const textMuted = dark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.5)";
  const blue = "#0ea5e9";
  const blueLight = "#38bdf8";
  const blueDeep = "#0369a1";

  const features = [
    { icon: "shield_lock", title: "Phishing Defense", desc: "Realistic simulated attacks train employees to spot and report phishing emails before damage occurs.", color: blue, glow: "rgba(14,165,233,0.12)", lessons: 6, minutes: 18, level: "Essential" },
    { icon: "lock_person", title: "Access Control", desc: "Best practices for password hygiene, MFA, and principle of least privilege across your organization.", color: "#6366f1", glow: "rgba(99,102,241,0.12)", lessons: 5, minutes: 15, level: "Core" },
    { icon: "devices", title: "Device & Data Safety", desc: "Training on secure remote work, BYOD policies, and safe handling of sensitive company information.", color: "#0891b2", glow: "rgba(8,145,178,0.12)", lessons: 7, minutes: 22, level: "Core" },
    { icon: "manage_accounts", title: "Admin Dashboard", desc: "Real-time completion tracking, automated reminders, and compliance reports for your entire team.", color: "#7c3aed", glow: "rgba(124,58,237,0.12)", lessons: 4, minutes: 12, level: "Admins" },
  ];

  const steps = [
    { num: "I", title: "Assign Modules", desc: "Select training modules and assign them to individuals, departments, or your entire organization in seconds.", icon: "playlist_add_check", color: "#0ea5e9" },
    { num: "II", title: "Employees Learn", desc: "Staff complete short, engaging lessons with interactive quizzes at their own pace, on any device.", icon: "school", color: "#6366f1" },
    { num: "III", title: "Track & Report", desc: "Monitor progress in real time. Export compliance reports with one click for audits or leadership review.", icon: "insights", color: "#7c3aed" },
  ];

  const stats = [
    { val: "95%", label: "Completion rate" },
    { val: "3×", label: "Faster onboarding" },
    { val: "<8 min", label: "Per module" },
    { val: "100%", label: "Audit-ready" },
  ];

  const dashRows = [
    { name: "Phishing Defense", pct: 88, color: blue },
    { name: "Password Hygiene", pct: 100, color: "#10b981", done: true },
    { name: "Data Protection", pct: 73, color: "#6366f1" },
    { name: "Incident Response", pct: 94, color: "#0891b2" },
  ];

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", color: text, transition: "background-color 0.35s, color 0.35s", overflowX: "hidden" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(28px,-38px) scale(1.04); }
          66% { transform: translate(-18px,18px) scale(0.97); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.52; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes badge-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes badge-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
        @keyframes badge-3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .primary-btn {
          background-image: linear-gradient(135deg, ${blueDeep} 0%, ${blue} 50%, ${blueDeep} 100%);
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
          transition: filter 0.18s, transform 0.18s;
        }
        .primary-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .ghost-btn { transition: background 0.18s, border-color 0.18s, transform 0.18s; }
        .ghost-btn:hover { background: rgba(14,165,233,0.07) !important; border-color: rgba(14,165,233,0.3) !important; transform: translateY(-1px); }
        .feature-card { transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease; cursor: default; }
        .feature-card:hover { transform: translateY(-6px); }
        @keyframes mod-orb { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,20px) scale(1.08); } }
        @keyframes mod-orb-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-25px) scale(1.05); } }
        @keyframes mod-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .mod-card-anim { animation: mod-fade-up 0.7s ease-out both; }
        .step-card { position: relative; transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease; overflow: hidden; }
        .step-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background-image: linear-gradient(90deg, ${blueDeep}, ${blue}, ${blueLight}); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
        .step-card:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(14,165,233,0.18) !important; border-color: rgba(14,165,233,0.35) !important; }
        .step-card:hover::before { transform: scaleX(1); }
        .step-card:hover .step-icon-badge { transform: rotate(-6deg) scale(1.06); }
        .step-icon-badge { transition: transform 0.3s ease; }
        .step-num { background: linear-gradient(135deg, ${blueDeep}, ${blue}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes step-pulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.15); opacity: 0.9; } }
        @keyframes step-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .step-card-anim { animation: step-fade-up 0.7s ease-out both; }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .headline-accent {
          background-image: linear-gradient(120deg, ${blueDeep} 0%, ${blueLight} 35%, #67e8f9 50%, ${blueLight} 65%, ${blueDeep} 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 6s ease-in-out infinite;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .hero-card-zoom { animation: float-card 6s ease-in-out infinite, scale-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both; }
      `}</style>

      <PublicNavbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO  —  2-column: text left, dashboard visual right
      ══════════════════════════════════════════════════════════════ */}
      <section id="platform" style={{ position: "relative", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "64px" }}>

        {/* Animated dot-grid background */}
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: dark ? "radial-gradient(circle, rgba(56,189,248,0.17) 1px, transparent 1px)" : "radial-gradient(circle, rgba(14,165,233,0.11) 1px, transparent 1px)", backgroundSize: "40px 40px", animation: "gridPulse 6s ease-in-out infinite" }} />

        {/* Ambient orbs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "8%", left: "4%", width: "520px", height: "520px", borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)" : "radial-gradient(circle, rgba(14,165,233,0.07), transparent 70%)", filter: "blur(2px)", animation: "floatOrb 22s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "8%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)", filter: "blur(2px)", animation: "floatOrb 28s ease-in-out infinite reverse" }} />
        </div>

        {/* 2-column grid — asymmetric: text 5fr, image 7fr */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1240px", margin: "0 auto", width: "100%", padding: "40px clamp(20px, 5vw, 56px) 110px", display: "grid", gridTemplateColumns: "minmax(320px, 5fr) minmax(360px, 7fr)", gap: "clamp(32px, 4vw, 56px)", alignItems: "center" }}>

          {/* ── Left: text ── */}
          <div style={{ opacity: mounted ? 1 : 0, animation: mounted ? "fadeUp 0.7s ease both" : "none" }}>

            {/* Badge with two-tone label */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: dark ? "rgba(14,165,233,0.08)" : "rgba(14,165,233,0.07)", border: `1px solid ${dark ? "rgba(14,165,233,0.2)" : "rgba(14,165,233,0.16)"}`, borderRadius: "100px", padding: "6px 16px 6px 10px", marginBottom: "28px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: blue, display: "inline-block", flexShrink: 0, animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}>
                <span style={{ color: dark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.55)" }}>EdLight</span>
                {" "}
                <span style={{ background: `linear-gradient(135deg, ${blueDeep}, ${blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Security Training</span>
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em", color: text, margin: "0 0 20px" }}>
              Security awareness<br />
              <span className="headline-accent">
                your team will finish.
              </span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 1.7vw, 17.5px)", color: textMuted, lineHeight: 1.7, maxWidth: "480px", margin: "0 0 30px", fontWeight: 400 }}>
              EdLight turns mandatory security training into short, engaging lessons with admin tracking, automated reminders, and audit-ready reports.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
              <Link href="/login" className="primary-btn" style={{ display: "inline-block", color: "#fff", fontWeight: 700, fontSize: "15px", padding: "13px 32px", borderRadius: "10px", textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 24px rgba(14,165,233,0.28)" }}>
                Start Training
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex" }}>
                {[["E","#0369a1"],["M","#6366f1"],["S","#0891b2"],["J","#7c3aed"]].map(([l, c], i) => (
                  <div key={i} style={{ width: "28px", height: "28px", borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}bb)`, border: `2px solid ${bg}`, marginLeft: i > 0 ? "-7px" : "0", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.3s" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "white" }}>{l}</span>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: "13px", color: textMuted }}>
                Trusted by <strong style={{ color: text, fontWeight: 700 }}>500+</strong> security teams
              </span>
            </div>
          </div>

          {/* ── Right: Dashboard illustration (zoomed) ── */}
          <div style={{ position: "relative", height: "clamp(520px, 62vw, 640px)", opacity: mounted ? 1 : 0, animation: mounted ? "fadeRight 0.9s ease 0.18s both" : "none" }}>

            {/* Spinning decorative rings behind card */}
            <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", width: "560px", height: "560px", transform: "translate(-50%, -50%)", borderRadius: "50%", border: `1px dashed ${dark ? "rgba(14,165,233,0.16)" : "rgba(14,165,233,0.13)"}`, animation: "spin-ring 40s linear infinite" }} />
            <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", width: "440px", height: "440px", transform: "translate(-50%, -50%)", borderRadius: "50%", border: `1px dashed ${dark ? "rgba(99,102,241,0.13)" : "rgba(99,102,241,0.1)"}`, animation: "spin-ring 30s linear infinite reverse" }} />

            {/* Floating notification chips */}
            <div style={{ position: "absolute", top: "4%", left: "-2%", zIndex: 10, background: cardBg, borderRadius: "12px", padding: "8px 14px", border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(16,185,129,0.14)", animation: "badge-1 4.5s ease-in-out infinite", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: "15px" }}>check_circle</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: text, whiteSpace: "nowrap" }}>Phishing module complete</span>
            </div>

            <div style={{ position: "absolute", top: "6%", right: "-1%", zIndex: 10, background: cardBg, borderRadius: "12px", padding: "8px 14px", border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(99,102,241,0.13)", animation: "badge-2 5.2s ease-in-out infinite", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#6366f1", fontSize: "15px" }}>notifications</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: text, whiteSpace: "nowrap" }}>Reminder sent to 3 users</span>
            </div>

            <div style={{ position: "absolute", bottom: "8%", right: "0%", zIndex: 10, background: cardBg, borderRadius: "12px", padding: "8px 14px", border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(14,165,233,0.13)", animation: "badge-3 3.8s ease-in-out infinite", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: blue, fontSize: "15px" }}>verified_user</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: text, whiteSpace: "nowrap" }}>Compliance report ready</span>
            </div>

            {/* Main dashboard card */}
            <div className="hero-card-zoom" style={{ position: "absolute", top: "30px", right: "-2%", left: "2%", bottom: "30px", background: cardBg, borderRadius: "22px", border: `1px solid ${border}`, boxShadow: dark ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" : "0 32px 80px rgba(14,165,233,0.18), 0 4px 16px rgba(14,165,233,0.08)", overflow: "hidden" }}>

              {/* Window chrome */}
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: "10px", background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => (
                    <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: "11.5px", color: textMuted, fontWeight: 500 }}>Security Training Dashboard</span>
              </div>

              {/* Card body */}
              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: text, marginBottom: "16px", letterSpacing: "-0.01em" }}>Team Progress · Q2 2026</div>

                {dashRows.map((row, i) => (
                  <div key={i} style={{ marginBottom: "13px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "12px", color: textMuted, fontWeight: 500 }}>{row.name}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: row.done ? "#10b981" : text }}>{row.pct}%{row.done ? " ✓" : ""}</span>
                    </div>
                    <div style={{ height: "5px", borderRadius: "99px", background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, borderRadius: "99px", background: row.color }} />
                    </div>
                  </div>
                ))}

                {/* Mini stat boxes */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "16px" }}>
                  {[
                    { val: "89%", label: "Avg score", color: blue },
                    { val: "47", label: "Completed", color: "#10b981" },
                    { val: "3", label: "Overdue", color: "#f59e0b" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center", padding: "10px 4px", borderRadius: "10px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}` }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.val}</div>
                      <div style={{ fontSize: "10px", color: textMuted, marginTop: "1px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini module list */}
                <div style={{ marginTop: "14px", padding: "12px", borderRadius: "10px", background: dark ? "rgba(14,165,233,0.06)" : "rgba(14,165,233,0.05)", border: `1px solid ${dark ? "rgba(14,165,233,0.12)" : "rgba(14,165,233,0.1)"}` }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: blue, marginBottom: "8px" }}>Next due</div>
                  {[
                    { name: "Password Security", due: "Apr 30", icon: "lock" },
                    { name: "Social Engineering", due: "May 15", icon: "psychology" },
                  ].map(m => (
                    <div key={m.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "13px", color: textMuted }}>{m.icon}</span>
                        <span style={{ fontSize: "11px", color: text }}>{m.name}</span>
                      </div>
                      <span style={{ fontSize: "10px", color: textMuted }}>{m.due}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: `1px solid ${border}`, background: dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ flex: "1 1 140px", textAlign: "center", padding: "18px 16px", borderRight: i < stats.length - 1 ? `1px solid ${border}` : "none" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: blue, letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ fontSize: "12px", color: textMuted, marginTop: "2px", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "100px clamp(20px, 6vw, 80px)", background: surface, borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>How It Works</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Up and running in minutes</h2>
            <p style={{ fontSize: "17px", color: textMuted, maxWidth: "460px", margin: "0 auto", lineHeight: 1.65 }}>Three simple steps to a fully compliant, trained workforce.</p>
          </div>

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
            {/* Connecting line */}
            <div aria-hidden style={{ position: "absolute", top: "60px", left: "15%", right: "15%", height: "2px", backgroundImage: `linear-gradient(90deg, transparent, ${blue}33, ${blue}55, ${blue}33, transparent)`, zIndex: 0, pointerEvents: "none" }} />

            {steps.map((s, i) => (
              <div
                key={i}
                className="step-card step-card-anim"
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "40px 32px 34px",
                  borderRadius: "20px",
                  background: dark ? "rgba(255,255,255,0.03)" : "#ffffff",
                  border: `1px solid ${border}`,
                  boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                {/* Icon badge with pulse ring */}
                <div style={{ position: "relative", display: "inline-flex", marginBottom: "22px" }}>
                  <span aria-hidden style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: `2px solid ${s.color}33`, animation: `step-pulse 2.6s ease-in-out ${i * 0.4}s infinite` }} />
                  <div
                    className="step-icon-badge"
                    style={{
                      position: "relative",
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      backgroundImage: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 8px 24px ${s.color}55`,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "28px" }}>{s.icon}</span>
                  </div>
                  {/* Step number chip */}
                  <span
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-14px",
                      minWidth: "28px",
                      height: "28px",
                      padding: "0 8px",
                      borderRadius: "999px",
                      background: dark ? "#0f1724" : "#ffffff",
                      border: `1.5px solid ${s.color}`,
                      color: s.color,
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-geist-mono), monospace",
                    }}
                  >
                    {s.num}
                  </span>
                </div>

                {/* Step label */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: s.color }}>Step {s.num}</span>
                  <span style={{ flex: 1, height: "1px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }} />
                </div>

                <h3 style={{ fontSize: "19px", fontWeight: 700, color: text, marginBottom: "10px", letterSpacing: "-0.02em" }}>{s.title}</h3>
                <p style={{ fontSize: "15px", color: textMuted, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MODULES
      ══════════════════════════════════════════════════════════════ */}
      <section id="modules" style={{ position: "relative", padding: "100px clamp(20px, 6vw, 80px)", background: bg, borderTop: `1px solid ${border}`, overflow: "hidden" }}>
        {/* Decorative orbs */}
        <div aria-hidden style={{ position: "absolute", top: "10%", right: "-120px", width: "360px", height: "360px", borderRadius: "50%", background: `radial-gradient(circle, ${blueLight}1f, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none", animation: "mod-orb 14s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "10%", left: "-140px", width: "320px", height: "320px", borderRadius: "50%", background: `radial-gradient(circle, #7c3aed1a, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none", animation: "mod-orb-2 16s ease-in-out infinite" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            {/* Eyebrow pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: dark ? "rgba(14,165,233,0.12)" : "rgba(14,165,233,0.08)", border: `1px solid ${dark ? "rgba(14,165,233,0.28)" : "rgba(14,165,233,0.22)"}`, marginBottom: "18px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px", color: blue }}>library_books</span>
              <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Training Modules</p>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Everything your team needs</h2>
            <p style={{ fontSize: "17px", color: textMuted, maxWidth: "520px", margin: "0 auto", lineHeight: 1.65 }}>Purpose-built security modules covering today&apos;s top threats. Short, interactive, and memorable.</p>

            {/* Summary stats */}
            <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "24px" }}>
              {[
                { icon: "auto_stories", label: "22 lessons" },
                { icon: "schedule", label: "67 min total" },
                { icon: "devices", label: "Any device" },
              ].map((s) => (
                <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", fontSize: "12.5px", fontWeight: 600, color: text, background: dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)", border: `1px solid ${border}` }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", color: blue }}>{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "22px" }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card mod-card-anim"
                onMouseEnter={() => setHoverCard(i)}
                onMouseLeave={() => setHoverCard(null)}
                style={{
                  position: "relative",
                  padding: "28px 26px 24px",
                  borderRadius: "18px",
                  background: dark ? (hoverCard === i ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)") : (hoverCard === i ? "#f8fafc" : "#ffffff"),
                  border: `1px solid ${hoverCard === i ? f.color + "55" : border}`,
                  boxShadow: hoverCard === i ? `0 0 0 1px ${f.color}22, 0 18px 48px ${f.glow}` : dark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {/* Top gradient accent */}
                <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundImage: `linear-gradient(90deg, ${f.color}, ${f.color}99, transparent)`, opacity: hoverCard === i ? 1 : 0.5, transition: "opacity 0.3s" }} />

                {/* Corner glow */}
                <div aria-hidden style={{ position: "absolute", top: "-40px", right: "-40px", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${f.color}22, transparent 70%)`, opacity: hoverCard === i ? 1 : 0, transition: "opacity 0.35s", pointerEvents: "none" }} />

                {/* Header: icon + level badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
                  <div
                    className="mod-icon"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      backgroundImage: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 8px 20px ${f.color}55`,
                      transform: hoverCard === i ? "rotate(-4deg) scale(1.06)" : "rotate(0) scale(1)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "24px" }}>{f.icon}</span>
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: f.color, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: "999px", background: f.color + "18", border: `1px solid ${f.color}33` }}>{f.level}</span>
                </div>

                <h3 style={{ fontSize: "17px", fontWeight: 700, color: text, marginBottom: "8px", letterSpacing: "-0.015em" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: textMuted, lineHeight: 1.62, margin: "0 0 18px" }}>{f.desc}</p>

                {/* Footer meta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: `1px dashed ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: textMuted, fontWeight: 600 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px", color: f.color }}>play_circle</span>
                      {f.lessons} lessons
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px", color: f.color }}>schedule</span>
                      {f.minutes} min
                    </span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: f.color, transform: hoverCard === i ? "translateX(3px)" : "translateX(0)", transition: "transform 0.25s ease" }}>arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOR ADMINS
      ══════════════════════════════════════════════════════════════ */}
      <section id="admins" style={{ padding: "100px clamp(20px, 6vw, 80px)", background: surfaceAlt, borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "64px", alignItems: "center" }}>

          <div>
            <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>For Admins</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 18px" }}>Full visibility.<br />Zero overhead.</h2>
            <p style={{ fontSize: "16px", color: textMuted, lineHeight: 1.72, marginBottom: "30px" }}>
              Assign training to any employee, department, or the whole company. Automated email reminders keep everyone on track. Export compliance reports for auditors in one click.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
              {["Real-time completion dashboard","Automated reminder emails","Per-employee progress and scores","One-click PDF compliance reports"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: textMuted }}>
                  <span className="material-symbols-outlined" style={{ color: blue, fontSize: "18px", flexShrink: 0 }}>check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Assignment & Team Management panel */}
          <div style={{ borderRadius: "20px", padding: "26px", background: dark ? "rgba(255,255,255,0.03)" : "#ffffff", border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 6px 32px rgba(14,165,233,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}>

            {/* Panel header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${blueDeep}, ${blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "20px" }}>admin_panel_settings</span>
                </div>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: text }}>Assign Training</div>
                  <div style={{ fontSize: "11px", color: textMuted }}>New campaign</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "99px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: "pulse-dot 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#10b981" }}>Live</span>
              </div>
            </div>

            {/* Module being assigned */}
            <div style={{ padding: "12px 14px", borderRadius: "11px", background: dark ? "rgba(14,165,233,0.07)" : "rgba(14,165,233,0.06)", border: `1px solid ${dark ? "rgba(14,165,233,0.18)" : "rgba(14,165,233,0.14)"}`, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="material-symbols-outlined" style={{ color: blue, fontSize: "20px" }}>shield_lock</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: text }}>Phishing Awareness 2026</div>
                <div style={{ fontSize: "11px", color: textMuted }}>8 min · Quiz included</div>
              </div>
              <span className="material-symbols-outlined" style={{ color: textMuted, fontSize: "16px" }}>chevron_right</span>
            </div>

            {/* Recipients list */}
            <div style={{ fontSize: "11px", fontWeight: 600, color: textMuted, marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Recipients</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
              {[
                { name: "All employees", count: "8 people", icon: "groups", clr: blue, status: "Selected" },
                { name: "New hires", count: "1 person", icon: "person_add", clr: "#6366f1", status: "Selected" },
                { name: "Team leads", count: "4 people", icon: "manage_accounts", clr: "#7c3aed", status: "Selected" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 11px", borderRadius: "9px", background: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: r.clr + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: r.clr, fontSize: "15px" }}>{r.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12.5px", fontWeight: 600, color: text, lineHeight: 1.2 }}>{r.name}</div>
                    <div style={{ fontSize: "10.5px", color: textMuted }}>{r.count}</div>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: blue, fontSize: "16px" }}>check_circle</span>
                </div>
              ))}
            </div>

            {/* Schedule + reminder toggles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              <div style={{ padding: "10px 11px", borderRadius: "9px", background: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)" }}>
                <div style={{ fontSize: "10px", color: textMuted, marginBottom: "3px", fontWeight: 500 }}>Due date</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: text, display: "flex", alignItems: "center", gap: "5px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "13px", color: blue }}>event</span>
                  May 15, 2026
                </div>
              </div>
              <div style={{ padding: "10px 11px", borderRadius: "9px", background: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)" }}>
                <div style={{ fontSize: "10px", color: textMuted, marginBottom: "3px", fontWeight: 500 }}>Auto-reminders</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: text, display: "flex", alignItems: "center", gap: "5px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "13px", color: "#10b981" }}>notifications_active</span>
                  Every 3 days
                </div>
              </div>
            </div>

            {/* Send button */}
            <button style={{ width: "100%", padding: "11px", borderRadius: "10px", backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blue})`, backgroundSize: "200% auto", color: "#fff", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer", letterSpacing: "-0.01em", animation: "shimmer 4s linear infinite", boxShadow: "0 4px 16px rgba(14,165,233,0.25)" }}>
              Send to 13 employees
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRIVACY & OWNERSHIP
      ══════════════════════════════════════════════════════════════ */}
      <section id="privacy" style={{ padding: "100px clamp(20px, 6vw, 80px)", background: surface, borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Privacy &amp; Ownership</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 18px" }}>
              Built and operated by the<br />
              <span style={{ backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EdLight Initiative.</span>
            </h2>
            <p style={{ fontSize: "16px", color: textMuted, lineHeight: 1.72, maxWidth: "640px", margin: "0 auto" }}>
              This platform is wholly owned and operated by the EdLight initiative. We do not sell, share, or monetize your organization's training data. Your team's progress, scores, and personal information stay private to your organization.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { icon: "verified_user", title: "Owned by EdLight", desc: "Independently operated. No third-party owners or investors influencing data policy." },
              { icon: "lock", title: "Your data stays private", desc: "Only EdLight employees can see your training information. Nothing is shared outside the company." },
              { icon: "block", title: "No ads, no selling", desc: "We never sell or share user data with advertisers, brokers, or third parties." },
              { icon: "encrypted", title: "Encrypted end-to-end", desc: "All data encrypted in transit and at rest. SOC 2 aligned, GDPR ready." },
            ].map((p, i) => (
              <div key={i} style={{ padding: "22px 20px", borderRadius: "14px", background: dark ? "rgba(255,255,255,0.025)" : "#ffffff", border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: dark ? "rgba(14,165,233,0.1)" : "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <span className="material-symbols-outlined" style={{ color: blue, fontSize: "20px" }}>{p.icon}</span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: text, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{p.title}</h3>
                <p style={{ fontSize: "13px", color: textMuted, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px clamp(20px, 6vw, 80px)", background: bg, borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 18px" }}>
            Ready to protect your organization?
          </h2>
          <p style={{ fontSize: "17px", color: textMuted, lineHeight: 1.65, marginBottom: "38px" }}>
            Sign in with your EdLight account and start your training in seconds.
          </p>
          <Link href="/login" className="primary-btn" style={{ display: "inline-block", color: "#fff", fontWeight: 700, fontSize: "16px", padding: "15px 40px", borderRadius: "12px", textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 28px rgba(14,165,233,0.28)" }}>
            Start Training
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
