import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/useApp';
import './AIPlannerSection.css';

interface SuggestedTask {
  title: string;
  order: number;
}

export default function AIPlannerSection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const hasKey = !!state.claudeApiKey;

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !hasKey) return;

    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const prompt = `사용자가 오늘 해야 할 일을 자유롭게 입력했습니다:
"${input}"

이를 분석해서 구조화된 할 일 목록으로 변환해주세요.
JSON 배열로만 응답하세요. 다른 텍스트 없이 JSON만.
형식: [{"title": "할 일 이름", "order": 1}, ...]
- 최대 8개
- 각 title은 15자 이내로 간결하게`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': state.claudeApiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'API 오류');
      }

      const data = await res.json();
      const text = data.content[0].text.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('응답 파싱 실패');

      const parsed: SuggestedTask[] = JSON.parse(jsonMatch[0]);
      setSuggestions(parsed.slice(0, 8));
      setSelected(new Set(parsed.slice(0, 8).map((_, i) => i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleConfirm() {
    suggestions
      .filter((_, i) => selected.has(i))
      .forEach((s) => {
        dispatch({ type: 'ADD_TASK', task: { title: s.title } });
      });
    setSuggestions([]);
    setInput('');
    setSelected(new Set());
  }

  return (
    <div className="ai-planner-section">
      <div className="ai-planner-header">
        <span className="ai-planner-title">✨ AI 플래너</span>
        <span className="ai-planner-desc">오늘 할 일을 대충 입력하면 AI가 구조화해드려요</span>
      </div>

      {!hasKey ? (
        <div className="no-key-notice">
          <div className="notice-icon">🔑</div>
          <div className="notice-text">Claude API 키가 필요합니다</div>
          <div className="notice-sub">설정 페이지에서 API 키를 입력해주세요</div>
          <button className="btn-ghost" onClick={() => navigate('/settings')}>
            설정으로 이동
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleGenerate}>
            <textarea
              className="ai-input"
              placeholder="예: 오전에 수업 듣고, 점심 먹고 과제 마무리해야 함. 저녁엔 운동도 가고 싶고..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
            <button type="submit" className="btn-primary full" disabled={loading || !input.trim()}>
              {loading ? '분석 중...' : '✨ 계획 생성'}
            </button>
          </form>

          {error && <div className="ai-error">⚠️ {error}</div>}

          {suggestions.length > 0 && (
            <div className="suggestions">
              <div className="suggestions-header">생성된 할 일 목록</div>
              <div className="suggestions-list">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className={`suggestion-item ${selected.has(i) ? 'selected' : ''}`}
                    onClick={() => toggleSelect(i)}
                  >
                    <div className={`suggestion-check ${selected.has(i) ? 'checked' : ''}`}>
                      {selected.has(i) ? '✓' : ''}
                    </div>
                    <span>{s.title}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn-primary full"
                onClick={handleConfirm}
                disabled={selected.size === 0}
              >
                선택한 {selected.size}개 오늘 할 일로 추가
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
