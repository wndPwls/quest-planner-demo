import { useRef } from 'react';
import type { Goal, Task } from '../types';
import { useApp } from '../contexts/useApp';
import { today } from '../store/storage';
import './GoalCard.css';

interface Props {
  goal: Goal;
  tasks: Task[];
  onLongPress: () => void;
}

function totalDays(startDate: string, deadline: string): number {
  const s = new Date(startDate + 'T00:00:00').getTime();
  const e = new Date(deadline + 'T00:00:00').getTime();
  return Math.max(1, Math.floor((e - s) / 86400000) + 1);
}

function formatDate(d: string) {
  const [, m, day] = d.split('-');
  return `${parseInt(m)}/${parseInt(day)}`;
}

export default function GoalCard({ goal, tasks, onLongPress }: Props) {
  const { dispatch } = useApp();
  const todayStr = today();
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const hasDates = !!(goal.startDate && goal.deadline);
  const total = hasDates ? totalDays(goal.startDate!, goal.deadline!) : null;
  const done = goal.completions.length;
  const pct = total ? Math.min(100, Math.round((done / total) * 100)) : null;

  const checkedToday = goal.completions.includes(todayStr);
  const canCheck = hasDates
    ? todayStr >= goal.startDate! && todayStr <= goal.deadline!
    : true;

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime()) / 86400000)
    : null;

  function startPress() {
    didLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
    }, 500);
  }

  function endPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  function handleCheck(e: React.MouseEvent) {
    e.stopPropagation();
    if (!canCheck) return;
    dispatch({ type: 'TOGGLE_GOAL_COMPLETION', id: goal.id, date: todayStr });
  }

  return (
    <div
      className="goal-card"
      style={{ borderColor: goal.color }}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
    >
      <div className="goal-header">
        <div className="goal-header-left">
          <div className="goal-title">{goal.title}</div>
          {hasDates && (
            <div className="goal-dates">
              {formatDate(goal.startDate!)} ~ {formatDate(goal.deadline!)}
              {goal.time && <span className="goal-time"> · {goal.time}</span>}
            </div>
          )}
        </div>
        <div className="goal-header-right">
          <button
            className={`goal-check-btn ${checkedToday ? 'checked' : ''} ${!canCheck ? 'disabled' : ''}`}
            onClick={handleCheck}
            title={checkedToday ? '오늘 체크 취소' : '오늘 체크'}
          />
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${pct ?? Math.min(100, done)}%`, background: goal.color }}
        />
      </div>

      <div className="goal-footer">
        <span className="progress-text">
          {total ? `${done}일 / ${total}일 완료` : `${done}일 완료`}
          {pct !== null && <span className="progress-pct"> · {pct}%</span>}
        </span>
        {daysLeft !== null && (
          <span className={`deadline ${daysLeft < 3 ? 'urgent' : ''}`}>
            {daysLeft > 0 ? `D-${daysLeft}` : daysLeft === 0 ? '오늘까지!' : '종료'}
          </span>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="goal-task-count">
          세부 할 일 {tasks.filter(t => t.completed).length}/{tasks.length}
        </div>
      )}
    </div>
  );
}
