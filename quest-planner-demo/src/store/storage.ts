import type { AppState, CharacterSpecies, CommunityPost } from '../types';

const KEY = 'qp-data';

const SPECIES: CharacterSpecies[] = ['fox', 'bear', 'rabbit', 'chick'];

export function randomSpecies(): CharacterSpecies {
  return SPECIES[Math.floor(Math.random() * SPECIES.length)];
}

function seedPosts(): CommunityPost[] {
  const now = Date.now();
  return [
    {
      id: 'seed-1',
      authorId: 'user-jjugun',
      authorName: '꾸준이',
      authorSpecies: 'bear',
      authorLevel: 8,
      content: '계획을 너무 빡빡하게 짜면 하루만에 무너지더라고요. 할 일을 70%만 채우고 나머지는 여유로 남겨두니까 오히려 매일 완료율이 올라갔어요.',
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
      likes: 15,
      likedByMe: false,
    },
    {
      id: 'seed-2',
      authorId: 'user-rabbitrun',
      authorName: '토끼런',
      authorSpecies: 'rabbit',
      authorLevel: 4,
      content: '아침에 가장 하기 싫은 일부터 먼저 처리하니까 하루가 훨씬 가벼워져요. "오늘의 가장 싫은 일"을 1번 슬롯에 배치하는 습관, 강력 추천!',
      createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      likes: 22,
      likedByMe: false,
    },
    {
      id: 'seed-3',
      authorId: 'user-dawn',
      authorName: '여명',
      authorSpecies: 'fox',
      authorLevel: 12,
      content: '장기 목표는 꼭 시작일과 마감일을 같이 적어두세요. 기한이 없으면 머릿속에서만 계획으로 남고 실제로는 진행이 안 되더라고요.',
      createdAt: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
      likes: 18,
      likedByMe: false,
    },
    {
      id: 'seed-4',
      authorId: 'user-stepone',
      authorName: '한걸음',
      authorSpecies: 'chick',
      authorLevel: 6,
      content: '큰 목표를 세울 때 "이번 주에 할 수 있는 가장 작은 행동"으로 쪼개서 적어보세요. 작게 시작해도 체크 표시가 쌓이면 동기부여가 확실히 다릅니다.',
      createdAt: new Date(now - 1000 * 60 * 60 * 30).toISOString(),
      likes: 9,
      likedByMe: false,
    },
    {
      id: 'seed-5',
      authorId: 'user-calmocean',
      authorName: '고요한바다',
      authorSpecies: 'bear',
      authorLevel: 10,
      content: '스트릭이 끊겼다고 너무 자책하지 마세요. 다시 시작한 날이 진짜 시작이에요. 저도 30일 스트릭 끊긴 후 다시 60일 채웠습니다.',
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      likes: 31,
      likedByMe: false,
    },
  ];
}

export const defaultState: AppState = {
  tasks: [],
  goals: [],
  character: {
    name: '모험가',
    totalXp: 0,
    level: 1,
    achievements: [],
    species: 'fox',
  },
  streak: {
    count: 0,
    lastDate: '',
    bestStreak: 0,
    milestones: [],
  },
  claudeApiKey: '',
  profile: {
    name: '모험가',
    email: '',
    bio: '',
    status: 'online',
    followersCount: 0,
  },
  posts: [],
  followingIds: [],
};

const DEFAULT_FOLLOWING = ['user-jjugun', 'user-dawn', 'user-calmocean'];

export function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return {
        ...defaultState,
        character: { ...defaultState.character, species: randomSpecies() },
        profile: { ...defaultState.profile, followersCount: 12 },
        posts: seedPosts(),
        followingIds: DEFAULT_FOLLOWING,
      };
    }
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...defaultState,
      ...parsed,
      character: {
        ...defaultState.character,
        ...parsed.character,
        species: parsed.character?.species ?? randomSpecies(),
      },
      profile: {
        ...defaultState.profile,
        ...parsed.profile,
        followersCount: parsed.profile?.followersCount ?? 128,
      },
      goals: (parsed.goals ?? []).map((g) => ({
        ...g,
        completions: g.completions ?? [],
      })),
      posts: parsed.posts ?? seedPosts(),
      followingIds: parsed.followingIds ?? DEFAULT_FOLLOWING,
    };
  } catch {
    return {
      ...defaultState,
      character: { ...defaultState.character, species: randomSpecies() },
      posts: seedPosts(),
      followingIds: DEFAULT_FOLLOWING,
    };
  }
}

export function save(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
