import React, { useState, useEffect } from 'react';
import { UnitDetail, UnitTestSubmitResponse } from '../../types';
import { X, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizModalProps {
  unitDetail: UnitDetail;
  userAnswers: Record<string, number>;
  testResult: UnitTestSubmitResponse | null;
  submitting: boolean;
  onAnswer: (questionId: string, optionIndex: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  unitDetail,
  userAnswers,
  testResult,
  submitting,
  onAnswer,
  onSubmit,
  onClose
}) => {
  const questions = unitDetail.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [unitDetail.id]);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const hasAnsweredCurrent = currentQuestion ? userAnswers[currentQuestion.id] !== undefined : false;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative my-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div><span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6f9800]">Unit test</span><h3 className="text-xl font-bold text-[#172018]">{unitDetail.title}</h3></div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {testResult ? (
          <div className="text-center py-6 space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-xl ${
              testResult.passed
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-rose-500/20'
            }`}>
              {testResult.passed ? <Award className="w-10 h-10 animate-bounce" /> : <X className="w-10 h-10" />}
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-white">
                {testResult.passed ? 'Unit Completed! 🎉' : 'Test Failed'}
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                Your score: <span className="font-bold text-white">{testResult.score}%</span>
                {testResult.correct_count != null && testResult.total_questions != null && (
                  <span> ({testResult.correct_count} / {testResult.total_questions} correct)</span>
                )}
              </p>
              {testResult.incorrect_question_numbers.length > 0 && (
                <p className="text-sm text-slate-400 mt-1">
                  {testResult.incorrect_question_numbers.length === 1 ? 'Question' : 'Questions'}{' '}
                  {testResult.incorrect_question_numbers.join(', ')}{' '}
                  {testResult.incorrect_question_numbers.length === 1 ? 'is' : 'are'} incorrect
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
            >
              Close
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Question {currentIndex + 1} / {questions.length}</span>
              <span>{answeredCount} answered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-start gap-2">
                <span className="text-cyan-400 font-mono shrink-0">#{currentIndex + 1}</span>
                <span>{currentQuestion.text}</span>
              </h4>
              <div className="space-y-2">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestion.id] === optIdx;
                  return (
                    <label
                      key={optIdx}
                      onClick={() => onAnswer(currentQuestion.id, optIdx)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${currentQuestion.id}`}
                        checked={isSelected}
                        onChange={() => {}}
                        className="accent-cyan-500"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentIndex((i) => i - 1)}
                disabled={currentIndex === 0}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {isLast ? (
                <button
                  onClick={onSubmit}
                  disabled={submitting || answeredCount < questions.length}
                className="flex-1 py-3 rounded-xl bg-[#c7f43a] hover:bg-[#b9e72d] text-[#1c2a1d] font-extrabold shadow-lg shadow-lime-500/25 transition-all disabled:opacity-40"
                >
                  {submitting ? 'Submitting...' : `Submit Answers (${answeredCount}/${questions.length})`}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  disabled={!hasAnsweredCurrent}
                  className="flex-1 py-3 rounded-xl bg-[#c7f43a] hover:bg-[#b9e72d] text-[#1c2a1d] font-bold shadow-lg shadow-lime-500/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
