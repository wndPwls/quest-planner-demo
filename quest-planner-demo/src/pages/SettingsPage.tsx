import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/useApp';
import './SettingsPage.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [apiKey, setApiKey] = useState(state.claudeApiKey);
  const [saved, setSaved] = useState(false);

  function handleSaveKey(e: FormEvent) {
    e.preventDefault();
    dispatch({ type: 'SET_API_KEY', key: apiKey.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="page settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ‹ 뒤로
        </button>
        <h1 className="page-title">설정</h1>
      </div>

      <div className="settings-section">
        <h2 className="settings-label">Claude API 키</h2>
        <div className="api-notice">
          AI 플래너 기능을 사용하려면 Anthropic API 키가 필요합니다.
          키는 이 기기의 로컬 스토리지에만 저장됩니다.
        </div>
        <form onSubmit={handleSaveKey} className="settings-row">
          <input
            className="task-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
          />
          <button type="submit" className="btn-primary">
            {saved ? '✓ 저장됨' : '저장'}
          </button>
        </form>
        {state.claudeApiKey && (
          <div className="key-status">✓ API 키 등록됨</div>
        )}
      </div>

      <div className="settings-section danger-zone">
        <h2 className="settings-label danger">초기화</h2>
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm('모든 데이터가 삭제됩니다. 계속할까요?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          전체 데이터 초기화
        </button>
      </div>

      <div className="app-info">
        <div className="app-name">Quest Planner</div>
        <div className="app-version">v0.1.0 — 웹 프로토타입</div>
      </div>
    </div>
  );
}
