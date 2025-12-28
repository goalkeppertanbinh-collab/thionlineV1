
export type UserRole = 'student' | 'teacher';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
  category: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  studentId?: string;
  email: string;
  role: UserRole;
}

export interface ExamResult {
  examId: string;
  score: number;
  totalPoints: number;
  completedAt: Date;
  answers: Record<number, number>;
}
