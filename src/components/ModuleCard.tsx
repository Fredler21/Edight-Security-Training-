import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import { TrainingModule, ModuleStatus } from "@/types";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/cn";

const colorMap: Record<string, string> = {
  teal: "bg-teal-50 text-teal-600 border-teal-100",
  red: "bg-red-50 text-red-600 border-red-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  green: "bg-green-50 text-green-600 border-green-100",
};

interface ModuleCardProps {
  module: TrainingModule;
  status?: ModuleStatus;
  progress?: number;
}

export default function ModuleCard({
  module,
  status = "not_started",
  progress = 0,
}: ModuleCardProps) {
  const iconStyle = colorMap[module.color] ?? colorMap.teal;

  return (
    <Link
      href={`/modules/${module.slug}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-36 bg-slate-100">
        <Image
          src={module.image}
          alt={`${module.title} illustration`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge variant={status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
      {/* icon + order row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={cn(
            "h-8 w-8 rounded-lg border flex items-center justify-center text-base flex-shrink-0",
            iconStyle
          )}
        >
          {module.icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Module {module.order}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
          {module.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>

      {/* Progress */}
      {status === "in_progress" && (
        <div className="mt-4">
          <ProgressBar value={progress} size="sm" showLabel />
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{module.estimatedMinutes} min</span>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium transition-colors",
            status === "completed"
              ? "text-teal-600"
              : "text-slate-400 group-hover:text-teal-600"
          )}
        >
          {status === "completed" ? "Review" : status === "in_progress" ? "Continue" : "Start"}
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
      </div>{/* end body */}
    </Link>
  );
}
