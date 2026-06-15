import type { Character, Streak, Achievement } from '../types';
import { today, yesterday } from './storage';

const XP_PER_TASK = 10;
export const STREAK_MILESTONES = [7, 14, 30, 60, 100, 365];

export function calcLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export function xpForCurrentLevel(totalXp: number): number {
  const level = calcLevel(totalXp);
  return totalXp - (level - 1) * 100;
}

export function xpToNextLevel(): number {
  return 100;
}

export function addXp(
  character: Character,
  taskCount: number = 1,
): { character: Character; leveledUp: boolean; newLevel: number } {
  const gained = XP_PER_TASK * taskCount;
  const oldLevel = character.level;
  const newTotalXp = character.totalXp + gained;
  const newLevel = calcLevel(newTotalXp);
  const leveledUp = newLevel > oldLevel;

  const achievements: Achievement[] = [...character.achievements];
  if (leveledUp) {
    achievements.push({
      id: `level-${newLevel}`,
      name: `레벨 ${newLevel} 달성`,
      icon: getLevelIcon(newLevel),
      earnedAt: new Date().toISOString(),
    });
  }

  return {
    character: { ...character, totalXp: newTotalXp, level: newLevel, achievements },
    leveledUp,
    newLevel,
  };
}

export function getLevelIcon(level: number): string {
  if (level >= 20) return '👑';
  if (level >= 15) return '🌟';
  if (level >= 10) return '⭐';
  if (level >= 7) return '🔥';
  if (level >= 5) return '🌳';
  if (level >= 3) return '🌿';
  return '🌱';
}

export function getCharacterStage(level: number): number {
  if (level >= 15) return 5;
  if (level >= 10) return 4;
  if (level >= 7) return 3;
  if (level >= 4) return 2;
  if (level >= 2) return 1;
  return 0;
}

export function updateStreak(
  streak: Streak,
  hasCompletedToday: boolean,
): { streak: Streak; newMilestone: number | null } {
  const t = today();
  const y = yesterday();

  let newCount = streak.count;
  let newMilestone: number | null = null;

  if (streak.lastDate === t) {
    // Already updated today - no change needed
    return { streak, newMilestone: null };
  }

  if (hasCompletedToday) {
    if (streak.lastDate === y || streak.lastDate === '') {
      newCount = streak.count + 1;
    } else if (streak.lastDate !== t) {
      newCount = 1; // broken streak, restart
    }

    const bestStreak = Math.max(streak.bestStreak, newCount);
    const milestones = [...streak.milestones];

    for (const m of STREAK_MILESTONES) {
      if (newCount >= m && !milestones.includes(m)) {
        milestones.push(m);
        newMilestone = m;
        break;
      }
    }

    return {
      streak: { count: newCount, lastDate: t, bestStreak, milestones },
      newMilestone,
    };
  }

  // Not completed today; check if streak should reset
  if (streak.lastDate && streak.lastDate !== y && streak.lastDate !== t) {
    return {
      streak: { ...streak, count: 0 },
      newMilestone: null,
    };
  }

  return { streak, newMilestone: null };
}

export function checkStreakOnLoad(streak: Streak): Streak {
  const t = today();
  const y = yesterday();
  if (streak.lastDate && streak.lastDate !== t && streak.lastDate !== y) {
    return { ...streak, count: 0 };
  }
  return streak;
}
