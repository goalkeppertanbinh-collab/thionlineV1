
import { Exam } from '../types';

const LOCAL_STORAGE_KEY = 'eduquest_custom_exams';

const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-101',
    title: 'Toán Học Đại Cương - Kỳ I',
    description: 'Kiểm tra kiến thức cơ bản về giải tích và đại số tuyến tính.',
    durationMinutes: 45,
    category: 'Toán Học',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 1,
        question: "Đạo hàm của hàm số y = x^2 là gì?",
        options: ["x", "2x", "x^3/3", "2x^2"],
        correctAnswer: 1,
        points: 10
      },
      {
        id: 2,
        question: "Giá trị của cos(0) là bao nhiêu?",
        options: ["0", "1", "-1", "0.5"],
        correctAnswer: 1,
        points: 10
      }
    ]
  },
  {
    id: 'exam-202',
    title: 'Tiếng Anh Giao Tiếp',
    description: 'Kiểm tra trình độ Listening và Reading cơ bản.',
    durationMinutes: 30,
    category: 'Ngôn Ngữ',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 1,
        question: "What is the past tense of 'go'?",
        options: ["Went", "Gone", "Goes", "Going"],
        correctAnswer: 0,
        points: 5
      }
    ]
  }
];

export async function fetchExamsFromSheet(): Promise<Exam[]> {
  try {
    const savedExamsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedExams: Exam[] = savedExamsStr ? JSON.parse(savedExamsStr) : [];
    
    // Combine mock data with locally created exams
    return [...savedExams, ...MOCK_EXAMS].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching exams:", error);
    return MOCK_EXAMS;
  }
}

export async function saveExam(exam: Exam): Promise<void> {
  const savedExamsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  const savedExams: Exam[] = savedExamsStr ? JSON.parse(savedExamsStr) : [];
  
  savedExams.push(exam);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedExams));
}

export async function deleteExam(id: string): Promise<void> {
  const savedExamsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!savedExamsStr) return;
  
  const savedExams: Exam[] = JSON.parse(savedExamsStr);
  const filtered = savedExams.filter(e => e.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
}
