
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
      if (answers[q.id] === q.correctAnswer) {
        score += q.points;
      }
    });

    onComplete({
      examId: exam.id,
      score,
      totalPoints,
      completedAt: new Date(),
      answers
    });
  }, [answers, exam, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleFinish]);

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
            <div className={`px-4 py-2 rounded-full font-mono font-bold text-lg ${timeLeft < 60 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium uppercase">
            <span>Câu {currentQuestionIndex + 1} / {exam.questions.length}</span>
            <span>Tiến độ: {Math.round(progress)}%</span>
          </div>
        </div>

        {/* Question Section */}
        <div className="p-8">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md mb-3">
              CÂU HỎI {currentQuestionIndex + 1}
            </span>
            <h3 className="text-xl font-medium text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group flex items-center gap-4 ${
                  answers[currentQuestion.id] === idx 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-100 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
                  answers[currentQuestion.id] === idx 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`text-lg ${answers[currentQuestion.id] === idx ? 'text-blue-900 font-semibold' : 'text-gray-700'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 rounded-lg text-sm font-bold text-gray-600 disabled:opacity-30 hover:bg-white transition-colors border border-transparent hover:border-gray-200"
          >
            Quay lại
          </button>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="px-6 py-2 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Hủy thi
            </button>
            
            {currentQuestionIndex === exam.questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="px-8 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transform hover:-translate-y-0.5 transition-all"
              >
                Nộp bài
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all"
              >
                Tiếp theo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
