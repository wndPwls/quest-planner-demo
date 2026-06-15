import { useApp } from '../contexts/useApp';
import { STREAK_MILESTONES } from '../store/gameLogic';
import './StreakWidget.css';

export default function StreakWidget() {
  const { state } = useApp();
  const { streak } = state;
  const nextMilestone = STREAK_MILESTONES.find((m) => m > streak.count);

  return (
    <div className="streak-widget">
      <div className="streak-icon">🔥</div>
      <div className="streak-info">
        <div className="streak-count">{streak.count}일</div>
        <div className="streak-label">연속 달성</div>
      </div>
      <div className="streak-right">
        <div className="best-streak">최고 {streak.bestStreak}일</div>
        {nextMilestone && (
          <div className="next-milestone">다음 보상: {nextMilestone}일</div>
        )}
        <div className="milestone-dots">
          {STREAK_MILESTONES.slice(0, 4).map((m) => (
            <div
              key={m}
              className={`milestone-dot ${streak.milestones.includes(m) ? 'achieved' : ''}`}
              title={`${m}일`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
