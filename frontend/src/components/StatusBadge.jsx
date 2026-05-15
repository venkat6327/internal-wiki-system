import { ARTICLE_STATUS, STATUS_LABELS } from '../constants/articleConstants';

const StatusBadge = ({ status }) => {
  const map = {
    [ARTICLE_STATUS.DRAFT]: { cls: 'badge-draft', label: STATUS_LABELS.DRAFT },
    [ARTICLE_STATUS.PUBLISHED]: { cls: 'badge-published', label: STATUS_LABELS.PUBLISHED },
    [ARTICLE_STATUS.ARCHIVED]: { cls: 'badge-archived', label: STATUS_LABELS.ARCHIVED },
  };

  const entry = map[status] || map[ARTICLE_STATUS.DRAFT];

  return <span className={`badge ${entry.cls}`}>{entry.label}</span>;
};

export default StatusBadge;
