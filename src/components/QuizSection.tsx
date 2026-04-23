"use client";

import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { QuizQuestion } from "@/types";
import { cn } from "@/lib/cn";

// You can miss at most this many questions and still pass.
const MAX_WRONG_TO_PASS = 1;
// How many questions to show per attempt (sampled from the pool).
const QUESTIONS_PER_ATTEMPT = 5;

function sampleQuestions(pool: QuizQuestion[], count: number): QuizQuestion[] {
  if (pool.length <= count) return [...pool];
  // Fisher–Yates partial shuffle.
  const arr = [...pool];
  for (let i = arr.length - 1; i > arr.length - 1 - count; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(arr.length - count);
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizSection({ questions: pool, onComplete }: QuizSectionProps) {
  const [attemptKey, setAttemptKey] = useState(0);
  const questions = useMemo(
    () => sampleQuestions(pool, QUESTIONS_PER_ATTEMPT),
    // Re-sample whenever the attempt key changes (initial mount + each retake).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, attemptKey]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const question = questions[currentIndex];
  const isCorrect = selected === question?.correctAnswer;

  useEffect(() => {
    if (!checked) return;
    setFeedback(isCorrect ? "correct" : "wrong");
    const t = setTimeout(() => setFeedback(null), 900);
    return () => clearTimeout(t);
  }, [checked, isCorrect]);

  function handleSelect(option: string) {
    if (checked) return;
    setSelected(option);
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
  }

  function handleNext() {
    setAnswers((prev) => [...prev, { correct: selected === question.correctAnswer }]);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      setFinished(true);
      const correctCount =
        answers.filter((a) => a.correct).length +
        (selected === question.correctAnswer ? 1 : 0);
      const wrongCount = questions.length - correctCount;
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = wrongCount <= MAX_WRONG_TO_PASS;
      onComplete(score, passed);
    }
  }

  function handleRetake() {
    setCurrentIndex(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
    setFinished(false);
    setFeedback(null);
    // Bump attempt key so a new random sample is drawn from the pool.
    setAttemptKey((k) => k + 1);
  }

  if (finished) {
    const correctCount = answers.filter((a) => a.correct).length;
    const wrongCount = questions.length - correctCount;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = wrongCount <= MAX_WRONG_TO_PASS;
    return (
      <div className="text-center py-8">
        <style>{`
          @keyframes quiz-pop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
        `}</style>
        <div
          style={{ animation: "quiz-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
          className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4",
            passed ? "bg-emerald-50" : "bg-rose-50"
          )}
        >
          {passed ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          ) : (
            <XCircle className="h-8 w-8 text-rose-500" />
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {passed ? "Nicely done." : "Almost there — give it another go."}
        </h3>
        <p className="text-slate-500 mb-1">You scored</p>
        <p
          className={cn(
            "text-4xl font-bold mb-3",
            passed ? "text-emerald-600" : "text-rose-500"
          )}
        >
          {score}%
        </p>
        <p className="text-sm text-slate-500 mb-6">
          {correctCount} of {questions.length} questions correct
          {!passed && (
            <>
              <br />
              <span className="text-rose-500 font-medium">
                You missed {wrongCount} questions. You may miss at most {MAX_WRONG_TO_PASS} to pass.
              </span>
            </>
          )}
        </p>
        {!passed && (
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(feedback === "wrong" && "quiz-shake")}>
      <style>{`
        @keyframes quiz-shake { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-8px); } 30% { transform: translateX(7px); } 45% { transform: translateX(-5px); } 60% { transform: translateX(4px); } 75% { transform: translateX(-2px); } }
        @keyframes quiz-bounce { 0% { transform: scale(1); } 30% { transform: scale(1.04); } 60% { transform: scale(0.99); } 100% { transform: scale(1); } }
        @keyframes quiz-glow { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.55); } 70% { box-shadow: 0 0 0 14px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
        @keyframes quiz-burst { 0% { transform: scale(0.4); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes quiz-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .quiz-shake { animation: quiz-shake 0.5s ease-in-out; }
        .quiz-correct { animation: quiz-bounce 0.5s ease-out, quiz-glow 0.9s ease-out; }
        .quiz-burst { animation: quiz-burst 0.7s ease-out forwards; }
        .quiz-feedback { animation: quiz-fade-in 0.25s ease-out both; }
      `}</style>

      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-medium text-slate-600">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors",
                i < currentIndex
                  ? answers[i]?.correct
                    ? "bg-emerald-500"
                    : "bg-rose-400"
                  : i === currentIndex
                  ? "bg-sky-400"
                  : "bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="text-[15px] font-semibold text-slate-900 mb-5 leading-relaxed">
        {question.question}
      </p>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isRight = checked && option === question.correctAnswer;
          const isWrong = checked && isSelected && option !== question.correctAnswer;

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={checked}
              className={cn(
                "relative w-full text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition-all",
                isRight
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 quiz-correct"
                  : isWrong
                  ? "border-rose-300 bg-rose-50 text-rose-800"
                  : isSelected
                  ? "border-sky-400 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {isRight && (
                <span
                  aria-hidden
                  className="quiz-burst absolute inset-0 rounded-xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(16,185,129,0.35), transparent 60%)" }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 flex-shrink-0",
                    isRight
                      ? "border-emerald-500 bg-emerald-500"
                      : isWrong
                      ? "border-rose-500 bg-rose-500"
                      : isSelected
                      ? "border-sky-500 bg-sky-500"
                      : "border-slate-300 bg-white"
                  )}
                />
                {option}
                {isRight && <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600" />}
                {isWrong && <XCircle className="ml-auto h-4 w-4 text-rose-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {checked && (
        <div
          className={cn(
            "quiz-feedback rounded-xl border p-4 mb-6",
            isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
          )}
        >
          <p className={cn("text-sm font-semibold mb-1", isCorrect ? "text-emerald-800" : "text-rose-700")}>
            {isCorrect ? "That's it." : "Not quite, here's why."}
          </p>
          <p className={cn("text-sm leading-relaxed", isCorrect ? "text-emerald-700" : "text-rose-600")}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">
          {selected && !checked ? "Ready to check?" : !selected ? "Pick an answer to continue." : ""}
        </span>
        <div className="flex gap-3">
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!selected}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              {currentIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
