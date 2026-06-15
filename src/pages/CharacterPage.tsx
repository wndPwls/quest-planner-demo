import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/useApp';
import { getCharacterStage, getLevelIcon, xpForCurrentLevel, xpToNextLevel } from '../store/gameLogic';
import CharacterAvatar from '../components/CharacterAvatar';
import { StoreIcon } from '../components/Icons';
import './CharacterPage.css';

const STAGE_NAMES = ['새싹', '견습생', '탐험가', '전사', '영웅', '전설'];
const STAGE_DESC = [
  '',
  '기초를 익혀가는 중. 꾸준함이 힘이다.',
  '세상을 탐험하는 용기 있는 자.',
  '수많은 퀘스트를 완수한 전사.',
  '전설의 반열에 오른 영웅.',
  '모든 모험가의 귀감이 되는 전설.',
];

export default function CharacterPage() {
  const navigate = useNavigate();
  const { state, todayCompleted, todayTotal } = useApp();
  const { character } = state;
  const stage = getCharacterStage(character.level);
  const icon = getLevelIcon(character.level);
  const currentXp = xpForCurrentLevel(character.totalXp);
  const nextXp = xpToNextLevel();
  const progress = (currentXp / nextXp) * 100;

  const totalTasksDone = state.tasks.filter((t) => t.completed).length;

  return (
    <div className="page character-page">
      <div className="character-page-header">
        <h1 className="page-title">캐릭터</h1>
        <button className="shop-btn" onClick={() => navigate('/shop')}>
          <StoreIcon size={22} />
          <span className="shop-btn-label">상점</span>
        </button>
      </div>

      <div className="character-showcase">
        <div className={`showcase-body stage-${stage}`}>
          {stage === 0 ? (
            <CharacterAvatar species={character.species} size={130} />
          ) : (
            <div className="showcase-icon">{icon}</div>
          )}
          {todayCompleted === todayTotal && todayTotal > 0 && (
            <div className="showcase-aura" />
          )}
        </div>
        <div className="showcase-name">{character.name}</div>
        <div className="showcase-stage">{STAGE_NAMES[stage]}</div>
        {STAGE_DESC[stage] && (
          <div className="showcase-stage-desc">{STAGE_DESC[stage]}</div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">Lv.{character.level}</div>
          <div className="stat-label">현재 레벨</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{character.totalXp}</div>
          <div className="stat-label">총 획득 XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{state.streak.bestStreak}</div>
          <div className="stat-label">최고 스트릭</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalTasksDone}</div>
          <div className="stat-label">완료한 퀘스트</div>
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-section-header">
          <span>경험치</span>
          <span>{currentXp} / {nextXp} XP</span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="xp-next">다음 레벨까지 {nextXp - currentXp} XP</div>
      </div>

      {character.achievements.length > 0 && (
        <div className="achievements-section">
          <h2 className="section-title">🏆 업적</h2>
          <div className="achievements-list">
            {character.achievements.map((a) => (
              <div key={a.id} className="achievement-item">
                <span className="achievement-icon">{a.icon}</span>
                <span className="achievement-name">{a.name}</span>
                <span className="achievement-date">
                  {new Date(a.earnedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.streak.milestones.length > 0 && (
        <div className="achievements-section">
          <h2 className="section-title">🔥 스트릭 달성</h2>
          <div className="milestone-badges">
            {state.streak.milestones.map((m) => (
              <div key={m} className="milestone-badge">
                <span>🔥</span> {m}일
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
