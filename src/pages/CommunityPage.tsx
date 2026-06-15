import { useState } from 'react';
import { useApp } from '../contexts/useApp';
import DefaultAvatar from '../components/DefaultAvatar';
import { timeAgo } from '../store/timeUtils';
import './CommunityPage.css';

type Tab = 'recommended' | 'following';

export default function CommunityPage() {
  const { state, dispatch } = useApp();
  const [content, setContent] = useState('');
  const [tab, setTab] = useState<Tab>('recommended');

  function handlePost() {
    const trimmed = content.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_POST', content: trimmed });
    setContent('');
  }

  const visiblePosts =
    tab === 'following'
      ? state.posts.filter(
          (post) => post.authorId === 'me' || state.followingIds.includes(post.authorId)
        )
      : state.posts;

  return (
    <div className="page community-page">
      <h1 className="page-title">커뮤니티</h1>

      <div className="post-composer">
        <textarea
          className="composer-input"
          placeholder="오늘의 계획 팁이나 노하우를 공유해보세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button className="btn-primary" onClick={handlePost} disabled={!content.trim()}>
          게시하기
        </button>
      </div>

      <div className="community-tabs">
        <button
          className={`community-tab ${tab === 'recommended' ? 'active' : ''}`}
          onClick={() => setTab('recommended')}
        >
          추천
        </button>
        <button
          className={`community-tab ${tab === 'following' ? 'active' : ''}`}
          onClick={() => setTab('following')}
        >
          팔로잉
        </button>
      </div>

      {visiblePosts.length === 0 && (
        <div className="empty-state">
          <div className="empty-text">
            {tab === 'following'
              ? '팔로우한 사람의 글이 없어요'
              : '아직 게시글이 없어요'}
          </div>
        </div>
      )}

      <div className="post-list">
        {visiblePosts.map((post) => {
          const isMe = post.authorId === 'me';
          const isFollowing = state.followingIds.includes(post.authorId);
          return (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-avatar">
                  <DefaultAvatar size={36} />
                </div>
                <div className="post-author-info">
                  <div className="post-author-name">{post.authorName}</div>
                  <div className="post-meta">
                    <span className="post-level-badge">Lv.{post.authorLevel}</span>
                    <span className="post-time">{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
                {!isMe && (
                  <button
                    className={`post-follow-btn ${isFollowing ? 'following' : ''}`}
                    onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', authorId: post.authorId })}
                  >
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </button>
                )}
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-footer">
                <button
                  className={`post-like-btn ${post.likedByMe ? 'liked' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_LIKE_POST', id: post.id })}
                >
                  {post.likedByMe ? '❤️' : '🤍'} {post.likes}
                </button>
                {post.id.startsWith('seed-') ? null : (
                  <button
                    className="post-delete-btn"
                    onClick={() => dispatch({ type: 'DELETE_POST', id: post.id })}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
