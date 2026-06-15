import { useEffect, useReducer, type ReactNode } from 'react';
import type { AppState, Task, Goal, CommunityPost } from '../types';
import { load, save, today } from '../store/storage';
import { addXp, updateStreak, checkStreakOnLoad, calcLevel } from '../store/gameLogic';
import { AppContext, type Action } from './context';

function reducer(
  state: AppState,
  action: Action,
): AppState & { _levelUp?: number; _milestone?: number } {
  switch (action.type) {
    case 'ADD_TASK': {
      const task: Task = {
        id: crypto.randomUUID(),
        title: action.task.title,
        completed: false,
        date: action.task.date ?? today(),
        time: action.task.time,
        endTime: action.task.endTime,
        goalId: action.task.goalId,
        notification: action.task.notification,
        color: action.task.color,
        xp: 10,
      };
      return { ...state, tasks: [...state.tasks, task] };
    }

    case 'COMPLETE_TASK': {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task || task.completed) return state;

      const updatedTasks = state.tasks.map((t) =>
        t.id === action.id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t,
      );

      const { character, leveledUp, newLevel } = addXp(state.character);

      const todayDone = updatedTasks.filter(
        (t) => t.date === today() && t.completed,
      ).length;
      const { streak, newMilestone } = updateStreak(state.streak, todayDone > 0);

      return {
        ...state,
        tasks: updatedTasks,
        character,
        streak,
        _levelUp: leveledUp ? newLevel : undefined,
        _milestone: newMilestone ?? undefined,
      };
    }

    case 'UNCOMPLETE_TASK': {
      const updatedTasks = state.tasks.map((t) =>
        t.id === action.id ? { ...t, completed: false, completedAt: undefined } : t,
      );
      const totalXp = Math.max(0, state.character.totalXp - 10);
      return {
        ...state,
        tasks: updatedTasks,
        character: { ...state.character, totalXp, level: calcLevel(totalXp) },
      };
    }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t
        ),
      };

    case 'ADD_GOAL': {
      const goal: Goal = {
        id: crypto.randomUUID(),
        ...action.goal,
        completions: [],
        createdAt: new Date().toISOString(),
      };
      return { ...state, goals: [...state.goals, goal] };
    }

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id ? { ...g, ...action.goal } : g
        ),
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
        tasks: state.tasks.filter((t) => t.goalId !== action.id),
      };

    case 'TOGGLE_GOAL_COMPLETION': {
      const goals = state.goals.map((g) => {
        if (g.id !== action.id) return g;
        const already = g.completions.includes(action.date);
        return {
          ...g,
          completions: already
            ? g.completions.filter((d) => d !== action.date)
            : [...g.completions, action.date],
        };
      });
      return { ...state, goals };
    }

    case 'SET_API_KEY':
      return { ...state, claudeApiKey: action.key };

    case 'UPDATE_PROFILE':
      return { ...state, profile: action.profile };

    case 'DISMISS_LEVEL_UP':
      return { ...state, _levelUp: undefined };

    case 'DISMISS_MILESTONE':
      return { ...state, _milestone: undefined };

    case 'ADD_POST': {
      const post: CommunityPost = {
        id: crypto.randomUUID(),
        authorId: 'me',
        authorName: state.profile.name || state.character.name || '모험가',
        authorSpecies: state.character.species,
        authorLevel: state.character.level,
        content: action.content,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedByMe: false,
      };
      return { ...state, posts: [post, ...state.posts] };
    }

    case 'TOGGLE_LIKE_POST':
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.id
            ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
            : p
        ),
      };

    case 'TOGGLE_FOLLOW': {
      const isFollowing = state.followingIds.includes(action.authorId);
      return {
        ...state,
        followingIds: isFollowing
          ? state.followingIds.filter((id) => id !== action.authorId)
          : [...state.followingIds, action.authorId],
      };
    }

    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) };

    default:
      return state;
  }
}

interface FullState extends AppState {
  _levelUp?: number;
  _milestone?: number;
}

function appReducer(
  state: FullState,
  action: Action,
): FullState {
  const next = reducer(state, action) as FullState;
  save(next);
  return next;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initialState = load();
  const checkedState = {
    ...initialState,
    streak: checkStreakOnLoad(initialState.streak),
  };

  const [state, dispatch] = useReducer(appReducer, checkedState as FullState);

  const levelUpInfo = (state as FullState)._levelUp
    ? { newLevel: (state as FullState)._levelUp! }
    : null;
  const milestoneInfo = (state as FullState)._milestone ?? null;

  const todayStr = today();
  const todayTasks = state.tasks.filter((t) => t.date === todayStr);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const todayTotal = todayTasks.length;

  useEffect(() => {
    save(state);
  }, [state]);

  return (
    <AppContext.Provider
      value={{ state, dispatch, levelUpInfo, milestoneInfo, todayTasks, todayCompleted, todayTotal }}
    >
      {children}
    </AppContext.Provider>
  );
}
