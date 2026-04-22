"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function PublicFooter() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const border = dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.08)";
  const bg = dark ? "#000000" : "#f8fafc";
  const textMid = dark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.45)";
  const textSub = dark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.25)";

  return (
    <footer style={{ borderTop: `1px solid ${border}`, padding: "52px clamp(24px, 5vw, 64px)", backgroundColor: bg, transition: "background-color 0.3s" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px" }}>
            <Image
              src={dark ? "/edlight-logo-white.png" : "/edlight-logo-navy.png"}
              alt="EdLight logo"
              width={20}
              height={20}
            />
            <span style={{ fontSize: "14px", fontWeight: 600, color: textMid, letterSpacing: "-0.01em" }}>
              EdLight Security Training
            </span>
          </div>
          <p style={{ fontSize: "12px", color: textSub, maxWidth: "300px", lineHeight: 1.6 }}>
            Building security-aware organizations through practical, people-first training.
          </p>
        </div>

        {/* Links + copyright */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "14px" }}>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Contact", href: "/contact" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{ fontSize: "13px", color: textSub, textDecoration: "none" }}>
                {item.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: textSub }}>
            © {new Date().getFullYear()} EdLight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
