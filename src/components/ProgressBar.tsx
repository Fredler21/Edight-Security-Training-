import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number; // 0–100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const trackHeight =
    size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{clamped}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-slate-100", trackHeight)}>
        <div
          className={cn(
            "rounded-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500",
            trackHeight
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
