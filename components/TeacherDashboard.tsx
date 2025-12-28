
import React, { useState } from 'react';
import { Exam, Question } from '../types';
import { saveExam, deleteExam } from '../services/dataService';

interface TeacherDashboardProps {
  exams: Exam[];
  onRefresh: () => void;
}

// Custom Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative flex items-center">
    {children}
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ exams, onRefresh }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: '',
    description: '',
    category: 'Chung',
    durationMinutes: 30,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10
  });

  const handleAddQuestion = () => {
    if (!currentQuestion.question?.trim()) return;
    
    const questionWithId: Question = {
      ...(currentQuestion as Question),
      id: Date.now()
    };

    setNewExam(prev => ({
      ...prev,
      questions: [...(prev.questions || []), questionWithId]
    }));

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10
    });
  };

  const handleSaveExam = async () => {
    if (!newExam.title?.trim() || !newExam.questions?.length) {
      alert("Vui lòng điền tiêu đề và thêm ít nhất một câu hỏi!");
      return;
    }

    const examToSave: Exam = {
      ...newExam as Exam,
      id: 'custom-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    await saveExam(examToSave);
    setIsCreating(false);
    setNewExam({
      title: '',
      description: '',
      category: 'Chung',
      durationMinutes: 30,
      questions: []
    });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác.")) {
      await deleteExam(id);
      onRefresh();
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Thiết kế bài thi</h2>
            <p className="text-gray-500">Xây dựng nội dung và thiết lập quy tắc thi.</p>
          </div>
          <button 
            onClick={() => setIsCreating(false)}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 font-semibold transition-colors bg-white border border-gray-200 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            Hủy thiết lập
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Cấu hình bài thi
              </h3>
              
              <div>
                <label className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase mb-2">
                  Tiêu đề đề thi
                  <Tooltip text="Tên hiển thị cho học sinh thấy">
                    <svg className="w-3 h-3 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8c0 1.657-1.343 3-3 3a1 1 0 110-2c.552 0 1-.448 1-1s-.448-1-1-1zm-1 9a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" /></svg>
                  </Tooltip>
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                  placeholder="VD: Kiểm tra giữa kỳ Toán 10"
                  value={newExam.title}
                  onChange={e => setNewExam({...newExam, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Mô tả ngắn</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all h-24 text-sm"
                  placeholder="Nội dung, phạm vi kiến thức..."
                  value={newExam.description}
                  onChange={e => setNewExam({...newExam, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Thời gian</label>
                  <div className="relative">
                    <input 
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all pr-12"
                      value={newExam.durationMinutes}
                      onChange={e => setNewExam({...newExam, durationMinutes: parseInt(e.target.value) || 0})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">PHÚT</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Danh mục</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    value={newExam.category}
                    onChange={e => setNewExam({...newExam, category: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveExam}
                className="w-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Xuất bản đề thi
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Question Builder */}
            <div className="bg-white p-8 rounded-[32px] border border-indigo-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
              
              <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                Thêm câu hỏi mới
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase ml-1">Câu hỏi</label>
                   <input 
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 text-lg font-semibold transition-all"
                    placeholder="Nhập nội dung câu hỏi..."
                    value={currentQuestion.question}
                    onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((opt, idx) => (
                    <div key={idx} className={`relative group/opt p-4 rounded-2xl border-2 transition-all ${currentQuestion.correctAnswer === idx ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50/50 focus-within:bg-white focus-within:border-indigo-200'}`}>
                      <div className="flex items-center gap-3">
                        <Tooltip text={currentQuestion.correctAnswer === idx ? "Đáp án đúng" : "Đánh dấu là đáp án đúng"}>
                          <button 
                            onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${currentQuestion.correctAnswer === idx ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 hover:bg-gray-200'}`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </button>
                        </Tooltip>
                        <input 
                          type="text"
                          className="flex-grow bg-transparent outline-none font-medium text-gray-700"
                          placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}...`}
                          value={opt}
                          onChange={e => {
                            const newOpts = [...(currentQuestion.options || [])];
                            newOpts[idx] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOpts});
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Điểm số:</span>
                        <input 
                            type="number"
                            className="w-16 px-3 py-2 bg-gray-100 border-none rounded-xl text-center font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
                            value={currentQuestion.points}
                            onChange={e => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 0})}
                        />
                     </div>
                   </div>
                   <button 
                    onClick={handleAddQuestion}
                    className="group px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center gap-2"
                   >
                     Thêm vào đề
                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  Danh sách câu hỏi
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-xs font-black">{newExam.questions?.length || 0}</span>
                </h3>
              </div>
              
              <div className="grid gap-4">
                {newExam.questions?.map((q, idx) => (
                  <div key={q.id} className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all flex justify-between items-center">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 leading-tight mb-2">{q.question}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">
                            Đáp án: {String.fromCharCode(65 + q.correctAnswer)}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-md uppercase">
                            {q.points} Điểm
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip text="Gỡ bỏ câu hỏi">
                        <button 
                          onClick={() => setNewExam({...newExam, questions: newExam.questions?.filter(item => item.id !== q.id)})}
                          className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
                
                {!newExam.questions?.length && (
                  <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-gray-400 font-bold">Bắt đầu bằng cách thêm câu hỏi đầu tiên</p>
                    <p className="text-gray-300 text-sm">Đề thi cần tối thiểu 1 câu hỏi để xuất bản.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Thư viện đề thi</h2>
          <p className="text-gray-500 mt-2 font-medium">Trung tâm quản lý nội dung và kết quả học tập.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="group relative overflow-hidden bg-gray-900 text-white px-8 py-4 rounded-3xl font-bold shadow-2xl shadow-gray-200 hover:shadow-indigo-200 hover:scale-105 transition-all flex items-center gap-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Thiết kế đề thi mới
          </div>
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thông tin bài thi</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nội dung</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${exam.id.startsWith('custom') ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                        {exam.title.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{exam.title}</div>
                        <div className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-tighter">ID: {exam.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white border border-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
                      {exam.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 uppercase">Câu hỏi</span>
                          <span className="font-bold text-gray-700">{exam.questions.length} câu</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 uppercase">Thời lượng</span>
                          <span className="font-bold text-gray-700">{exam.durationMinutes} phút</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Tooltip text="Xem báo cáo kết quả">
                        <button className="p-3 bg-white text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl shadow-sm border border-gray-100 transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </button>
                      </Tooltip>
                      <Tooltip text="Xóa vĩnh viễn">
                        <button 
                          onClick={() => handleDelete(exam.id)}
                          className="p-3 bg-white text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl shadow-sm border border-gray-100 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                       <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                          <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                       </div>
                       <h4 className="text-xl font-bold text-gray-900 mb-2">Chưa có đề thi nào</h4>
                       <p className="text-gray-400 text-sm">Hệ thống đang trống. Hãy nhấn nút bên trên để bắt đầu soạn đề thi đầu tiên của bạn.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
