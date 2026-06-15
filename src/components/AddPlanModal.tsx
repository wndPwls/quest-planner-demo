import { useRef, useState } from 'react';
import './AddPlanModal.css';

interface InitialValues {
  title: string;
  time?: string;
  endTime?: string;
  notification?: string;
  color?: string;
}

interface Props {
  defaultDate: string;
  initialValues?: InitialValues;
  onSave: (title: string, time: string, endTime: string, notification: string, color: string) => void;
  onClose: () => void;
}

const COLORS = ['#e94560', '#00d4aa', '#ffd700', '#7c4dff', '#ff6b35', '#2196f3'];

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function normalizeTime(raw: string): string {
  const cleaned = raw.replace(/[^0-9:]/g, '');
  if (/^\d{1,2}$/.test(cleaned)) {
    const h = parseInt(cleaned, 10);
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, '0')}:00`;
  }
  if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
    const [h, m] = cleaned.split(':').map(Number);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59)
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  return '';
}

function TimeField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [text, setText] = useState(value);
  const pickerRef = useRef<HTMLInputElement>(null);

  function handleBlur() {
    const n = normalizeTime(text);
    if (n) { setText(n); onChange(n); }
    else if (text === '') onChange('');
  }

  return (
    <div className="time-field">
      <input
        className="modal-time-text"
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
      />
      <button type="button" className="time-pick-btn" onClick={() => pickerRef.current?.showPicker?.()} tabIndex={-1}>
        <ClockIcon />
        <input ref={pickerRef} type="time" className="time-picker-hidden" value={value}
          onChange={e => { setText(e.target.value); onChange(e.target.value); }} tabIndex={-1} />
      </button>
    </div>
  );
}

const NOTIF_PRESETS = [
  { key: 'start', label: '일정 시작 시간' },
  { key: '10min', label: '10분 전' },
  { key: '1hour', label: '1시간 전' },
  { key: '1day', label: '1일 전' },
];

function notifLabel(val: string): string {
  if (!val) return '없음';
  const p = NOTIF_PRESETS.find(p => p.key === val);
  if (p) return p.label;
  if (val.startsWith('custom:')) return `${val.slice(7)}분 전`;
  return val;
}

export default function AddPlanModal({ initialValues, onSave, onClose }: Props) {
  const isEdit = !!initialValues;
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [startTime, setStartTime] = useState(initialValues?.time ?? '');
  const [endTime, setEndTime] = useState(initialValues?.endTime ?? '');
  const [notification, setNotification] = useState(initialValues?.notification ?? '');
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [color, setColor] = useState(initialValues?.color ?? '');

  function selectPreset(key: string) {
    setNotification(key);
    setShowCustom(false);
    setShowNotifPanel(false);
  }

  function applyCustom() {
    const n = parseInt(customMin, 10);
    if (!isNaN(n) && n > 0) {
      setNotification(`custom:${n}`);
      setShowNotifPanel(false);
      setShowCustom(false);
    }
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave(title.trim(), startTime, endTime, notification, color);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">{isEdit ? '계획 수정' : '계획 추가'}</h3>

        {/* 시간 */}
        <div className="modal-field">
          <label className="modal-label">시간</label>
          <div className="modal-time-row">
            <TimeField value={startTime} onChange={setStartTime} placeholder="09:00" />
            <span className="modal-tilde">~</span>
            <TimeField value={endTime} onChange={setEndTime} placeholder="10:00" />
          </div>
        </div>

        {/* 계획 내용 */}
        <div className="modal-field">
          <label className="modal-label">계획 내용</label>
          <input
            className="modal-text-input"
            type="text"
            placeholder="오늘 할 일을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            autoFocus
          />
        </div>

        {/* 색상 */}
        <div className="modal-field">
          <label className="modal-label">색상</label>
          <div className="modal-colors">
            <button
              className={`modal-color-dot no-color ${color === '' ? 'selected' : ''}`}
              onClick={() => setColor('')}
              title="색상 없음"
            />
            {COLORS.map(c => (
              <button
                key={c}
                className={`modal-color-dot ${color === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* 알림 */}
        <div className="modal-field">
          <button
            className="notif-toggle-row"
            onClick={() => { setShowNotifPanel(v => !v); setShowCustom(false); }}
          >
            <span className="notif-toggle-left">
              <BellIcon />
              <span className="notif-toggle-label">알림</span>
            </span>
            <span className="notif-toggle-right">
              <span className="notif-toggle-val">{notifLabel(notification)}</span>
              <ChevronIcon open={showNotifPanel} />
            </span>
          </button>

          {showNotifPanel && (
            <div className="notif-panel">
              {NOTIF_PRESETS.map(p => (
                <button
                  key={p.key}
                  className={`notif-option ${notification === p.key ? 'selected' : ''}`}
                  onClick={() => selectPreset(p.key)}
                >
                  {p.label}
                  {notification === p.key && <span className="notif-check">✓</span>}
                </button>
              ))}

              {/* 직접 설정 */}
              {!showCustom ? (
                <button
                  className={`notif-option ${notification.startsWith('custom:') ? 'selected' : ''}`}
                  onClick={() => setShowCustom(true)}
                >
                  + 직접 설정
                  {notification.startsWith('custom:') && (
                    <span className="notif-check">{notifLabel(notification)} ✓</span>
                  )}
                </button>
              ) : (
                <div className="notif-custom-row">
                  <input
                    className="notif-custom-input"
                    type="number"
                    min="1"
                    placeholder="분"
                    value={customMin}
                    onChange={e => setCustomMin(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') applyCustom(); }}
                    autoFocus
                  />
                  <span className="notif-custom-unit">분 전</span>
                  <button className="notif-custom-ok" onClick={applyCustom}>확인</button>
                </div>
              )}

              {/* 알림 없음 */}
              {notification && (
                <button className="notif-option notif-clear" onClick={() => { setNotification(''); setShowNotifPanel(false); }}>
                  알림 없음
                </button>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onClose}>취소</button>
          <button className="modal-btn-save" onClick={handleSave} disabled={!title.trim()}>{isEdit ? '수정 완료' : '저장'}</button>
        </div>
      </div>
    </div>
  );
}
