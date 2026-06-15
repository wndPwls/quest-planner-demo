import { today } from './storage';

const QUOTES = [
  { text: "계획 없는 목표는 그저 소망일 뿐이다.", author: "앙투안 드 생텍쥐페리" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
  { text: "천 리 길도 한 걸음부터.", author: "노자" },
  { text: "성공은 매일 반복하는 작은 노력들의 합이다.", author: "로버트 콜리어" },
  { text: "꿈을 이루는 유일한 방법은 지금 당장 시작하는 것이다.", author: "작자 미상" },
  { text: "준비하지 않으면, 실패를 준비하는 것이다.", author: "벤저민 프랭클린" },
  { text: "목표를 세분화하라. 거대한 것도 작게 나누면 해낼 수 있다.", author: "헨리 포드" },
  { text: "행동이 항상 행복을 만들지는 않는다. 그러나 행동 없이는 행복이 없다.", author: "벤저민 디즈레일리" },
  { text: "시작이 반이다.", author: "아리스토텔레스" },
  { text: "무엇을 할지 알면, 언제 할지는 저절로 안다.", author: "피터 드러커" },
  { text: "집중이란 '아니오'라고 말하는 기술이다.", author: "스티브 잡스" },
  { text: "습관은 제2의 천성이다.", author: "키케로" },
  { text: "작은 진전도 진전이다.", author: "작자 미상" },
  { text: "계획을 세우는 데 실패하는 것은, 실패를 계획하는 것이다.", author: "윈스턴 처칠" },
  { text: "가장 중요한 일을 먼저 하라.", author: "괴테" },
  { text: "완벽한 계획보다 지금 당장 실행하는 것이 낫다.", author: "패튼 장군" },
  { text: "자신을 믿어라. 당신은 생각보다 훨씬 많은 것을 할 수 있다.", author: "작자 미상" },
  { text: "목표는 마감 기한이 있는 꿈이다.", author: "다이아나 헌트" },
  { text: "규칙적인 삶은 창의적인 사람의 최고의 친구다.", author: "귀스타브 플로베르" },
  { text: "과거는 바꿀 수 없지만 지금 이 순간은 바꿀 수 있다.", author: "작자 미상" },
];

const KEY = 'qp-daily-quote';

interface StoredQuote {
  date: string;
  index: number;
}

export function getDailyQuote(): { text: string; author: string } {
  const t = today();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const stored: StoredQuote = JSON.parse(raw);
      if (stored.date === t) {
        return QUOTES[stored.index % QUOTES.length];
      }
    }
  } catch { /* ignore */ }

  const index = Math.floor(Math.random() * QUOTES.length);
  localStorage.setItem(KEY, JSON.stringify({ date: t, index }));
  return QUOTES[index];
}
