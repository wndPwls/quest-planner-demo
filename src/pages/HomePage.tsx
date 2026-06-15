import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/useApp';
import type { Goal, Task } from '../types';
import DefaultAvatar from '../components/DefaultAvatar';
import LevelUpModal from '../components/LevelUpModal';
import MilestoneModal from '../components/MilestoneModal';
import AddPlanModal from '../components/AddPlanModal';
import './HomePage.css';

const KR_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6;
  return `${String(h).padStart(2, '0')}:00`;
});

const STATUS_COLOR: Record<string, string> = {
  online: '#00a884',
  away: '#f4c430',
  offline: '#c8bdb5',
};

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

function isGoalActiveOn(goal: Goal, dateStr: string): boolean {
  if (!goal.startDate && !goal.deadline) return false;
  if (goal.startDate && dateStr < goal.startDate) return false;
  if (goal.deadline && dateStr > goal.deadline) return false;
  return true;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { state, dispatch, levelUpInfo, milestoneInfo } = useApp();
  const { profile, tasks, goals } = state;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(todayDate);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const xpToastCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 주간 날짜 계산
  const monday = getMondayOfWeek(todayDate);
  monday.setDate(monday.getDate() + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const selDate = new Date(selectedDate + 'T00:00:00');
  const dayTasks = tasks.filter(t => t.date === selectedDate);

  // 선택된 날짜에 해당하는 장기 목표
  const activeGoals = goals.filter(g => isGoalActiveOn(g, selectedDate));
  const timedGoals = activeGoals.filter(g => !!g.time);
  const allDayGoals = activeGoals.filter(g => !g.time);

  function getSlotTasks(hour: number) {
    return dayTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) === hour);
  }

  function getSlotGoals(hour: number) {
    return timedGoals.filter(g => g.time && parseInt(g.time.split(':')[0]) === hour);
  }

  function handleSlotClick(slot: string) {
    setActiveSlot(slot);
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  function commitSlot(slot: string) {
    const title = inputVal.trim();
    if (title) {
      dispatch({ type: 'ADD_TASK', task: { title, date: selectedDate, time: slot } });
    }
    setActiveSlot(null);
    setInputVal('');
  }

  function handleModalSave(title: string, time: string, endTime: string, notification: string, color: string) {
    dispatch({
      type: 'ADD_TASK',
      task: {
        title,
        date: selectedDate,
        time: time || undefined,
        endTime: endTime || undefined,
        notification: notification || undefined,
        color: color || undefined,
      },
    });
    setShowModal(false);
  }

  function toggleTask(id: string, completed: boolean) {
    dispatch({ type: completed ? 'UNCOMPLETE_TASK' : 'COMPLETE_TASK', id });
    if (!completed) {
      xpToastCounter.current += 1;
      setXpToast(xpToastCounter.current);
    }
  }

  useEffect(() => {
    if (xpToast === null) return;
    const timer = setTimeout(() => setXpToast(null), 1200);
    return () => clearTimeout(timer);
  }, [xpToast]);

  function startTaskPress(task: Task) {
    pressTimer.current = setTimeout(() => {
      setActionTask(task);
    }, 500);
  }

  function endTaskPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  function handleEditSave(title: string, time: string, endTime: string, notification: string, color: string) {
    if (!editTask) return;
    dispatch({
      type: 'UPDATE_TASK',
      id: editTask.id,
      patch: {
        title,
        time: time || undefined,
        endTime: endTime || undefined,
        notification: notification || undefined,
        color: color || undefined,
      },
    });
    setEditTask(null);
  }

  function toggleGoalDay(id: string) {
    dispatch({ type: 'TOGGLE_GOAL_COMPLETION', id, date: selectedDate });
  }

  return (
    <div className="home-root">
      {levelUpInfo && (
        <LevelUpModal level={levelUpInfo.newLevel} onClose={() => dispatch({ type: 'DISMISS_LEVEL_UP' })} />
      )}
      {milestoneInfo && !levelUpInfo && (
        <MilestoneModal days={milestoneInfo} onClose={() => dispatch({ type: 'DISMISS_MILESTONE' })} />
      )}

      {xpToast !== null && (
        <div key={xpToast} className="xp-toast">+10 XP</div>
      )}

      {/* ── 상단 고정 영역 ── */}
      <div className="home-fixed">
        {/* 프로필 미니바 */}
        <div className="home-profile" onClick={() => navigate('/myinfo')}>
          <div className="home-avatar-wrap">
            {profile.photo
              ? <img src={profile.photo} alt="" className="home-avatar-img" />
              : <DefaultAvatar size={54} />}
            <span className="home-status-dot" style={{ background: STATUS_COLOR[profile.status] ?? '#c8bdb5' }} />
          </div>
          <div className="home-profile-texts">
            <span className="home-profile-name">{profile.name || '모험가'}</span>
            {profile.bio && <span className="home-profile-bio">{profile.bio}</span>}
          </div>
          <div className="home-profile-stats">
            <div className="home-profile-stat">
              <span className="home-profile-stat-num">{state.followingIds.length}</span>
              <span className="home-profile-stat-label">팔로잉</span>
            </div>
            <div className="home-profile-stat">
              <span className="home-profile-stat-num">{profile.followersCount}</span>
              <span className="home-profile-stat-label">팔로워</span>
            </div>
          </div>
        </div>

        {/* 날짜 + 주 이동 */}
        <div className="home-date-row">
          <button className="week-arrow" onClick={() => setWeekOffset(o => o - 1)}>‹</button>
          <span className="home-date-text">
            {selDate.getFullYear()}년&nbsp;{selDate.getMonth() + 1}월&nbsp;{selDate.getDate()}일
          </span>
          <button className="week-arrow" onClick={() => setWeekOffset(o => o + 1)}>›</button>
        </div>

        {/* 주간 스트립 */}
        <div className="week-strip">
          {weekDays.map((d, i) => {
            const ds = toDateStr(d);
            const isSelected = ds === selectedDate;
            const isToday = ds === todayStr;
            return (
              <button
                key={ds}
                className={`week-cell ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''}`}
                onClick={() => setSelectedDate(ds)}
              >
                <span className="week-cell-day">{KR_DAYS[i]}</span>
                <span className="week-cell-num">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* 헤더 */}
        <div className="sched-header">
          <div className="sched-time-col">시간</div>
          <div className="sched-content-col">계획</div>
        </div>
      </div>

      {/* ── 스크롤 가능한 시간표 ── */}
      <div className="home-scroll">

        {/* 종일 목표 (시간 없는 장기 목표) */}
        {allDayGoals.length > 0 && (
          <div className="sched-row allday-row">
            <div className="sched-time allday-label">종일</div>
            <div className="sched-content allday-content">
              {allDayGoals.map(goal => {
                const checked = goal.completions.includes(selectedDate);
                return (
                  <div
                    key={goal.id}
                    className={`sched-goal ${checked ? 'goal-done' : ''}`}
                    style={{ borderLeftColor: goal.color }}
                    onClick={e => { e.stopPropagation(); toggleGoalDay(goal.id); }}
                  >
                    <span className={`sched-goal-check ${checked ? 'checked' : ''}`} style={checked ? { background: goal.color, borderColor: goal.color } : {}} />
                    <span className="sched-goal-title">{goal.title}</span>
                    <span className="sched-goal-badge">목표</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {TIME_SLOTS.map(slot => {
          const hour = parseInt(slot);
          const slotTasks = getSlotTasks(hour);
          const slotGoals = getSlotGoals(hour);
          const isActive = activeSlot === slot;
          const hasItems = slotTasks.length > 0 || slotGoals.length > 0;

          return (
            <div key={slot} className="sched-row">
              <div className="sched-time">{slot}</div>
              <div
                className="sched-content"
                onClick={() => { if (!isActive) handleSlotClick(slot); }}
              >
                {/* 장기 목표 */}
                {slotGoals.map(goal => {
                  const checked = goal.completions.includes(selectedDate);
                  return (
                    <div
                      key={goal.id}
                      className={`sched-goal ${checked ? 'goal-done' : ''}`}
                      style={{ borderLeftColor: goal.color }}
                      onClick={e => { e.stopPropagation(); toggleGoalDay(goal.id); }}
                    >
                      <span className={`sched-goal-check ${checked ? 'checked' : ''}`} style={checked ? { background: goal.color, borderColor: goal.color } : {}} />
                      <span className="sched-goal-title">{goal.title}</span>
                      <span className="sched-goal-badge">목표</span>
                    </div>
                  );
                })}

                {/* 일반 태스크 */}
                {slotTasks.map(task => (
                  <div
                    key={task.id}
                    className={`sched-task ${task.completed ? 'done' : ''}`}
                    style={task.color ? { borderLeft: `3px solid ${task.color}`, paddingLeft: 6, borderRadius: '0 4px 4px 0' } : {}}
                    onClick={e => { e.stopPropagation(); toggleTask(task.id, task.completed); }}
                    onMouseDown={e => { e.stopPropagation(); startTaskPress(task); }}
                    onMouseUp={endTaskPress}
                    onMouseLeave={endTaskPress}
                    onTouchStart={e => { e.stopPropagation(); startTaskPress(task); }}
                    onTouchEnd={endTaskPress}
                    onTouchCancel={endTaskPress}
                  >
                    <span className={`sched-check ${task.completed ? 'checked' : ''}`}
                      style={task.color && task.completed ? { background: task.color, borderColor: task.color } : {}} />
                    <span className="sched-title">
                      {task.endTime ? `${task.time}~${task.endTime} ` : ''}{task.title}
                    </span>
                  </div>
                ))}

                {isActive ? (
                  <input
                    ref={inputRef}
                    className="slot-input"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="계획 입력 후 Enter"
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitSlot(slot);
                      if (e.key === 'Escape') setActiveSlot(null);
                    }}
                    onBlur={() => commitSlot(slot)}
                  />
                ) : (
                  !hasItems && <div className="slot-empty" />
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: 80 }} />
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowModal(true)}>+</button>

      {showModal && (
        <AddPlanModal
          defaultDate={selectedDate}
          onSave={handleModalSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* 수정 모달 */}
      {editTask && (
        <AddPlanModal
          defaultDate={selectedDate}
          initialValues={{
            title: editTask.title,
            time: editTask.time,
            endTime: editTask.endTime,
            notification: editTask.notification,
            color: editTask.color,
          }}
          onSave={handleEditSave}
          onClose={() => setEditTask(null)}
        />
      )}

      {/* 롱프레스 액션 시트 */}
      {actionTask && (
        <div className="task-action-overlay" onClick={() => setActionTask(null)}>
          <div className="task-action-sheet" onClick={e => e.stopPropagation()}>
            <div className="task-action-handle" />
            <div className="task-action-name">{actionTask.title}</div>
            <button
              className="task-action-btn"
              onClick={() => { setEditTask(actionTask); setActionTask(null); }}
            >
              계획 수정하기
            </button>
            <button
              className="task-action-btn delete"
              onClick={() => { dispatch({ type: 'DELETE_TASK', id: actionTask.id }); setActionTask(null); }}
            >
              계획 삭제하기
            </button>
            <button className="task-action-cancel" onClick={() => setActionTask(null)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
