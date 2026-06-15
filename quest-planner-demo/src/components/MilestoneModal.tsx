import { useEffect } from 'react';
import './LevelUpModal.css';

interface Props {
  days: number;
  onClose: () => void;
}

export default function MilestoneModal({ days, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="milestone-modal" onClick={(e) => e.stopPropagation()}>
        <div className="levelup-icon">🔥</div>
        <div className="milestone-title">스트릭 달성!</div>
        <div className="milestone-days">{days}일</div>
        <div className="milestone-sub">연속 달성 보상을 획득했어요!</div>
        <button className="btn-primary" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
