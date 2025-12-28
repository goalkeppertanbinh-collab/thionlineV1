
import React, { useState } from 'react';
import { Exam, Question } from '../types';
import { saveExam, deleteExam } from '../services/dataService';

// Custom Tooltip Component với hiệu ứng mượt mà
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center animate-in fade-in zoom-in duration-200 z-50">
      <div className="bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
        {text}
      </div>
      <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
    </div>
  </div>
);

interface TeacherDashboardProps {
  exams: Exam[];
  onRefresh: () => void;
}

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
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      await deleteExam(id);
      onRefresh();
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Thiết kế lộ trình kiểm tra</h2>
            <p className="text-gray-500 font-medium">Xây dựng bộ câu hỏi và cấu hình thời gian thi.</p>
          </div>
          <button 
            onClick={() => setIsCreating(false)}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-rose-500 font-bold transition-all bg-white border border-gray-100 rounded-2xl shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            Hủy thiết lập
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cấu hình Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-6">
              <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs">Cấu hình đề thi</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Tiêu đề bài thi
                    <Tooltip text="Tên gọi chính thức của kỳ thi">
                      <svg className="w-3.5 h-3.5 text-gray-300 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8c0 1.657-1.343 3-3 3a1 1 0 110-2c.552 0 1-.448 1-1s-.448-1-1-1zm-1 9a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" /></svg>
                    </Tooltip>
                  </label>
                  <input 
                    type="text"
                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold placeholder:text-gray-300"
                    placeholder="VD: Kiểm tra Giải tích chương 2"
                    value={newExam.title}
                    onChange={e => setNewExam({...newExam, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 block">Mô tả mục tiêu</label>
                  <textarea 
                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all h-28 text-sm font-medium resize-none"
                    placeholder="Nội dung, phạm vi kiến thức..."
                    value={newExam.description}
                    onChange={e => setNewExam({...newExam, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 block">Thời gian</label>
                    <div className="relative">
                      <input 
                        type="number"
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold pr-14"
                        value={newExam.durationMinutes}
                        onChange={e => setNewExam({...newExam, durationMinutes: parseInt(e.target.value) || 0})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300 uppercase">Phút</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 block">Lĩnh vực</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold"
                      value={newExam.category}
                      onChange={e => setNewExam({...newExam, category: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveExam}
                className="w-full bg-gradient-to-br from-gray-900 to-black text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Xuất bản bài thi
              </button>
            </div>
          </div>

          {/* Vùng soạn thảo câu hỏi */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-10 rounded-[40px] border border-indigo-50 shadow-2xl shadow-indigo-100/30 relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-bl-[100px] -mr-16 -mt-16 group-hover/card:bg-indigo-100/50 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                   </div>
                   <h3 className="font-black text-gray-900 text-2xl tracking-tight">Thêm nội dung câu hỏi</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung chính</label>
                    <input 
                      type="text"
                      className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-3xl outline-none focus:bg-white focus:border-indigo-500 text-xl font-bold transition-all placeholder:text-gray-300 shadow-inner"
                      placeholder="Nhập câu hỏi của bạn tại đây..."
                      value={currentQuestion.question}
                      onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {currentQuestion.options?.map((opt, idx) => (
                      <div key={idx} className={`relative p-5 rounded-3xl border-2 transition-all ${currentQuestion.correctAnswer === idx ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100/50' : 'border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200'}`}>
                        <div className="flex items-center gap-4">
                          <Tooltip text={currentQuestion.correctAnswer === idx ? "Đáp án đã chọn" : "Thiết lập là đáp án đúng"}>
                            <button 
                              onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-sm ${currentQuestion.correctAnswer === idx ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400'}`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </button>
                          </Tooltip>
                          <input 
                            type="text"
                            className="flex-grow bg-transparent outline-none font-bold text-gray-700 placeholder:font-medium"
                            placeholder={`Đáp án ${String.fromCharCode(65 + idx)}...`}
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

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trọng số điểm:</span>
                      <div className="flex items-center bg-gray-100 rounded-2xl p-1 px-3 border border-gray-100">
                         <input 
                          type="number"
                          className="w-12 bg-transparent text-center font-black text-indigo-600 border-none focus:ring-0 outline-none"
                          value={currentQuestion.points}
                          onChange={e => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 0})}
                        />
                        <span className="text-[9px] font-black text-gray-400 uppercase">Pts</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleAddQuestion}
                      className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      Xác nhận thêm
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-gray-900 text-xl tracking-tight flex items-center gap-3">
                  Cấu trúc đề thi
                  <span className="text-[10px] font-black px-3 py-1 bg-gray-100 text-gray-400 rounded-full">{newExam.questions?.length || 0} CÂU HỎI</span>
                </h3>
              </div>
              
              <div className="grid gap-4">
                {newExam.questions?.map((q, idx) => (
                  <div key={q.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between group/item hover:border-indigo-100 hover:shadow-xl hover:shadow-gray-100 transition-all">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 leading-snug">{q.question}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             Đáp án: {String.fromCharCode(65 + q.correctAnswer)}
                          </span>
                          <span className="text-[9px] font-black text-gray-300 uppercase">{q.points} Điểm</span>
                        </div>
                      </div>
                    </div>
                    <Tooltip text="Xóa câu hỏi">
                      <button 
                        onClick={() => setNewExam({...newExam, questions: newExam.questions?.filter(item => item.id !== q.id)})}
                        className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover/item:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </Tooltip>
                  </div>
                ))}

                {!newExam.questions?.length && (
                  <div className="py-24 bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </div>
                    <h4 className="font-black text-gray-900 text-lg mb-2">Chưa có câu hỏi nào</h4>
                    <p className="text-gray-400 text-sm font-medium">Bắt đầu nhập liệu từ biểu mẫu bên trên để hoàn thiện đề thi của bạn.</p>
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
    <div className="animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Thư viện bài thi</h2>
          <p className="text-gray-500 font-medium mt-1">Quản lý kho học liệu và theo dõi hiệu suất giảng dạy.</p>
        </div>
        <div className="flex gap-4">
          <Tooltip text="Cập nhật danh sách từ hệ thống">
            <button 
              onClick={onRefresh}
              className="p-4 bg-white border border-gray-100 rounded-[20px] text-gray-400 hover:text-indigo-600 hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </Tooltip>
          <button 
            onClick={() => setIsCreating(true)}
            className="group relative px-10 py-4 bg-gray-900 text-white font-black rounded-[24px] shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Soạn thảo đề mới
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nội dung bài thi</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lĩnh vực</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thông số</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exams.map(exam => (
                <tr key={exam.id} className="group hover:bg-indigo-50/30 transition-all">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm ${exam.id.startsWith('custom') ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                        {exam.title.charAt(0)}
                      </div>
                      <div className="max-w-xs md:max-w-md">
                        <h4 className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors leading-tight">{exam.title}</h4>
                        <p className="text-gray-400 text-xs font-medium mt-1 truncate">{exam.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 bg-white border border-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
                      {exam.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 uppercase">Quy mô</span>
                          <span className="font-black text-gray-700">{exam.questions.length} <span className="text-[10px] text-gray-400 uppercase">câu</span></span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 uppercase">Thời gian</span>
                          <span className="font-black text-gray-700">{exam.durationMinutes} <span className="text-[10px] text-gray-400 uppercase">phút</span></span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Tooltip text="Báo cáo chi tiết">
                        <button className="p-3 bg-white text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl border border-gray-100 transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </button>
                      </Tooltip>
                      <Tooltip text="Xóa vĩnh viễn">
                        <button 
                          onClick={() => handleDelete(exam.id)}
                          className="p-3 bg-white text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-gray-100 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-40 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                       <div className="w-28 h-28 bg-gray-50 rounded-[40px] flex items-center justify-center mb-8 border border-gray-100">
                          <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                       </div>
                       <h4 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Thư viện đang trống</h4>
                       <p className="text-gray-400 text-sm font-medium leading-relaxed">Hãy kiến tạo đề thi đầu tiên của bạn để học sinh có thể bắt đầu quá trình ôn luyện và kiểm tra.</p>
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
