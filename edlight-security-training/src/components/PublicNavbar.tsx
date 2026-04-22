"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, ArrowLeft } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/#platform" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Modules", href: "/#modules" },
  { label: "For Admins", href: "/#admins" },
];

export default function PublicNavbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const dark = theme === "dark";

  const bg = dark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.85)";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const shimmerTop = dark ? "rgba(56,189,248,0.4)" : "rgba(14,165,233,0.35)";
  const logoColor = dark ? "#f5f5f5" : "#0f172a";
  const linkColor = dark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.5)";
  const linkHover = dark ? "#ffffff" : "#0f172a";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        backgroundColor: bg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${border}`,
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      {/* Shimmer accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent, ${shimmerTop}, transparent)` }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 clamp(24px, 5vw, 56px)", height: "64px", maxWidth: "1280px", margin: "0 auto" }}>

        {/* Left cluster: back button + logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              border: `1px solid ${border}`,
              backgroundColor: "transparent",
              cursor: "pointer",
              color: linkColor,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"; e.currentTarget.style.color = logoColor; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = linkColor; }}
          >
            <ArrowLeft size={15} />
          </button>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image
            src={dark ? "/edlight-logo-white.png" : "/edlight-logo-navy.png"}
            alt="EdLight logo"
            width={28}
            height={28}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: logoColor, letterSpacing: "-0.01em", transition: "color 0.3s" }}>
              EdLight
            </span>
            <span style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              backgroundImage: "linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Security Training
            </span>
          </div>
        </Link>
        </div>

        {/* Center nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: "13.5px",
                fontWeight: 500,
                color: linkColor,
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "color 0.18s, background-color 0.18s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = linkHover;
                e.currentTarget.style.backgroundColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = linkColor;
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {/* Dark/light toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              border: `1px solid ${border}`,
              backgroundColor: "transparent",
              cursor: "pointer",
              color: linkColor,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"; e.currentTarget.style.color = logoColor; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = linkColor; }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            href="/login"
            style={{ fontSize: "13.5px", fontWeight: 500, color: linkColor, padding: "8px 14px", borderRadius: "8px", textDecoration: "none", transition: "color 0.18s" }}
          >
            Sign In
          </Link>

          <Link
            href="/login"
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#ffffff",
              backgroundImage: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 50%, #0369a1 100%)",
              backgroundSize: "200% auto",
              padding: "9px 20px",
              borderRadius: "9px",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 0 0 1px rgba(14,165,233,0.3), 0 4px 16px rgba(14,165,233,0.18)",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Start Training
          </Link>
        </div>
      </div>
    </header>
  );
}
