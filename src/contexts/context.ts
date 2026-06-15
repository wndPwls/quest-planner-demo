import { createContext } from 'react';
import type { AppState, Task, Goal, UserProfile } from '../types';

export type Action =
  | { type: 'ADD_TASK'; task: { title: string; goalId?: string; date?: string; time?: string; endTime?: string; notification?: string; color?: string } }
  | { type: 'COMPLETE_TASK'; id: string }
  | { type: 'UNCOMPLETE_TASK'; id: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'UPDATE_TASK'; id: string; patch: { title?: string; time?: string; endTime?: string; notification?: string; color?: string } }
  | { type: 'ADD_GOAL'; goal: Omit<Goal, 'id' | 'createdAt' | 'completions'> }
  | { type: 'UPDATE_GOAL'; id: string; goal: Omit<Goal, 'id' | 'createdAt' | 'completions'> }
  | { type: 'DELETE_GOAL'; id: string }
  | { type: 'TOGGLE_GOAL_COMPLETION'; id: string; date: string }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'UPDATE_PROFILE'; profile: UserProfile }
  | { type: 'DISMISS_LEVEL_UP' }
  | { type: 'DISMISS_MILESTONE' }
  | { type: 'ADD_POST'; content: string }
  | { type: 'TOGGLE_LIKE_POST'; id: string }
  | { type: 'DELETE_POST'; id: string }
  | { type: 'TOGGLE_FOLLOW'; authorId: string };

export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  levelUpInfo: { newLevel: number } | null;
  milestoneInfo: number | null;
  todayTasks: Task[];
  todayCompleted: number;
  todayTotal: number;
}

export const AppContext = createContext<AppContextValue | null>(null);
