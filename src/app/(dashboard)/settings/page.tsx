import { Settings, Bell, Shield, Users, Eye } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
          Configuration
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-4">
        {[
          {
            icon: Shield,
            title: "Security & Privacy",
            description: "Manage authentication settings and privacy preferences.",
            tag: "Employee",
          },
          {
            icon: Bell,
            title: "Notifications",
            description: "Control how and when you receive training reminders.",
            tag: "Employee",
          },
          {
            icon: Users,
            title: "Role Management",
            description: "Assign and manage employee and admin roles.",
            tag: "Admin Only",
            locked: true,
          },
          {
            icon: Eye,
            title: "Module Visibility",
            description: "Control which modules are visible to employees.",
            tag: "Admin Only",
            locked: true,
          },
          {
            icon: Settings,
            title: "Platform Settings",
            description: "Configure branding, sync settings, and integrations.",
            tag: "Super Admin",
            locked: true,
          },
        ].map(({ icon: Icon, title, description, tag, locked }) => (
          <div
            key={title}
            className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 ${
              locked ? "opacity-60" : ""
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                    locked
                      ? "bg-slate-100 text-slate-500"
                      : "bg-teal-50 text-teal-700"
                  }`}
                >
                  {tag}
                </span>
              </div>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
            {locked && (
              <div className="flex-shrink-0 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                Requires Admin
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center">
        Full settings management will be available in the Admin Dashboard (V3).
      </p>
    </div>
  );
}
