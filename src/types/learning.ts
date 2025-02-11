export interface Level {
  id: number;
  title: string;
  description: string;
  totalPoints: number;
  sections: Section[];
  requiredPoints: number;
  isUnlocked: boolean;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  points: number;
  type: 'study' | 'quiz';
  content?: StudyContent;
  quiz?: Quiz;
  isCompleted: boolean;
}

export interface StudyContent {
  sections: {
    title: string;
    content: string;
    image?: string;
  }[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  questions: Question[];
  pointsPerQuestion: number;
  totalPoints: number;
  minimumPassScore: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredScore: number;
  isUnlocked: boolean;
}

export interface UserProgress {
  id: number;
  user_id: string;
  completed: boolean;
  created_at: string;
  last_position: number;
  lesson_id: number;
  lives: number;
  points: number;
  section_id: number;
  updated_at: string;
  hearts: number;
  totalPoints: number;
  currentLevel: number;
  completedSections: number[];
  achievements: string[];
  quizScores: {
    [quizId: number]: {
      score: number;
      timeSpent: number;
      completedAt: string;
      attempts: number;
    };
  };
  streakDays: number;
  lastActive: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  achievements: number;
  rank: number;
}

export const TOTAL_AVAILABLE_POINTS = 1000;
export const PASSING_GRADE = 750;
export const MAX_HEARTS = 5;
export const HEART_REGENERATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds 