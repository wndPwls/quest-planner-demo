import { useRef, useState } from 'react';
import './AddGoalModal.css';

interface GoalData {
  title: string;
  description: string;
  startDate?: string;
  deadline?: string;
  time?: string;
  color: string;
}

interface Props {
  initialValues?: GoalData;
  onSave: (goal: GoalData) => void;
  onClose: () => void;
}

const COLORS = ['#e94560', '#00d4aa', '#ffd700', '#7c4dff', '#ff6b35', '#2196f3'];

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

export default function AddGoalModal({ initialValues, onSave, onClose }: Props) {
  const isEdit = !!initialValues;
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? '');
  const [endDate, setEndDate] = useState(initialValues?.deadline ?? '');
  const [showTime, setShowTime] = useState(!!initialValues?.time);
  const [timeText, setTimeText] = useState(initialValues?.time ?? '');
  const [timeVal, setTimeVal] = useState(initialValues?.time ?? '');
  const [color, setColor] = useState(initialValues?.color ?? COLORS[0]);
  const pickerRef = useRef<HTMLInputElement>(null);

  function handleTimeBlur() {
    const normalized = normalizeTime(timeText);
    if (normalized) { setTimeText(normalized); setTimeVal(normalized); }
    else if (timeText === '') setTimeVal('');
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: initialValues?.description ?? '',
      startDate: startDate || undefined,
      deadline: endDate || undefined,
      time: timeVal || undefined,
      color,
    });
  }

  return (
    <div className="ag-overlay" onClick={onClose}>
      <div className="ag-sheet" onClick={e => e.stopPropagation()}>
        <div className="ag-handle" />
        <h3 className="ag-title">{isEdit ? '목표 수정' : '목표 추가'}</h3>

        <div className="ag-field">
          <label className="ag-label">내용</label>
          <input
            className="ag-input"
            type="text"
            placeholder="목표를 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            autoFocus
          />
        </div>

        <div className="ag-field">
          <label className="ag-label">기간</label>
          <div className="ag-date-row">
            <input className="ag-date-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="ag-tilde">~</span>
            <input className="ag-date-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="ag-field">
          {!showTime ? (
            <button className="ag-time-toggle" onClick={() => setShowTime(true)}>
              <ClockIcon />
              시간 설정
            </button>
          ) : (
            <>
              <label className="ag-label">시간</label>
              <div className="ag-time-field">
                <input
                  className="ag-time-text"
                  type="text"
                  inputMode="numeric"
                  placeholder="09:00"
                  value={timeText}
                  onChange={e => setTimeText(e.target.value)}
                  onBlur={handleTimeBlur}
                />
                <button type="button" className="ag-time-pick-btn" onClick={() => pickerRef.current?.showPicker?.()} tabIndex={-1}>
                  <ClockIcon />
                  <input ref={pickerRef} type="time" className="ag-picker-hidden" value={timeVal}
                    onChange={e => { setTimeVal(e.target.value); setTimeText(e.target.value); }} tabIndex={-1} />
                </button>
                <button className="ag-time-remove" onClick={() => { setShowTime(false); setTimeText(''); setTimeVal(''); }}>✕</button>
              </div>
            </>
          )}
        </div>

        <div className="ag-field">
          <label className="ag-label">색상</label>
          <div className="ag-colors">
            {COLORS.map(c => (
              <button key={c} className={`ag-color-dot ${c === color ? 'selected' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>

        <div className="ag-actions">
          <button className="ag-btn-cancel" onClick={onClose}>취소</button>
          <button className="ag-btn-save" onClick={handleSave} disabled={!title.trim()}>
            {isEdit ? '수정 완료' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
