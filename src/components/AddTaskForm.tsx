import { useState, type FormEvent } from 'react';
import { useApp } from '../contexts/useApp';
import './AddTaskForm.css';

interface Props {
  goalId?: string;
  onClose?: () => void;
}

export default function AddTaskForm({ goalId, onClose }: Props) {
  const { dispatch, state } = useApp();
  const [title, setTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(goalId ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: 'ADD_TASK', task: { title: title.trim(), goalId: selectedGoalId || undefined } });
    setTitle('');
    onClose?.();
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        className="task-input"
        type="text"
        placeholder="할 일 입력..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      {!goalId && state.goals.length > 0 && (
        <select
          className="goal-select"
          value={selectedGoalId}
          onChange={(e) => setSelectedGoalId(e.target.value)}
        >
          <option value="">목표 없음</option>
          {state.goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      )}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!title.trim()}>
          추가
        </button>
        {onClose && (
          <button type="button" className="btn-ghost" onClick={onClose}>
            취소
          </button>
        )}
      </div>
    </form>
  );
}
