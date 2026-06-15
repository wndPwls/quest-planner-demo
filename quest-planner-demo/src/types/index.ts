export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  date: string; // YYYY-MM-DD
  time?: string;    // HH:MM 시작
  endTime?: string; // HH:MM 종료
  goalId?: string;
  xp: number;
  notification?: string; // 'start' | '10min' | '1hour' | '1day' | 'custom:N'
  color?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  startDate?: string;
  deadline?: string;
  time?: string;
  createdAt: string;
  color: string;
  completions: string[]; // YYYY-MM-DD 배열
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
}

export type CharacterSpecies = 'fox' | 'bear' | 'rabbit' | 'chick';

export interface Character {
  name: string;
  totalXp: number;
  level: number;
  achievements: Achievement[];
  species: CharacterSpecies;
}

export interface Streak {
  count: number;
  lastDate: string; // YYYY-MM-DD
  bestStreak: number;
  milestones: number[]; // e.g. [7, 30] = achieved 7-day and 30-day milestones
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorSpecies: CharacterSpecies;
  authorLevel: number;
  content: string;
  createdAt: string; // ISO timestamp
  likes: number;
  likedByMe: boolean;
}

export interface AppState {
  tasks: Task[];
  goals: Goal[];
  character: Character;
  streak: Streak;
  claudeApiKey: string;
  profile: UserProfile;
  posts: CommunityPost[];
  followingIds: string[];
}

export interface LevelUpInfo {
  newLevel: number;
}

export type UserStatus = 'online' | 'offline' | 'away';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  status: UserStatus;
  photo?: string; // base64 data URL
  followersCount: number;
}
