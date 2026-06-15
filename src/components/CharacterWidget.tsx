import { useApp } from '../contexts/useApp';
import { getCharacterStage, getLevelIcon, xpForCurrentLevel, xpToNextLevel } from '../store/gameLogic';
import './CharacterWidget.css';

const stageNames = ['새싹', '견습생', '탐험가', '전사', '영웅', '전설'];
const stageBodies = ['stage-0', 'stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5'];

export default function CharacterWidget() {
  const { state, todayCompleted, todayTotal } = useApp();
  const { character } = state;
  const stage = getCharacterStage(character.level);
  const icon = getLevelIcon(character.level);
  const currentXp = xpForCurrentLevel(character.totalXp);
  const nextXp = xpToNextLevel();
  const progress = (currentXp / nextXp) * 100;

  return (
    <div className="character-widget">
      <div className={`character-body ${stageBodies[stage]}`}>
        <div className="character-icon">{icon}</div>
        {todayCompleted > 0 && todayCompleted === todayTotal && todayTotal > 0 && (
          <div className="character-halo">✨</div>
        )}
      </div>
      <div className="character-info">
        <div className="character-name">{character.name}</div>
        <div className="character-stage">{stageNames[stage]}</div>
        <div className="level-badge">Lv.{character.level}</div>
        <div className="xp-bar-container">
          <div className="xp-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="xp-text">
          {currentXp} / {nextXp} XP
        </div>
      </div>
    </div>
  );
}
