import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isEditor } = useAuth();

  const [article, setArticle] = useState(null);
  const [versions, setVersions] = useState([]);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchArticle = async () => {
    try {
      const res = await api.get(`/articles/${id}`);
      setArticle(res.data);
    } catch {
      setError('Article not found.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const res = await api.get(`/articles/${id}/versions`);
      setVersions(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchArticle();
    fetchVersions();
  }, [id]);

  const doAction = async (action, label) => {
    setActionLoading(action);
    try {
      const res = await api.post(`/articles/${id}/${action}`);
      setArticle(res.data);
      if (action === 'publish') fetchVersions();
      showToast(`Article ${label} successfully.`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading('');
    }
  };

  const doDelete = async () => {
    if (!confirm('Delete this article permanently? This cannot be undone.')) return;
    try {
      await api.delete(`/articles/${id}`);
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed.');
    }
  };

  const isOwner = article?.authorId === user?.id;
  const canEdit = isOwner || isEditor;
  const canPublish = canEdit && article?.status !== 'ARCHIVED';

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>{error || 'Article not found'}</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem', textDecoration: 'none' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '2rem',
          background: toastMsg.includes('failed') ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
          border: `1px solid ${toastMsg.includes('failed') ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          color: toastMsg.includes('failed') ? '#fca5a5' : '#6ee7b7',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease',
          boxShadow: 'none',
        }}>
          {toastMsg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          Knowledge Base
        </Link>
      </div>

      {/* Article card */}
      <div className="fade-in-up" style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
      }}>
        {/* Article header */}
        <div style={{
          padding: '2rem 2.5rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <StatusBadge status={article.status} />
            <span style={{
              background: 'rgba(99,102,241,0.12)',
              color: '#a5b4fc',
              padding: '0.25rem 0.7rem',
              borderRadius: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}>
              {article.category}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px', height: '28px',
                background: '#1f2937',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: 'white',
              }}>
                {article.author?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                <strong style={{ color: '#cbd5e1' }}>{article.author?.name}</strong>
                &nbsp;·&nbsp;
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: article.author?.role === 'EDITOR' ? '#c4b5fd' : '#67e8f9',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {article.author?.role}
                </span>
              </span>
            </div>
            <span style={{ color: '#475569', fontSize: '0.875rem' }}>
              Updated {timeAgo(article.updatedAt)}
            </span>
            {article._count?.versions > 0 && (
              <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                {article._count.versions} version{article._count.versions !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Article body */}
        <div style={{ padding: '2.5rem' }}>
          <div style={{
            color: '#cbd5e1',
            fontSize: '1rem',
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {article.body}
          </div>
        </div>

        {/* Action bar */}
        {canEdit && (
          <div style={{
            padding: '1.5rem 2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <Link
              to={`/articles/${id}/edit`}
              className="btn-secondary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              Edit
            </Link>

            {article.status !== 'PUBLISHED' && canPublish && (
              <button
                className="btn-success btn-sm"
                onClick={() => doAction('publish', 'published')}
                disabled={!!actionLoading}
              >
                {actionLoading === 'publish' ? 'Publishing...' : 'Publish'}
              </button>
            )}

            {isEditor && article.status !== 'ARCHIVED' && (
              <button
                className="btn-warning btn-sm"
                onClick={() => doAction('archive', 'archived')}
                disabled={!!actionLoading}
              >
                {actionLoading === 'archive' ? 'Archiving...' : 'Archive'}
              </button>
            )}

            {isEditor && article.status === 'ARCHIVED' && (
              <button
                className="btn-success btn-sm"
                onClick={() => doAction('restore', 'restored')}
                disabled={!!actionLoading}
              >
                {actionLoading === 'restore' ? 'Restoring...' : 'Restore'}
              </button>
            )}

            {isEditor && (
              <button
                className="btn-danger btn-sm"
                onClick={doDelete}
                style={{ marginLeft: 'auto' }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Version History */}
      {versions.length > 0 && (
        <div className="fade-in-up" style={{
          marginTop: '1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setVersionsOpen(!versionsOpen)}
            style={{
              width: '100%',
              padding: '1.25rem 1.75rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#f1f5f9',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              transition: 'background 0.2s',
            }}
          >
            <span>Version History ({versions.length})</span>
            <span style={{ color: '#6366f1', fontSize: '0.875rem' }}>{versionsOpen ? 'Collapse' : 'Expand'}</span>
          </button>

          {versionsOpen && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {versions.map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    padding: '1.25rem 1.75rem',
                    borderBottom: i < versions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        background: i === 0 ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                        color: i === 0 ? '#a5b4fc' : '#64748b',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}>
                        v{v.version}
                      </span>
                      {i === 0 && (
                        <span style={{ fontSize: '0.7rem', color: '#6ee7b7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Latest
                        </span>
                      )}
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>{v.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        by <strong style={{ color: '#94a3b8' }}>{v.editedBy?.name}</strong>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                        {timeAgo(v.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.825rem',
                    color: '#64748b',
                    fontStyle: 'italic',
                    marginLeft: '0.5rem',
                    paddingLeft: '0.75rem',
                    borderLeft: '2px solid rgba(99,102,241,0.3)',
                    lineHeight: 1.5,
                  }}>
                    {v.body.length > 160 ? v.body.substring(0, 160) + '...' : v.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleDetailPage;
