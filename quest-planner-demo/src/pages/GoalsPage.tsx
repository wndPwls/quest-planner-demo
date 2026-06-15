import { useState } from 'react';
import { useApp } from '../contexts/useApp';
import type { Goal } from '../types';
import GoalCard from '../components/GoalCard';
import TaskItem from '../components/TaskItem';
import AddTaskForm from '../components/AddTaskForm';
import AddGoalModal from '../components/AddGoalModal';
import AIPlannerSection from '../components/AIPlannerSection';
import './GoalsPage.css';

export default function GoalsPage() {
  const { state, dispatch } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showTaskFormFor, setShowTaskFormFor] = useState<string | null>(null);

  // 롱프레스 액션 시트
  const [actionGoal, setActionGoal] = useState<Goal | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  function handleAddGoal(goal: {
    title: string; description: string;
    startDate?: string; deadline?: string; time?: string; color: string;
  }) {
    dispatch({ type: 'ADD_GOAL', goal });
    setShowAddModal(false);
  }

  function handleUpdateGoal(goal: {
    title: string; description: string;
    startDate?: string; deadline?: string; time?: string; color: string;
  }) {
    if (!editGoal) return;
    dispatch({ type: 'UPDATE_GOAL', id: editGoal.id, goal });
    setEditGoal(null);
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_GOAL', id });
    setActionGoal(null);
  }

  return (
    <div className="page goals-page">
      <div className="page-header">
        <h1 className="page-title">장기 목표</h1>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + 목표 추가
        </button>
      </div>

      {state.goals.length === 0 && (
        <div className="empty-state">
          <div className="empty-text">장기 목표를 추가해보세요</div>
        </div>
      )}

      <div className="goals-list">
        {state.goals.map((goal) => {
          const goalTasks = state.tasks.filter((t) => t.goalId === goal.id);
          const isExpanded = expandedGoalId === goal.id;
          return (
            <div key={goal.id}>
              <div
                onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                style={{ cursor: 'pointer' }}
              >
                <GoalCard
                  goal={goal}
                  tasks={goalTasks}
                  onLongPress={() => setActionGoal(goal)}
                />
              </div>
              {isExpanded && (
                <div className="goal-tasks">
                  <div className="goal-tasks-header">
                    <span className="goal-tasks-label">세부 할 일</span>
                    <button
                      className="btn-add small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTaskFormFor(showTaskFormFor === goal.id ? null : goal.id);
                      }}
                    >
                      + 추가
                    </button>
                  </div>
                  {showTaskFormFor === goal.id && (
                    <AddTaskForm goalId={goal.id} onClose={() => setShowTaskFormFor(null)} />
                  )}
                  {goalTasks.map((t) => (
                    <TaskItem key={t.id} task={t} />
                  ))}
                  {goalTasks.length === 0 && showTaskFormFor !== goal.id && (
                    <div className="empty-state small">할 일을 추가하세요</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AIPlannerSection />

      {/* 목표 추가 모달 */}
      {showAddModal && (
        <AddGoalModal onSave={handleAddGoal} onClose={() => setShowAddModal(false)} />
      )}

      {/* 목표 수정 모달 */}
      {editGoal && (
        <AddGoalModal
          initialValues={{
            title: editGoal.title,
            description: editGoal.description,
            startDate: editGoal.startDate,
            deadline: editGoal.deadline,
            time: editGoal.time,
            color: editGoal.color,
          }}
          onSave={handleUpdateGoal}
          onClose={() => setEditGoal(null)}
        />
      )}

      {/* 롱프레스 액션 시트 */}
      {actionGoal && (
        <div className="goal-action-overlay" onClick={() => setActionGoal(null)}>
          <div className="goal-action-sheet" onClick={e => e.stopPropagation()}>
            <div className="goal-action-handle" />
            <div className="goal-action-name">{actionGoal.title}</div>
            <button
              className="goal-action-btn"
              onClick={() => { setEditGoal(actionGoal); setActionGoal(null); }}
            >
              목표 수정하기
            </button>
            <button
              className="goal-action-btn delete"
              onClick={() => handleDelete(actionGoal.id)}
            >
              목표 삭제하기
            </button>
            <button className="goal-action-cancel" onClick={() => setActionGoal(null)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
