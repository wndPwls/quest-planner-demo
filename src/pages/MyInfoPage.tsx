import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/useApp';
import { getCharacterStage, getLevelIcon, xpForCurrentLevel, xpToNextLevel } from '../store/gameLogic';
import { GearIcon, PencilIcon } from '../components/Icons';
import DefaultAvatar from '../components/DefaultAvatar';
import { getDailyQuote } from '../store/dailyQuote';
import { timeAgo } from '../store/timeUtils';
import type { UserProfile, UserStatus } from '../types';
import './MyInfoPage.css';

const STAGE_NAMES = ['새싹', '견습생', '탐험가', '전사', '영웅', '전설'];

const STATUS_OPTIONS: { value: UserStatus; label: string; color: string }[] = [
  { value: 'online',  label: '온라인',    color: '#00a884' },
  { value: 'away',    label: '자리 비움', color: '#f4c430' },
  { value: 'offline', label: '오프라인',  color: '#c8bdb5' },
];

function statusColor(s: UserStatus) {
  return STATUS_OPTIONS.find(o => o.value === s)?.color ?? '#c8bdb5';
}
function statusLabel(s: UserStatus) {
  return STATUS_OPTIONS.find(o => o.value === s)?.label ?? '';
}

const quote = getDailyQuote();

export default function MyInfoPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { character, streak, profile, posts } = state;

  const likedPosts = posts.filter((p) => p.likedByMe);

  const stage = getCharacterStage(character.level);
  const icon = getLevelIcon(character.level);
  const currentXp = xpForCurrentLevel(character.totalXp);
  const nextXp = xpToNextLevel();
  const progress = (currentXp / nextXp) * 100;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  function openEdit() {
    setDraft(profile);
    setEditing(true);
  }

  function handleSave() {
    dispatch({ type: 'UPDATE_PROFILE', profile: draft });
    setEditing(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      if (editing) {
        setDraft(d => ({ ...d, photo: dataUrl }));
      } else {
        dispatch({ type: 'UPDATE_PROFILE', profile: { ...profile, photo: dataUrl } });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const photoSrc = editing ? draft.photo : profile.photo;

  return (
    <div className="page myinfo-page">
      <div className="myinfo-header">
        <h1 className="page-title">내 정보</h1>
        <button className="settings-btn" onClick={() => navigate('/settings')} aria-label="설정">
          <GearIcon size={22} color="#8c7d73" />
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* 프로필 카드 */}
      <div className="myinfo-card profile-card">
        <div className="avatar-wrapper" onClick={() => fileRef.current?.click()} title="사진 변경">
          {photoSrc ? (
            <img src={photoSrc} alt="프로필" className="avatar-img" />
          ) : (
            <DefaultAvatar size={80} />
          )}
          <div className="avatar-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {editing ? (
          <div className="myinfo-edit-form">
            <div className="edit-field">
              <label className="edit-label">이름</label>
              <input className="edit-input" value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                placeholder="이름" maxLength={20} />
            </div>
            <div className="edit-field">
              <label className="edit-label">이메일</label>
              <input className="edit-input" type="email" value={draft.email}
                onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                placeholder="example@email.com" />
            </div>
            <div className="edit-field">
              <label className="edit-label">한줄소개</label>
              <input className="edit-input" value={draft.bio}
                onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                placeholder="나를 한 줄로 소개해요" maxLength={40} />
            </div>
            <div className="edit-field">
              <label className="edit-label">상태</label>
              <div className="status-options">
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    className={`status-option ${draft.status === opt.value ? 'selected' : ''}`}
                    onClick={() => setDraft(d => ({ ...d, status: opt.value }))}>
                    <span className="status-dot" style={{ background: opt.color }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="edit-actions">
              <button className="btn-primary" onClick={handleSave}>저장</button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>취소</button>
            </div>
          </div>
        ) : (
          <div className="myinfo-profile-info">
            <div className="myinfo-name-row">
              <div className="myinfo-name">{profile.name || '이름 없음'}</div>
              <button className="edit-btn" onClick={openEdit} aria-label="프로필 수정">
                <PencilIcon size={15} color="#a89890" />
              </button>
            </div>
            <div className="myinfo-status-row">
              <span className="status-dot" style={{ background: statusColor(profile.status) }} />
              <span className="myinfo-status-label">{statusLabel(profile.status)}</span>
            </div>
            <div className="myinfo-follow-row">
              <span className="myinfo-follow-stat">
                <span className="myinfo-follow-num">{state.followingIds.length}</span> 팔로잉
              </span>
              <span className="myinfo-follow-stat">
                <span className="myinfo-follow-num">{profile.followersCount}</span> 팔로워
              </span>
            </div>
            {profile.email && <div className="myinfo-email">{profile.email}</div>}
            {profile.bio   && <div className="myinfo-bio">{profile.bio}</div>}
            <div className="myinfo-level-badge">
              {icon} Lv.{character.level} · {STAGE_NAMES[stage]}
            </div>
          </div>
        )}
      </div>

      {/* XP */}
      <div className="myinfo-card">
        <div className="myinfo-xp-header">
          <span className="myinfo-section-label">경험치</span>
          <span className="myinfo-xp-num">{currentXp} / {nextXp} XP</span>
        </div>
        <div className="myinfo-xp-track">
          <div className="myinfo-xp-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="myinfo-xp-next">다음 레벨까지 {nextXp - currentXp} XP</div>
      </div>

      {/* 좋아요한 글 */}
      {likedPosts.length > 0 && (
        <div className="myinfo-card">
          <div className="myinfo-section-label" style={{ marginBottom: 12 }}>
            ❤️ 좋아요한 글
          </div>
          <div className="myinfo-liked-posts">
            {likedPosts.map((post) => (
              <div
                key={post.id}
                className="myinfo-liked-post"
                onClick={() => navigate('/community')}
              >
                <div className="myinfo-liked-post-header">
                  <span className="myinfo-liked-post-author">{post.authorName}</span>
                  <span className="myinfo-liked-post-time">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="myinfo-liked-post-content">{post.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 명언 */}
      <div className="myinfo-card quote-card">
        <div className="quote-text">"{quote.text}"</div>
        <div className="quote-author">— {quote.author}</div>
      </div>


      {/* 업적 */}
      {character.achievements.length > 0 && (
        <div className="myinfo-card">
          <div className="myinfo-section-label" style={{ marginBottom: 12 }}>업적</div>
          <div className="myinfo-achievements">
            {character.achievements.map(a => (
              <div key={a.id} className="myinfo-achievement">
                <span className="myinfo-achievement-icon">{a.icon}</span>
                <div>
                  <div className="myinfo-achievement-name">{a.name}</div>
                  <div className="myinfo-achievement-date">
                    {new Date(a.earnedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {streak.milestones.length > 0 && (
        <div className="myinfo-card">
          <div className="myinfo-section-label" style={{ marginBottom: 12 }}>🔥 스트릭 달성</div>
          <div className="myinfo-milestones">
            {streak.milestones.map(m => (
              <div key={m} className="myinfo-milestone-badge">🔥 {m}일</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
