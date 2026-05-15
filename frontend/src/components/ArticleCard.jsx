import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ArticleCard = ({ article }) => {
  const { id, title, body, category, status, author, createdAt, updatedAt, _count } = article;

  const truncate = (text, max = 120) =>
    text.length > max ? text.substring(0, max) + '...' : text;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <Link to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: 'pointer',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#f1f5f9',
            lineHeight: 1.4,
            flex: 1,
          }}>
            {title}
          </h3>
          <StatusBadge status={status} />
        </div>

        {/* Excerpt */}
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
          {truncate(body)}
        </p>

        {/* Footer row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#a5b4fc',
              padding: '0.2rem 0.6rem',
              borderRadius: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}>
              {category}
            </span>
            {_count?.versions > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {_count.versions} version{_count.versions !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '22px',
              height: '22px',
              background: '#1f2937',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
              color: 'white',
            }}>
              {author?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {author?.name} · {timeAgo(updatedAt || createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
