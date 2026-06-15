import { useState } from 'react';
import type { Task } from '../types';
import { useApp } from '../contexts/useApp';
import './TaskItem.css';

interface Props {
  task: Task;
}

export default function TaskItem({ task }: Props) {
  const { dispatch } = useApp();
  const [completing, setCompleting] = useState(false);

  function handleToggle() {
    if (task.completed) {
      dispatch({ type: 'UNCOMPLETE_TASK', id: task.id });
      return;
    }
    setCompleting(true);
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_TASK', id: task.id });
      setCompleting(false);
    }, 400);
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${completing ? 'completing' : ''}`}>
      <button
        className={`check-btn ${task.completed ? 'checked' : ''}`}
        onClick={handleToggle}
        aria-label={task.completed ? '완료 취소' : '완료'}
      >
        {task.completed ? '✓' : ''}
      </button>
      <span className="task-title">{task.title}</span>
      <span className="task-xp">+{task.xp} XP</span>
      <button
        className="delete-btn"
        onClick={() => dispatch({ type: 'DELETE_TASK', id: task.id })}
        aria-label="삭제"
      >
        ✕
      </button>
    </div>
  );
}
