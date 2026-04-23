import DashboardSidebar from "@/components/DashboardSidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#050810" }}>
        <DashboardSidebar />
        <main style={{ flex: 1, minWidth: 0, overflow: "auto", position: "relative" }}>
          {/* Ambient glow */}
          <div aria-hidden style={{ position: "fixed", top: "10%", right: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
          <div aria-hidden style={{ position: "fixed", bottom: "10%", left: "30%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
