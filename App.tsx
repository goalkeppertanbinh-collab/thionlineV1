
import React, { useState, useEffect } from 'react';
import { User, Exam, ExamResult, UserRole } from './types';
import { fetchExamsFromSheet } from './services/dataService';
import { getAIFeedback } from './services/geminiService';
import { Layout } from './components/Layout';
import { ExamView } from './components/ExamView';
import { TeacherDashboard } from './components/TeacherDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [lastResult, setLastResult] = useState<{exam: Exam, result: ExamResult} | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', studentId: '', role: 'student' as UserRole });

  const loadExams = async () => {
    setIsLoading(true);
    const data = await fetchExamsFromSheet();
    setExams(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.name) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        name: authForm.name,
        studentId: authForm.role === 'student' ? authForm.studentId : undefined,
        email: authForm.role === 'student' ? `${authForm.studentId}@edu.vn` : 'teacher@edu.vn',
        role: authForm.role
      });
    }
  };

  const handleExamComplete = async (result: ExamResult) => {
    const exam = exams.find(e => e.id === result.examId);
    if (exam) {
      setLastResult({ exam, result });
      setCurrentExam(null);
      setIsLoading(true);
      const feedback = await getAIFeedback(exam, result);
      setAiFeedback(feedback);
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-lg shadow-blue-200 mb-6">
              <span className="text-white text-4xl font-black">E</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EduQuest</h1>
            <div className="flex bg-gray-100 p-1 rounded-xl mt-6">
              <button 
                onClick={() => setAuthForm({...authForm, role: 'student'})}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authForm.role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                Học sinh
              </button>
              <button 
                onClick={() => setAuthForm({...authForm, role: 'teacher'})}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authForm.role === 'teacher' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
              >
                Giáo viên
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                placeholder="Nguyễn Văn A"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            </div>
            {authForm.role === 'student' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã số sinh viên</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  placeholder="SV123456"
                  value={authForm.studentId}
                  onChange={(e) => setAuthForm({ ...authForm, studentId: e.target.value })}
                />
              </div>
            )}
            {authForm.role === 'teacher' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã bảo mật (Tùy chọn)</label>
                <input
                  type="password"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}
            <button
              type="submit"
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-xl transform active:scale-95 transition-all ${authForm.role === 'student' ? 'bg-blue-600 shadow-blue-100 hover:bg-blue-700' : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'}`}
            >
              Đăng nhập {authForm.role === 'student' ? 'Học sinh' : 'Giáo viên'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      {user.role === 'teacher' ? (
        <TeacherDashboard exams={exams} onRefresh={loadExams} />
      ) : (
        <>
          {currentExam ? (
            <ExamView 
              exam={currentExam} 
              onComplete={handleExamComplete} 
              onCancel={() => setCurrentExam(null)}
            />
          ) : lastResult ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center text-white">
                <div className="inline-block p-4 bg-white/20 rounded-full mb-4 backdrop-blur-md">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">Hoàn thành bài thi!</h2>
                <p className="text-blue-100">Kết quả của {user.name}</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Điểm số</p>
                    <p className="text-4xl font-black text-blue-600">{lastResult.result.score}/{lastResult.result.totalPoints}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tỷ lệ</p>
                    <p className="text-4xl font-black text-emerald-500">
                      {Math.round((lastResult.result.score / lastResult.result.totalPoints) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
                  <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3 uppercase text-sm tracking-wide">
                    <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">AI</span>
                    Nhận xét thông minh
                  </h3>
                  {isLoading ? (
                    <div className="flex items-center gap-3 text-gray-400 italic">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang phân tích kết quả...
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {aiFeedback || "Không có nhận xét nào."}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setLastResult(null);
                    setAiFeedback(null);
                  }}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Quay lại trang chủ
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Danh sách đề thi hiện có</h2>
                <p className="text-gray-500">Chọn một bài thi bên dưới để bắt đầu. Chúc bạn thi tốt!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <div 
                    key={exam.id} 
                    className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                       <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
                        {exam.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full uppercase">
                        {exam.questions.length} Câu
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                      {exam.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {exam.durationMinutes} Phút
                      </div>
                      <button
                        onClick={() => setCurrentExam(exam)}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        Bắt đầu thi
                      </button>
                    </div>
                  </div>
                ))}

                {exams.length === 0 && !isLoading && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-gray-400 font-medium">Hiện tại không có đề thi nào.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
