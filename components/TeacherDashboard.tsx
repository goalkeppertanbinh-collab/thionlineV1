
import React, { useState } from 'react';
import { Exam, Question } from '../types';
import { saveExam, deleteExam } from '../services/dataService';

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
    if (!currentQuestion.question) return;
    
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
    if (!newExam.title || !newExam.questions?.length) {
      alert("Vui lòng điền tiêu đề và ít nhất một câu hỏi!");
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
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Tạo đề thi mới</h2>
          <button 
            onClick={() => setIsCreating(false)}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Hủy bỏ
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 border-b pb-2">Thông tin chung</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tiêu đề</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                  placeholder="VD: Kiểm tra Toán 15'"
                  value={newExam.title}
                  onChange={e => setNewExam({...newExam, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 h-24"
                  placeholder="Mô tả nội dung bài thi..."
                  value={newExam.description}
                  onChange={e => setNewExam({...newExam, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thời gian (phút)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                    value={newExam.durationMinutes}
                    onChange={e => setNewExam({...newExam, durationMinutes: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Danh mục</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                    value={newExam.category}
                    onChange={e => setNewExam({...newExam, category: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveExam}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Lưu & Xuất bản
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Question Builder */}
            <div className="bg-white p-8 rounded-2xl border border-indigo-100 shadow-sm">
              <h3 className="font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">?</span>
                Thêm câu hỏi
              </h3>
              
              <div className="space-y-4">
                <input 
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-lg font-medium"
                  placeholder="Nội dung câu hỏi..."
                  value={currentQuestion.question}
                  onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="radio"
                        name="correct"
                        checked={currentQuestion.correctAnswer === idx}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <input 
                        type="text"
                        className="flex-grow px-3 py-2 border border-gray-100 rounded-lg text-sm"
                        placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...(currentQuestion.options || [])];
                          newOpts[idx] = e.target.value;
                          setCurrentQuestion({...currentQuestion, options: newOpts});
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-gray-400">ĐIỂM:</span>
                     <input 
                        type="number"
                        className="w-16 px-2 py-1 border border-gray-200 rounded"
                        value={currentQuestion.points}
                        onChange={e => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 0})}
                     />
                   </div>
                   <button 
                    onClick={handleAddQuestion}
                    className="px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-all"
                   >
                     + Thêm vào đề
                   </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Câu hỏi đã thêm ({newExam.questions?.length})</h3>
              {newExam.questions?.map((q, idx) => (
                <div key={q.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-indigo-500">#{idx + 1}</span>
                    <p className="font-medium text-gray-800">{q.question}</p>
                    <p className="text-xs text-emerald-600 mt-1">Đúng: {q.options[q.correctAnswer]}</p>
                  </div>
                  <button 
                    onClick={() => setNewExam({...newExam, questions: newExam.questions?.filter(item => item.id !== q.id)})}
                    className="text-gray-300 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {!newExam.questions?.length && (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                  Chưa có câu hỏi nào được thêm.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bảng điều khiển Giáo viên</h2>
          <p className="text-gray-500">Quản lý các đề thi của bạn và xem kết quả học sinh.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex items-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Tạo đề thi mới
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên đề thi</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Số câu hỏi</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {exams.map(exam => (
              <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{exam.title}</div>
                  <div className="text-xs text-gray-400">ID: {exam.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-md uppercase">
                    {exam.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.questions.length} câu</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.durationMinutes} phút</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(exam.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                  Chưa có đề thi nào. Hãy bắt đầu bằng cách nhấn "Tạo đề thi mới".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
