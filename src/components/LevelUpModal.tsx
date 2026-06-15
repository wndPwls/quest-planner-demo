import { useEffect } from 'react';
import { getLevelIcon } from '../store/gameLogic';
import './LevelUpModal.css';

interface Props {
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="levelup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="levelup-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="levelup-icon">{getLevelIcon(level)}</div>
        <div className="levelup-title">레벨 업!</div>
        <div className="levelup-level">Lv. {level}</div>
        <div className="levelup-sub">계속 성장하고 있어요!</div>
        <button className="btn-primary" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
