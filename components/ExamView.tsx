
import React, { useState, useEffect, useCallback } from 'react';
import { Exam, Question, ExamResult } from '../types';

interface ExamViewProps {
  exam: Exam;
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ exam, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleFinish = useCallback(() => {
    let score = 0;
    let totalPoints = 0;
    exam.questions.forEach((q) => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) score += q.points;
    });
    onComplete({ examId: exam.id, score, totalPoints, completedAt: new Date(), answers });
  }, [answers, exam, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) { handleFinish(); return; }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinish]);

  const handleOptionSelect = (idx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
      {/* Sidebar Tiến Độ */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-blue-50/50 border border-gray-100 sticky top-28">
          <div className="mb-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Danh sách câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-full aspect-square rounded-xl text-xs font-bold transition-all ${
                    currentQuestionIndex === idx 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' 
                      : answers[q.id] !== undefined
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-gray-50">
             <button 
              onClick={() => { if(confirm("Kết thúc bài thi ngay?")) handleFinish() }}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-200"
             >
               Nộp bài ngay
             </button>
          </div>
        </div>
      </div>

      {/* Vùng nội dung chính */}
      <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-100/20 overflow-hidden border border-gray-100">
          <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{exam.title}</h2>
              <p className="text-sm text-gray-400 font-medium">Chọn một đáp án đúng nhất bên dưới</p>
            </div>
            <div className={`px-6 py-3 rounded-2xl font-black text-xl tracking-tighter shadow-inner ${timeLeft < 60 ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          <div className="p-10">
            <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg mb-4 uppercase tracking-widest">
                Câu hỏi {currentQuestionIndex + 1} của {exam.questions.length}
              </span>
              <h3 className="text-2xl font-bold text-gray-800 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="grid gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-6 rounded-3xl border-2 transition-all group relative flex items-center gap-5 ${
                    answers[currentQuestion.id] === idx 
                      ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100/50' 
                      : 'border-gray-100 hover:border-blue-200 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black flex-shrink-0 transition-all ${
                    answers[currentQuestion.id] === idx 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg font-semibold ${answers[currentQuestion.id] === idx ? 'text-blue-900' : 'text-gray-600'}`}>
                    {option}
                  </span>
                  {answers[currentQuestion.id] === idx && (
                    <div className="ml-auto w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="px-10 py-8 bg-gray-50/50 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 rounded-2xl font-bold text-gray-400 hover:bg-white disabled:opacity-0 transition-all"
            >
              Câu trước đó
            </button>
            <button
              onClick={() => {
                if(currentQuestionIndex === exam.questions.length - 1) handleFinish();
                else setCurrentQuestionIndex(p => p + 1);
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
            >
              {currentQuestionIndex === exam.questions.length - 1 ? 'Hoàn tất bài thi' : 'Câu tiếp theo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
