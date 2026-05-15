/**
 * Article status enum values — must exactly match Prisma enum Status.
 */
export const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

/**
 * Article category enum values — must exactly match Prisma enum Category.
 */
export const ARTICLE_CATEGORIES = {
  ENGINEERING: 'ENGINEERING',
  PRODUCT: 'PRODUCT',
  HR: 'HR',
  OPERATIONS: 'OPERATIONS',
  ONBOARDING: 'ONBOARDING',
  GENERAL: 'GENERAL',
};

/**
 * Human-readable labels for display in UI.
 */
export const CATEGORY_LABELS = {
  ENGINEERING: 'Engineering',
  PRODUCT: 'Product',
  HR: 'HR',
  OPERATIONS: 'Operations',
  ONBOARDING: 'Onboarding',
  GENERAL: 'General',
};

export const STATUS_LABELS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

/** Ordered list of category enum values for dropdowns */
export const CATEGORY_OPTIONS = Object.keys(ARTICLE_CATEGORIES);

/** Ordered list of status enum values for filters */
export const STATUS_OPTIONS = Object.keys(ARTICLE_STATUS);
