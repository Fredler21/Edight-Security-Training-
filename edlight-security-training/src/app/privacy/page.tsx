"use client";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { useTheme } from "@/context/ThemeContext";

export default function PrivacyPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg = dark ? "#080c14" : "#ffffff";
  const surface = dark ? "#0f1724" : "#f8fafc";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const textMuted = dark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.65)";
  const blue = "#0ea5e9";
  const blueDeep = "#0369a1";
  const blueLight = "#38bdf8";

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", color: text, transition: "background-color 0.3s, color 0.3s" }}>
      <PublicNavbar />

      <section style={{ padding: "140px clamp(20px, 6vw, 80px) 70px", background: surface, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Legal</p>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 14px", lineHeight: 1.1 }}>
            Privacy <span style={{ backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Policy</span>
          </h1>
          <p style={{ fontSize: "14px", color: textMuted }}>Effective date: April 22, 2026</p>
        </div>
      </section>

      <section style={{ padding: "60px clamp(20px, 6vw, 80px) 110px", background: bg }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontSize: "16px", color: textMuted, lineHeight: 1.85 }}>
            This website is for EdLight employees only. We use it to teach you how to keep your computer, your email, and the EdLight tools you use every day safe. We only collect the basic information needed to run the training, like your name, your work email, and your progress in each module. We do not share your data with anyone outside EdLight, we do not sell it, and we do not use it for advertising. Your training records stay inside EdLight and are used only to help you learn and to confirm that you completed the training. If you have any questions about your data or this policy, please email <a href="mailto:info@edlight.com" style={{ color: blue, textDecoration: "none" }}>info@edlight.com</a>.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
