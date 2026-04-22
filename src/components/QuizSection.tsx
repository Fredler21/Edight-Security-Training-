"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { QuizQuestion } from "@/types";
import { cn } from "@/lib/cn";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function QuizSection({ questions, onComplete }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isCorrect = selected === question?.correctAnswer;
  const allAnswered = answers.length === questions.length;

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
      const correctCount = answers.filter((a) => a.correct).length + (selected === question.correctAnswer ? 1 : 0);
      onComplete(Math.round((correctCount / questions.length) * 100));
    }
  }

  if (finished) {
    const score = Math.round(
      (answers.filter((a) => a.correct).length / questions.length) * 100
    );
    return (
      <div className="text-center py-8">
        <div
          className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4",
            score >= 75 ? "bg-teal-50" : "bg-amber-50"
          )}
        >
          {score >= 75 ? (
            <CheckCircle2 className="h-8 w-8 text-teal-600" />
          ) : (
            <XCircle className="h-8 w-8 text-amber-500" />
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {score >= 75 ? "Great work!" : "Keep Practicing"}
        </h3>
        <p className="text-slate-500 mb-1">You scored</p>
        <p className="text-4xl font-bold text-teal-600 mb-4">{score}%</p>
        <p className="text-sm text-slate-500">
          {answers.filter((a) => a.correct).length} of {questions.length} questions correct
        </p>
      </div>
    );
  }

  return (
    <div>
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
                    ? "bg-teal-500"
                    : "bg-red-400"
                  : i === currentIndex
                  ? "bg-teal-300"
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
                "w-full text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition-all",
                isRight
                  ? "border-teal-300 bg-teal-50 text-teal-800"
                  : isWrong
                  ? "border-red-300 bg-red-50 text-red-800"
                  : isSelected
                  ? "border-teal-400 bg-teal-50 text-teal-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 flex-shrink-0",
                    isRight
                      ? "border-teal-500 bg-teal-500"
                      : isWrong
                      ? "border-red-500 bg-red-500"
                      : isSelected
                      ? "border-teal-500 bg-teal-500"
                      : "border-slate-300 bg-white"
                  )}
                />
                {option}
                {isRight && <CheckCircle2 className="ml-auto h-4 w-4 text-teal-600" />}
                {isWrong && <XCircle className="ml-auto h-4 w-4 text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {checked && (
        <div
          className={cn(
            "rounded-xl border p-4 mb-6",
            isCorrect ? "bg-teal-50 border-teal-100" : "bg-red-50 border-red-100"
          )}
        >
          <p className={cn("text-sm font-semibold mb-1", isCorrect ? "text-teal-800" : "text-red-700")}>
            {isCorrect ? "Correct!" : "Not quite."}
          </p>
          <p className={cn("text-sm leading-relaxed", isCorrect ? "text-teal-700" : "text-red-600")}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">
          {selected && !checked ? "Ready to check?" : !selected ? "Select an answer" : ""}
        </span>
        <div className="flex gap-3">
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!selected}
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
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
