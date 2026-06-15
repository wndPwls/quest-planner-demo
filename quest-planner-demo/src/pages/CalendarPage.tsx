import { useState } from 'react';
import { useApp } from '../contexts/useApp';
import type { Goal, Task } from '../types';
import { today } from '../store/storage';
import './CalendarPage.css';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DEFAULT_COLOR = '#a89890';
const MAX_BARS = 3;

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function isGoalActiveOn(goal: Goal, dateStr: string) {
  if (!goal.startDate && !goal.deadline) return false;
  if (goal.startDate && dateStr < goal.startDate) return false;
  if (goal.deadline && dateStr > goal.deadline) return false;
  return true;
}

interface BarEvent {
  id: string;
  title: string;
  color: string;
  colStart: number;
  colEnd: number;
  startsHere: boolean;
  endsHere: boolean;
}

export default function CalendarPage() {
  const { state, dispatch } = useApp();
  const { tasks, goals } = state;
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    toDateStr(now.getFullYear(), now.getMonth(), now.getDate())
  );
  const todayStr = today();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // task dots per date
  const taskMap: Record<string, Task[]> = {};
  for (const t of tasks) {
    if (!taskMap[t.date]) taskMap[t.date] = [];
    taskMap[t.date].push(t);
  }

  function getWeekBars(week: (number | null)[]): BarEvent[] {
    const weekDates = week.map(d => d ? toDateStr(viewYear, viewMonth, d) : null);
    const nonNull = weekDates.filter(Boolean) as string[];
    if (!nonNull.length) return [];
    const weekStart = nonNull[0];
    const weekEnd = nonNull[nonNull.length - 1];

    return goals
      .filter(g => {
        if (!g.startDate && !g.deadline) return false;
        const gs = g.startDate ?? weekStart;
        const ge = g.deadline ?? weekEnd;
        return gs <= weekEnd && ge >= weekStart;
      })
      .map(g => {
        const gs = g.startDate ?? weekStart;
        const ge = g.deadline ?? weekEnd;
        const cs = gs < weekStart ? weekStart : gs;
        const ce = ge > weekEnd ? weekEnd : ge;
        const colStart = weekDates.findIndex(d => d === cs) + 1;
        const colEnd = weekDates.findIndex(d => d === ce) + 1;
        if (colStart === 0 || colEnd === 0) return null;
        return {
          id: g.id,
          title: g.title,
          color: g.color,
          colStart,
          colEnd,
          startsHere: gs >= weekStart,
          endsHere: ge <= weekEnd,
        } as BarEvent;
      })
      .filter(Boolean) as BarEvent[];
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  // Selected day detail
  const selDateObj = new Date(selectedDate + 'T00:00:00');
  const selLabel = `${selDateObj.getMonth() + 1}월 ${selDateObj.getDate()}일 (${WEEKDAYS[selDateObj.getDay()]})`;

  const selTasks = (taskMap[selectedDate] ?? []).sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1; if (b.time) return 1;
    return Number(a.completed) - Number(b.completed);
  });
  const selGoals = goals.filter(g => isGoalActiveOn(g, selectedDate));

  function toggleTask(id: string, completed: boolean) {
    dispatch({ type: completed ? 'UNCOMPLETE_TASK' : 'COMPLETE_TASK', id });
  }
  function toggleGoalDay(id: string) {
    dispatch({ type: 'TOGGLE_GOAL_COMPLETION', id, date: selectedDate });
  }

  return (
    <div className="page calendar-page">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="cal-title">{viewYear}년 {MONTHS[viewMonth]}</span>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="cal-weekdays">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`cal-weekday ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{d}</div>
        ))}
      </div>

      <div className="cal-month">
        {weeks.map((week, wi) => {
          const bars = getWeekBars(week);
          const visible = bars.slice(0, MAX_BARS);
          const hidden = bars.length - MAX_BARS;

          return (
            <div key={wi} className="cal-week">
              {/* 날짜 셀 */}
              <div className="cal-days-row">
                {week.map((day, di) => {
                  if (day === null) return <div key={`n-${di}`} className="cal-day-empty" />;
                  const ds = toDateStr(viewYear, viewMonth, day);
                  const isToday = ds === todayStr;
                  const isSel = ds === selectedDate;
                  const dow = (firstDay + day - 1) % 7;
                  const dayTasks = taskMap[ds] ?? [];

                  return (
                    <button
                      key={ds}
                      className={[
                        'cal-day',
                        isToday ? 'today' : '',
                        isSel ? 'selected' : '',
                        dow === 0 ? 'sun' : dow === 6 ? 'sat' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => setSelectedDate(ds)}
                    >
                      <span className="cal-day-num">{day}</span>
                      {dayTasks.length > 0 && (
                        <div className="cal-dots">
                          {dayTasks.slice(0, 3).map((t, i) => (
                            <span key={i} className="cal-dot" style={{ background: t.color ?? DEFAULT_COLOR }} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 이벤트 바 (장기 목표) */}
              {(visible.length > 0 || hidden > 0) && (
                <div className="cal-bars-grid">
                  {visible.map(bar => (
                    <div
                      key={bar.id}
                      className="cal-bar"
                      style={{
                        gridColumn: `${bar.colStart} / ${bar.colEnd + 1}`,
                        background: bar.color,
                        borderRadius: bar.startsHere && bar.endsHere ? '4px'
                          : bar.startsHere ? '4px 0 0 4px'
                          : bar.endsHere ? '0 4px 4px 0'
                          : '0',
                        marginLeft: bar.startsHere ? 2 : 0,
                        marginRight: bar.endsHere ? 2 : 0,
                      }}
                    >
                      {bar.startsHere && <span className="cal-bar-title">{bar.title}</span>}
                    </div>
                  ))}
                  {hidden > 0 && (
                    <div className="cal-more">+{hidden}개 더</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 선택일 상세 */}
      <div className="cal-detail">
        <div className="cal-detail-header">
          <span className="cal-detail-label">{selLabel}</span>
        </div>

        {selGoals.length === 0 && selTasks.length === 0 && (
          <div className="cal-empty">이 날의 일정이 없습니다</div>
        )}

        {selGoals.map(goal => {
          const checked = goal.completions.includes(selectedDate);
          return (
            <div key={goal.id} className="cal-item" style={{ borderLeftColor: goal.color }}>
              <div className="cal-item-left">
                <span className="cal-item-tag" style={{ color: goal.color }}>목표</span>
                <span className={`cal-item-title ${checked ? 'done' : ''}`}>{goal.title}</span>
              </div>
              <button
                className={`cal-check-box ${checked ? 'checked' : ''}`}
                style={checked ? { background: goal.color, borderColor: goal.color } : {}}
                onClick={() => toggleGoalDay(goal.id)}
              />
            </div>
          );
        })}

        {selTasks.map(task => {
          const color = task.color ?? DEFAULT_COLOR;
          return (
            <div
              key={task.id}
              className={`cal-item ${task.completed ? 'done' : ''}`}
              style={{ borderLeftColor: color }}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              <div className="cal-item-left">
                {task.time && (
                  <span className="cal-item-time">
                    {task.time}{task.endTime ? `~${task.endTime}` : ''}
                  </span>
                )}
                <span className={`cal-item-title ${task.completed ? 'done' : ''}`}>{task.title}</span>
              </div>
              <span
                className={`cal-check-box ${task.completed ? 'checked' : ''}`}
                style={task.completed ? { background: color, borderColor: color } : {}}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
