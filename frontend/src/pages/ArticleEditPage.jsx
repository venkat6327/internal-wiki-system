import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_OPTIONS, CATEGORY_LABELS, ARTICLE_CATEGORIES } from '../constants/articleConstants';

const ArticleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isEditor } = useAuth();

  const [form, setForm] = useState({ title: '', body: '', category: ARTICLE_CATEGORIES.GENERAL });
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        const a = res.data;

        // Authorization check
        if (a.authorId !== user?.id && !isEditor) {
          navigate(`/articles/${id}`);
          return;
        }

        setArticle(a);
        setForm({ title: a.title, body: a.body, category: a.category });
      } catch {
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, user, isEditor]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.put(`/articles/${id}`, form);
      navigate(`/articles/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article.');
      setSaving(false);
    }
  };

  const bodyWordCount = form.body.trim().split(/\s+/).filter(Boolean).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div className="fade-in-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to={`/articles/${id}`} style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            Back to Article
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Edit Article
            </h1>
            {article?.status === 'PUBLISHED' && (
              <div style={{
                padding: '0.35rem 0.85rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '0.6rem',
                color: '#fcd34d',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}>
                Editing a published article creates a version snapshot
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '0.75rem',
              color: '#fca5a5',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Title *
              </label>
              <input
                id="edit-title"
                type="text"
                className="input-base"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ fontSize: '1.1rem' }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Category
              </label>
              <select
                id="edit-category"
                className="input-base"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>

            {/* Body */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
                  Content *
                </label>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {bodyWordCount} word{bodyWordCount !== 1 ? 's' : ''}
                </span>
              </div>
              <textarea
                id="edit-body"
                className="input-base"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={18}
                style={{ resize: 'vertical', lineHeight: 1.8 }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Link to={`/articles/${id}`} className="btn-secondary" style={{ textDecoration: 'none' }}>
                Cancel
              </Link>
              <button
                id="save-edit-btn"
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditPage;
