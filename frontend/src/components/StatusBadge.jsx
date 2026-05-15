const StatusBadge = ({ status }) => {
  const map = {
    DRAFT: { cls: 'badge-draft', label: 'Draft' },
    PUBLISHED: { cls: 'badge-published', label: 'Published' },
    ARCHIVED: { cls: 'badge-archived', label: 'Archived' },
  };

  const entry = map[status] || map.DRAFT;

  return <span className={`badge ${entry.cls}`}>{entry.label}</span>;
};

export default StatusBadge;
