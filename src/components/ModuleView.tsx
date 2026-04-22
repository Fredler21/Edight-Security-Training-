"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Loader2,
  Lock,
} from "lucide-react";
import { TrainingModule } from "@/types";
import QuizSection from "@/components/QuizSection";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/AuthContext";
import { saveModuleCompletion } from "@/lib/firestore";
import { modules } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";

type Tab = "lecture" | "quiz";

interface ModuleViewProps {
  module: TrainingModule;
}

function renderLecture(content: string) {
  const lines = content.trim().split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className="text-[15px] font-semibold text-slate-800 mt-6 mb-2">
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="font-semibold text-slate-900 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ")) {
      const text = line.replace("- ", "");
      const parts = text.split(/\*\*(.*?)\*\*/);
      return (
        <li key={i} className="text-[15px] text-slate-600 leading-relaxed mb-1.5 flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0" />
          <span>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-slate-800">{part}</strong> : part
            )}
          </span>
        </li>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    const parts = line.split(/\*\*(.*?)\*\*/);
    return (
      <p key={i} className="text-[15px] text-slate-600 leading-relaxed mb-2">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="text-slate-800">{part}</strong> : part
        )}
      </p>
    );
  });
}

export default function ModuleView({ module }: ModuleViewProps) {
  const { user } = useAuth();
  const { getModuleProgress, loading: progressLoading } = useProgress(user?.uid);
  const [activeTab, setActiveTab] = useState<Tab>("lecture");
  const [lectureRead, setLectureRead] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Find the previous module (by order)
  const previousModule = modules.find((m) => m.order === module.order - 1);
  const isLocked =
    !progressLoading &&
    previousModule !== undefined &&
    getModuleProgress(previousModule.id).status !== "completed";

  function handleQuizComplete(score: number) {
    setQuizScore(score);
  }

  async function handleMarkComplete() {
    if (!user || quizScore === null) return;
    setSaving(true);
    try {
      await saveModuleCompletion(user.uid, module.id, quizScore, modules.length, module.title);
      setCompleted(true);
    } finally {
      setSaving(false);
    }
  }

  const colorMap: Record<string, string> = {
    teal: "from-teal-600 to-teal-700",
    red: "from-red-500 to-red-700",
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-purple-700",
    green: "from-green-500 to-green-700",
  };
  const gradientClass = colorMap[module.color] ?? colorMap.teal;

  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/modules"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Modules
      </Link>

      {/* Locked state */}
      {isLocked && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <Lock className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Module Locked</h2>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            You must complete{" "}
            <span className="font-semibold text-slate-700">
              Module {previousModule!.order} — {previousModule!.title}
            </span>{" "}
            before accessing this module.
          </p>
          <Link
            href={`/modules/${previousModule!.slug}`}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
          >
            Go to Module {previousModule!.order} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Module content — only shown when unlocked */}
      {!isLocked && (
      <>
      <div className={`bg-gradient-to-r ${gradientClass} rounded-2xl overflow-hidden mb-8 shadow-lg`}>
        {/* AI-generated module image */}
        <div className="relative w-full h-52 sm:h-64">
          <Image
            src={module.image}
            alt={`${module.title} — module illustration`}
            fill
            className="object-cover"
            priority
          />
          {/* gradient overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1.5">
              Module {module.order}
            </p>
            <h1 className="text-2xl font-bold text-white mb-1">{module.title}</h1>
          </div>
        </div>
        {/* Lower strip */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-white/80 leading-relaxed max-w-xl">{module.description}</p>
          <div className="flex items-center gap-4 text-sm text-white/70 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>~{module.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              <span>{module.questions.length} questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {completed && (
        <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-5 py-4 mb-8">
          <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-teal-800">Module Completed!</p>
            <p className="text-xs text-teal-600">
              {quizScore !== null ? `You scored ${quizScore}% on the quiz.` : "Great job finishing this module."}
            </p>
          </div>
          <Link
            href="/modules"
            className="ml-auto text-sm font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
          >
            Next Module <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        {(["lecture", "quiz"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px",
              activeTab === tab
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            {tab === "lecture" ? (
              <BookOpen className="h-4 w-4" />
            ) : (
              <HelpCircle className="h-4 w-4" />
            )}
            {tab === "lecture" ? "Lecture" : "Quiz"}
            {tab === "quiz" && quizScore !== null && (
              <span className="ml-1 text-xs bg-teal-100 text-teal-700 rounded-full px-2 py-0.5">
                {quizScore}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lecture Tab */}
      {activeTab === "lecture" && (
        <div>
          <div className="prose-like">
            {renderLecture(module.lectureContent)}
          </div>

          {/* Key Takeaways */}
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {module.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Real-Life Example */}
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="text-[15px] font-semibold text-amber-900">
                Real-Life Example: {module.realLifeExample.title}
              </h3>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed mb-4">
              {module.realLifeExample.scenario}
            </p>
            <div className="border-t border-amber-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                The Lesson
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                {module.realLifeExample.lesson}
              </p>
            </div>
          </div>

          {/* Continue to Quiz */}
          <div className="mt-8 flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div>
              <p className="text-[15px] font-semibold text-slate-900">Ready for the quiz?</p>
              <p className="text-sm text-slate-500">
                Test your knowledge with {module.questions.length} questions.
              </p>
            </div>
            <button
              onClick={() => {
                setLectureRead(true);
                setActiveTab("quiz");
              }}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              Take Quiz <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === "quiz" && (
        <div>
          {!lectureRead && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5 mb-6">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                We recommend reading the lecture before attempting the quiz.{" "}
                <button
                  onClick={() => setActiveTab("lecture")}
                  className="font-semibold hover:underline"
                >
                  Go to lecture
                </button>
              </p>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <QuizSection
              questions={module.questions}
              onComplete={(score) => {
                handleQuizComplete(score);
              }}
            />
          </div>

          {quizScore !== null && !completed && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleMarkComplete}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {saving ? "Saving…" : "Mark Module as Complete"}
              </button>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}
