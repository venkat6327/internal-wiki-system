const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const range = [];

  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    range.push(i);
  }

  if (range[0] > 1) {
    pages.push(1);
    if (range[0] > 2) pages.push('...');
  }

  pages.push(...range);

  if (range[range.length - 1] < totalPages) {
    if (range[range.length - 1] < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  const btnStyle = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '38px',
    height: '38px',
    borderRadius: '0.5rem',
    border: active ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
    background: active ? '#6366f1' : 'transparent',
    color: active ? 'white' : '#94a3b8',
    fontWeight: active ? 700 : 500,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const arrowStyle = (disabled) => ({
    ...btnStyle(false),
    color: disabled ? '#374151' : '#94a3b8',
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '2rem' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={arrowStyle(page === 1)}
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ color: '#64748b', padding: '0 0.25rem' }}>...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={btnStyle(p === page)}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={arrowStyle(page === totalPages)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
