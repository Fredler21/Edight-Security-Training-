import { cn } from "@/lib/cn";

type BadgeVariant = "not_started" | "in_progress" | "completed" | "active" | "inactive";

const variantStyles: Record<BadgeVariant, string> = {
  not_started: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  completed: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  active: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  inactive: "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const variantLabels: Record<BadgeVariant, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  active: "Active",
  inactive: "Inactive",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export default function StatusBadge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "completed" || variant === "active"
            ? "bg-teal-500"
            : variant === "in_progress"
            ? "bg-amber-500"
            : variant === "inactive"
            ? "bg-red-500"
            : "bg-slate-400"
        )}
      />
      {label ?? variantLabels[variant]}
    </span>
  );
}
