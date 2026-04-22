"use client";

import { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { useTheme } from "@/context/ThemeContext";

export default function ContactPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg = dark ? "#080c14" : "#ffffff";
  const surface = dark ? "#0f1724" : "#f8fafc";
  const cardBg = dark ? "rgba(15,23,42,0.96)" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const textMuted = dark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.5)";
  const inputBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)";
  const blue = "#0ea5e9";
  const blueDeep = "#0369a1";
  const blueLight = "#38bdf8";

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("sending");

    // Open the user's mail client with a pre-filled message to info@edlight.com
    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:info@edlight.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    }, 600);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    color: text,
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: "10px",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.18s, box-shadow 0.18s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12.5px",
    fontWeight: 600,
    color: text,
    marginBottom: "8px",
    letterSpacing: "-0.01em",
  };

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", color: text, transition: "background-color 0.3s, color 0.3s" }}>
      <PublicNavbar />

      <section style={{ padding: "140px clamp(20px, 6vw, 80px) 80px", background: surface, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Contact Us</p>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 18px", lineHeight: 1.1 }}>
            Get in touch with the<br />
            <span style={{ backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EdLight team.</span>
          </h1>
          <p style={{ fontSize: "16px", color: textMuted, lineHeight: 1.7 }}>
            Questions about the platform, deployment, or training content? Send us a message and we&apos;ll get back to you within one business day.
          </p>
        </div>
      </section>

      <section style={{ padding: "70px clamp(20px, 6vw, 80px) 110px", background: bg }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "32px", borderRadius: "18px", background: cardBg, border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 8px 32px rgba(14,165,233,0.08)" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: text, margin: "0 0 22px", letterSpacing: "-0.01em" }}>Send a message</h2>

            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="name" style={labelStyle}>Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${blue}22`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@company.com"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${blue}22`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="message" style={labelStyle}>Message</label>
              <textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${blue}22`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 12px", borderRadius: "9px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            {status === "sent" && (
              <div style={{ padding: "10px 12px", borderRadius: "9px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontSize: "13px", marginBottom: "16px" }}>
                Your mail client should now be open with the message ready to send.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blue})`,
                backgroundSize: "200% auto",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14.5px",
                border: "none",
                cursor: status === "sending" ? "wait" : "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 18px rgba(14,165,233,0.28)",
                transition: "filter 0.18s, transform 0.18s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {status === "sending" ? "Opening mail client…" : "Send message"}
            </button>
          </form>

          {/* Side info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ padding: "24px", borderRadius: "16px", background: cardBg, border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: dark ? "rgba(14,165,233,0.1)" : "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <span className="material-symbols-outlined" style={{ color: blue, fontSize: "22px" }}>mail</span>
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: text, margin: "0 0 6px" }}>Email</h3>
              <a href="mailto:info@edlight.com" style={{ fontSize: "14px", color: blue, textDecoration: "none" }}>info@edlight.com</a>
            </div>

            <div style={{ padding: "24px", borderRadius: "16px", background: cardBg, border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <span className="material-symbols-outlined" style={{ color: "#6366f1", fontSize: "22px" }}>schedule</span>
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: text, margin: "0 0 6px" }}>Response time</h3>
              <p style={{ fontSize: "14px", color: textMuted, lineHeight: 1.6, margin: 0 }}>Within one business day, Monday through Friday.</p>
            </div>

            <div style={{ padding: "24px", borderRadius: "16px", background: cardBg, border: `1px solid ${border}`, boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: dark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <span className="material-symbols-outlined" style={{ color: "#7c3aed", fontSize: "22px" }}>verified_user</span>
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: text, margin: "0 0 6px" }}>EdLight Initiative</h3>
              <p style={{ fontSize: "14px", color: textMuted, lineHeight: 1.6, margin: 0 }}>This platform is wholly owned and operated by the EdLight initiative.</p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
