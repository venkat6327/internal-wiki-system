/**
 * Article status enum values — must match Prisma enum Status exactly.
 */
const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

/**
 * Article category enum values — must match Prisma enum Category exactly.
 */
const ARTICLE_CATEGORIES = {
  ENGINEERING: 'ENGINEERING',
  PRODUCT: 'PRODUCT',
  HR: 'HR',
  OPERATIONS: 'OPERATIONS',
  ONBOARDING: 'ONBOARDING',
  GENERAL: 'GENERAL',
};

module.exports = { ARTICLE_STATUS, ARTICLE_CATEGORIES };
