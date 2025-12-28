
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

  useEffect(() => { loadExams(); }, []);

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

  // Fix: Implemented handleExamComplete to handle exam finalization and AI feedback fetching
  const handleExamComplete = async (result: ExamResult) => {
    if (!currentExam) return;
    const exam = currentExam;
    setLastResult({ exam, result });
    setCurrentExam(null);
    
    setIsLoading(true);
    try {
      const feedback = await getAIFeedback(exam, result);
      setAiFeedback(feedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      setAiFeedback("Không thể nhận phản hồi từ AI lúc này.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 mesh-gradient">
        <div className="max-w-md w-full animate-in zoom-in-95 duration-700">
          <div className="bg-white rounded-[48px] shadow-2xl shadow-blue-200/50 p-12 border border-white">
            <div className="text-center mb-10">
              <div className="inline-flex w-24 h-24 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-[32px] shadow-2xl shadow-blue-200 mb-8 items-center justify-center animate-float">
                <span className="text-white text-4xl font-black italic">E</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Xin chào!</h1>
              <p className="text-gray-400 font-medium text-sm">Chào mừng bạn đến với kỷ nguyên thi trực tuyến mới</p>
              
              <div className="flex bg-gray-50 p-1.5 rounded-2xl mt-10 border border-gray-100">
                <button 
                  onClick={() => setAuthForm({...authForm, role: 'student'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authForm.role === 'student' ? 'bg-white shadow-lg shadow-gray-200/50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Học sinh
                </button>
                <button 
                  onClick={() => setAuthForm({...authForm, role: 'teacher'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authForm.role === 'teacher' ? 'bg-white shadow-lg shadow-gray-200/50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Giảng viên
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ tên của bạn</label>
                <input
                  type="text" required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300"
                  placeholder="VD: Minh Quân"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              </div>
              {authForm.role === 'student' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã số sinh viên</label>
                  <input
                    type="text" required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300"
                    placeholder="VD: B20DCCN123"
                    value={authForm.studentId}
                    onChange={(e) => setAuthForm({ ...authForm, studentId: e.target.value })}
                  />
                </div>
              )}
              <button
                type="submit"
                className={`w-full text-white font-black py-5 rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-xs mt-4 ${authForm.role === 'student' ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}
              >
                Tiến vào hệ thống
              </button>
            </form>
          </div>
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
            <ExamView exam={currentExam} onComplete={handleExamComplete} onCancel={() => setCurrentExam(null)} />
          ) : lastResult ? (
            <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700">
               <div className="bg-white rounded-[48px] shadow-2xl shadow-blue-100 overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-16 text-center text-white relative">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                     <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mx-auto mb-6 flex items-center justify-center">
                           <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-4xl font-black mb-3 tracking-tight">Tuyệt vời, {user.name}!</h2>
                        <p className="text-blue-100 font-medium">Bạn đã hoàn thành bài thi một cách xuất sắc.</p>
                     </div>
                  </div>

                  <div className="p-12">
                    <div className="grid grid-cols-2 gap-6 mb-12">
                       <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 text-center">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Điểm đạt được</p>
                          <p className="text-5xl font-black text-blue-600 leading-none">{lastResult.result.score}<span className="text-2xl text-blue-300">/{lastResult.result.totalPoints}</span></p>
                       </div>
                       <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 text-center">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Độ chính xác</p>
                          <p className="text-5xl font-black text-emerald-600 leading-none">
                            {Math.round((lastResult.result.score / lastResult.result.totalPoints) * 100)}<span className="text-2xl text-emerald-300">%</span>
                          </p>
                       </div>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                       <h3 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                          <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] text-white">AI</span>
                          Phân tích hiệu suất từ AI
                       </h3>
                       {isLoading ? (
                         <div className="flex gap-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                         </div>
                       ) : (
                         <p className="text-gray-700 font-medium leading-relaxed italic">"{aiFeedback}"</p>
                       )}
                    </div>

                    <button 
                      onClick={() => {setLastResult(null); setAiFeedback(null);}}
                      className="w-full mt-10 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all"
                    >
                      Về trang cá nhân
                    </button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000">
              <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Bài thi hôm nay</h2>
                   <p className="text-gray-400 font-medium mt-2">Chào {user.name}, hãy chọn một thử thách để bắt đầu.</p>
                </div>
                <div className="px-5 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase leading-none">Trạng thái</p>
                      <p className="text-sm font-bold text-emerald-500">Đang hoạt động</p>
                   </div>
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exams.map((exam) => (
                  <div key={exam.id} className="group bg-white rounded-[40px] p-8 border border-gray-100 hover:border-blue-500 transition-all duration-500 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-blue-200/30 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[80px] -mr-10 -mt-10 group-hover:bg-blue-500 transition-colors duration-500 flex items-center justify-center pl-6 pt-6">
                       <svg className="w-8 h-8 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 rounded-full uppercase tracking-tighter">{exam.category}</span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight pr-10">{exam.title}</h3>
                    <p className="text-gray-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{exam.description}</p>

                    <div className="mt-auto flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter leading-none">Thời lượng</p>
                          <p className="text-lg font-black text-gray-700">{exam.durationMinutes}<span className="text-xs ml-1">PHÚT</span></p>
                       </div>
                       <button 
                         onClick={() => setCurrentExam(exam)}
                         className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-110 active:scale-95 transition-all text-sm"
                       >
                         Bắt đầu ngay
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
