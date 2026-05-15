import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_OPTIONS, CATEGORY_LABELS, STATUS_LABELS } from '../constants/articleConstants';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
];

const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: STATUS_LABELS.PUBLISHED },
  { value: 'DRAFT', label: STATUS_LABELS.DRAFT },
  { value: 'ARCHIVED', label: STATUS_LABELS.ARCHIVED },
];

const DashboardPage = () => {
  const { user, isEditor } = useAuth();
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'PUBLISHED',
    sort: 'newest',
    page: 1,
  });
  const [searchInput, setSearchInput] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.category) delete params.category;
      if (!params.status) delete params.status;
      const res = await api.get('/articles', { params });
      setArticles(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const selectStyle = {
    padding: '0.6rem 1rem',
    background: 'var(--bg-secondary)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '0.75rem',
    color: '#94a3b8',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="fade-in-up" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '0.75rem',
          padding: '2rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <p style={{ color: '#a5b4fc', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Hello, {user?.name}
          </p>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f1f5f9' }}>
            Knowledge Base
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            {meta.total} article{meta.total !== 1 ? 's' : ''} · Search, filter, and explore
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="fade-in-up" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              id="search-input"
              type="text"
              className="input-base"
              placeholder="Search articles by title or content..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Search
          </button>
          {filters.search && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setSearchInput(''); setFilter('search', ''); }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Filter row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category filter */}
          <select
            id="category-filter"
            style={selectStyle}
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="status-filter"
            style={selectStyle}
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            id="sort-select"
            style={selectStyle}
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#64748b' }}>
            {meta.total} results
          </span>
        </div>
      </div>

      {/* Articles grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : articles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          color: '#64748b',
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8' }}>No articles found</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem',
        }}>
          {articles.map((article) => (
            <div key={article.id} className="fade-in-up">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />
    </div>
  );
};

export default DashboardPage;
