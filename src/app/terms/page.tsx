"use client";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { useTheme } from "@/context/ThemeContext";

export default function TermsPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg = dark ? "#080c14" : "#ffffff";
  const surface = dark ? "#0f1724" : "#f8fafc";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const textMuted = dark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.6)";
  const blue = "#0ea5e9";
  const blueDeep = "#0369a1";
  const blueLight = "#38bdf8";

  const sections = [
    {
      title: "1. Acceptance of terms",
      body: "By accessing or using the EdLight Security Training platform (the \u201cService\u201d), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.",
    },
    {
      title: "2. The Service",
      body: "EdLight provides a security awareness training platform owned and operated by the EdLight initiative. The Service is intended for use by authorized employees of organizations that have an active EdLight workspace.",
    },
    {
      title: "3. Eligibility and accounts",
      body: "Access is granted by your organization's administrator. You are responsible for keeping your sign-in credentials confidential and for all activity under your account. Notify your administrator immediately if you suspect unauthorized access.",
    },
    {
      title: "4. Acceptable use",
      body: "You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized access to other accounts, systems, or networks; (c) interfere with or disrupt the Service; (d) reverse engineer, copy, or redistribute training content; or (e) misrepresent your identity or training results.",
    },
    {
      title: "5. Intellectual property",
      body: "All content, modules, designs, and software within the Service are the property of the EdLight initiative or its licensors and are protected by copyright and other intellectual property laws. You may use the content only for the purpose of completing assigned training within your organization.",
    },
    {
      title: "6. Training records and reporting",
      body: "Your organization's administrators may view your training progress, completion status, and quiz scores for compliance and reporting purposes. By using the Service, you acknowledge and consent to this internal visibility.",
    },
    {
      title: "7. Modifications to the Service",
      body: "We may update, modify, or discontinue features of the Service at any time to improve quality, security, or relevance. Significant changes affecting your organization will be communicated to administrators.",
    },
    {
      title: "8. Disclaimer of warranties",
      body: "The Service is provided on an \u201cas is\u201d and \u201cas available\u201d basis. While we strive for high availability and accuracy, EdLight does not warrant that the Service will be uninterrupted, error-free, or fully secure against all threats.",
    },
    {
      title: "9. Limitation of liability",
      body: "To the maximum extent permitted by law, the EdLight initiative is not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability is limited to the amounts (if any) paid by your organization for the Service in the prior 12 months.",
    },
    {
      title: "10. Termination",
      body: "Your organization or EdLight may terminate access to the Service at any time. Upon termination, your access will end and your training data will be retained or deleted in accordance with the Privacy Policy.",
    },
    {
      title: "11. Governing law",
      body: "These Terms are governed by the laws applicable to the EdLight initiative's principal place of operation, without regard to conflict-of-law principles.",
    },
    {
      title: "12. Contact",
      body: "Questions about these Terms? Email info@edlight.com or use the Contact form.",
    },
  ];

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", color: text, transition: "background-color 0.3s, color 0.3s" }}>
      <PublicNavbar />

      <section style={{ padding: "140px clamp(20px, 6vw, 80px) 70px", background: surface, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: blue, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Legal</p>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 800, color: text, letterSpacing: "-0.025em", margin: "0 0 14px", lineHeight: 1.1 }}>
            Terms of <span style={{ backgroundImage: `linear-gradient(135deg, ${blueDeep}, ${blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Service</span>
          </h1>
          <p style={{ fontSize: "14px", color: textMuted }}>Effective date: April 22, 2026</p>
        </div>
      </section>

      <section style={{ padding: "60px clamp(20px, 6vw, 80px) 110px", background: bg }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontSize: "16px", color: textMuted, lineHeight: 1.75, marginBottom: "40px" }}>
            These Terms govern your use of the EdLight Security Training platform. Please read them carefully.
          </p>

          {sections.map((s) => (
            <div key={s.title} style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "19px", fontWeight: 700, color: text, margin: "0 0 10px", letterSpacing: "-0.015em" }}>{s.title}</h2>
              <p style={{ fontSize: "15px", color: textMuted, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
