"use client";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { useTheme } from "@/context/ThemeContext";

export default function PrivacyPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg = dark ? "#080c14" : "#ffffff";
  const surface = dark ? "#0f1724" : "#f8fafc";
  const cardBg = dark ? "rgba(15,23,42,0.9)" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const textMuted = dark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.65)";
  const blue = "#0ea5e9";
  const blueDeep = "#0369a1";
  const blueLight = "#38bdf8";

  const promises = [
    { icon: "shield_lock", title: "EdLight only", body: "Built for EdLight employees, no outside access." },
    { icon: "block", title: "No selling", body: "We never sell, rent, or share your data." },
    { icon: "ads_click", title: "No ads", body: "No advertising and no behavioral tracking." },
    { icon: "encrypted", title: "Encrypted", body: "All data is encrypted in transit and at rest." },
  ];

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", color: text, transition: "background-color 0.3s, color 0.3s", overflowX: "hidden" }}>
      <style>{`
        @keyframes priv-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes priv-float-orb { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-30px) scale(1.08); } }
        @keyframes priv-float-orb-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-25px,20px) scale(1.05); } }
        @keyframes priv-pulse-ring { 0% { transform: scale(0.95); opacity: 0.5; } 70% { transform: scale(1.4); opacity: 0; } 100% { opacity: 0; } }
        @keyframes priv-shield-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes priv-gradient-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .priv-fade { animation: priv-fade-up 0.8s ease-out both; }
        .priv-fade-1 { animation-delay: 0.05s; }
        .priv-fade-2 { animation-delay: 0.18s; }
        .priv-fade-3 { animation-delay: 0.32s; }
        .priv-fade-4 { animation-delay: 0.45s; }
        .priv-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .priv-card:hover { transform: translateY(-4px); border-color: rgba(14,165,233,0.45); box-shadow: 0 12px 36px rgba(14,165,233,0.16); }
        .priv-headline-grad {
          background-image: linear-gradient(120deg, ${blueDeep} 0%, ${blue} 35%, ${blueLight} 65%, ${blueDeep} 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: priv-gradient-shift 7s ease-in-out infinite;
        }
      `}</style>

      <PublicNavbar />

      {/* Hero */}
      <section style={{ position: "relative", padding: "140px clamp(20px, 6vw, 80px) 90px", background: surface, borderBottom: `1px solid ${border}`, overflow: "hidden" }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "320px", height: "320px", borderRadius: "50%", background: `radial-gradient(circle, ${blueLight}33, transparent 70%)`, filter: "blur(20px)", animation: "priv-float-orb 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: `radial-gradient(circle, ${blueDeep}33, transparent 70%)`, filter: "blur(20px)", animation: "priv-float-orb-2 12s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Animated shield icon */}
          <div className="priv-fade priv-fade-1" style={{ position: "relative", display: "inline-flex", marginBottom: "22px" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${blue}55`, animation: "priv-pulse-ring 2.6s ease-out infinite" }} />
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${blue}55`, animation: "priv-pulse-ring 2.6s ease-out 1.3s infinite" }} />
            <div style={{ width: "76px", height: "76px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blue})`, boxShadow: `0 8px 28px ${blue}55`, animation: "priv-shield-bob 3.2s ease-in-out infinite" }}>
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "38px" }}>shield_person</span>
            </div>
          </div>

          <p className="priv-fade priv-fade-1" style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Legal</p>
          <h1 className="priv-fade priv-fade-2" style={{ fontSize: "clamp(36px, 5.5vw, 56px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 16px", lineHeight: 1.08 }}>
            Privacy <span className="priv-headline-grad">Policy</span>
          </h1>
          <p className="priv-fade priv-fade-3" style={{ fontSize: "15px", color: textMuted, marginBottom: "24px" }}>Effective date: April 22, 2026</p>

          {/* Trust badges */}
          <div className="priv-fade priv-fade-4" style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {["EdLight only", "No selling", "Encrypted", "No ads"].map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, color: text, background: dark ? "rgba(14,165,233,0.1)" : "rgba(14,165,233,0.08)", border: `1px solid ${dark ? "rgba(14,165,233,0.25)" : "rgba(14,165,233,0.2)"}` }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: blue }} />
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Promise cards */}
      <section style={{ padding: "60px clamp(20px, 6vw, 80px) 20px", background: bg }}>
        <div style={{ maxWidth: "920px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {promises.map((p, i) => (
            <div
              key={p.title}
              className="priv-card priv-fade"
              style={{
                padding: "22px",
                borderRadius: "16px",
                background: cardBg,
                border: `1px solid ${border}`,
                animationDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `linear-gradient(135deg, ${blueDeep}22, ${blue}22)`, marginBottom: "14px" }}>
                <span className="material-symbols-outlined" style={{ color: blue, fontSize: "22px" }}>{p.icon}</span>
              </div>
              <h3 style={{ fontSize: "14.5px", fontWeight: 700, color: text, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{p.title}</h3>
              <p style={{ fontSize: "13px", color: textMuted, lineHeight: 1.55, margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main paragraph card */}
      <section style={{ padding: "40px clamp(20px, 6vw, 80px) 70px", background: bg }}>
        <div className="priv-fade" style={{ maxWidth: "780px", margin: "0 auto", animationDelay: "0.5s" }}>
          <div style={{ position: "relative", padding: "40px clamp(24px, 4vw, 44px)", borderRadius: "20px", background: cardBg, border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 8px 32px rgba(14,165,233,0.08)", overflow: "hidden" }}>
            {/* Gradient accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundImage: `linear-gradient(90deg, ${blueDeep}, ${blue}, ${blueLight})` }} />

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <span className="material-symbols-outlined" style={{ color: blue, fontSize: "22px" }}>info</span>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: text, margin: 0, letterSpacing: "-0.01em" }}>What you should know</h2>
            </div>

            <p style={{ fontSize: "16px", color: textMuted, lineHeight: 1.85, margin: 0 }}>
              This website is for EdLight employees only. We use it to teach you how to keep your computer, your email, and the EdLight tools you use every day safe. We only collect the basic information needed to run the training, like your name, your work email, and your progress in each module. We do not share your data with anyone outside EdLight, we do not sell it, and we do not use it for advertising. Your training records stay inside EdLight and are used only to help you learn and to confirm that you completed the training.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ padding: "10px clamp(20px, 6vw, 80px) 110px", background: bg }}>
        <div className="priv-fade" style={{ maxWidth: "780px", margin: "0 auto", animationDelay: "0.6s" }}>
          <div style={{ padding: "28px clamp(24px, 4vw, 36px)", borderRadius: "18px", backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blue})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "18px", boxShadow: `0 12px 36px ${blue}40` }}>
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.01em" }}>Questions about your data?</h3>
              <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>Reach out and we will get back to you.</p>
            </div>
            <a
              href="mailto:info@edlight.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 20px",
                borderRadius: "10px",
                background: "#fff",
                color: blueDeep,
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.18)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mail</span>
              info@edlight.com
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
