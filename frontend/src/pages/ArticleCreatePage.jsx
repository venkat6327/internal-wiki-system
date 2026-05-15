import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['General', 'Engineering', 'Design', 'Product', 'HR', 'Legal', 'Finance', 'Marketing', 'Operations', 'Other'];

const ArticleCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', category: 'General' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/articles', form);
      const articleId = res.data.id;
      if (publish) {
        await api.post(`/articles/${articleId}/publish`);
      }
      navigate(`/articles/${articleId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article.');
    } finally {
      setLoading(false);
    }
  };

  const bodyWordCount = form.body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div className="fade-in-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            Knowledge Base
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            New Article
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Create a new article. Save as draft or publish immediately.
          </p>
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

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Title *
              </label>
              <input
                id="article-title"
                type="text"
                className="input-base"
                placeholder="Enter a descriptive article title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ fontSize: '1.1rem' }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Category
              </label>
              <select
                id="article-category"
                className="input-base"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
                id="article-body"
                className="input-base"
                placeholder="Write your article content here..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={16}
                style={{ resize: 'vertical', lineHeight: 1.8 }}
                required
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Cancel
              </Link>
              <button
                id="save-draft-btn"
                type="button"
                className="btn-warning"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                id="publish-btn"
                type="button"
                className="btn-success"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
              >
                {loading ? 'Publishing...' : 'Save & Publish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleCreatePage;
