const prisma = require('../lib/prisma');
const { ARTICLE_STATUS, ARTICLE_CATEGORIES } = require('../constants/articleConstants');

// Valid enum value sets for validation
const VALID_CATEGORIES = Object.values(ARTICLE_CATEGORIES);
const VALID_STATUSES = Object.values(ARTICLE_STATUS);

// Helper: create a snapshot version
const createVersion = async (article, editorId) => {
  const lastVersion = await prisma.articleVersion.findFirst({
    where: { articleId: article.id },
    orderBy: { version: 'desc' },
  });
  const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

  return prisma.articleVersion.create({
    data: {
      articleId: article.id,
      title: article.title,
      body: article.body,
      category: article.category,
      version: nextVersion,
      editedById: editorId,
    },
  });
};

// GET /api/articles
const listArticles = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      status = '',
      sort = 'newest',
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search } },
                { body: { contains: search } },
              ],
            }
          : {},
        category ? { category: { equals: category } } : {},
        status ? { status: { equals: status } } : {},
      ],
    };

    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'title_asc') orderBy = { title: 'asc' };
    if (sort === 'title_desc') orderBy = { title: 'desc' };
    if (sort === 'updated') orderBy = { updatedAt: 'desc' };

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          author: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { versions: true } },
        },
      }),
    ]);

    res.json({
      data: articles,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List articles error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/articles
const createArticle = async (req, res) => {
  try {
    const { title, body, category } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    // Validate category enum
    const resolvedCategory = category && VALID_CATEGORIES.includes(category)
      ? category
      : ARTICLE_CATEGORIES.GENERAL;

    const article = await prisma.article.create({
      data: {
        title,
        body,
        category: resolvedCategory,
        status: ARTICLE_STATUS.DRAFT,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.status(201).json(article);
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/articles/:id
const getArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { versions: true } },
      },
    });

    if (!article) return res.status(404).json({ message: 'Article not found.' });

    res.json(article);
  } catch (err) {
    console.error('Get article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, category } = req.body;

    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    // Only author or EDITOR can update
    if (article.authorId !== req.user.id && req.user.role !== 'EDITOR') {
      return res.status(403).json({ message: 'Not authorized to update this article.' });
    }

    // Validate category enum if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Allowed: ${VALID_CATEGORIES.join(', ')}` });
    }

    // If article is published, create a version snapshot before saving
    if (article.status === ARTICLE_STATUS.PUBLISHED) {
      await createVersion(article, req.user.id);
    }

    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: title ?? article.title,
        body: body ?? article.body,
        category: (category && VALID_CATEGORIES.includes(category)) ? category : article.category,
      },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Update article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/articles/:id/publish
const publishArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    if (article.authorId !== req.user.id && req.user.role !== 'EDITOR') {
      return res.status(403).json({ message: 'Not authorized to publish this article.' });
    }

    if (article.status === ARTICLE_STATUS.ARCHIVED) {
      return res.status(400).json({ message: 'Cannot publish an archived article. Restore it first.' });
    }

    // Create initial version snapshot on first publish
    await createVersion(article, req.user.id);

    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        status: ARTICLE_STATUS.PUBLISHED,
        publishedAt: article.publishedAt || new Date(),
      },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Publish article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/articles/:id/archive — EDITOR only
const archiveArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    if (article.status === ARTICLE_STATUS.ARCHIVED) {
      return res.status(400).json({ message: 'Article is already archived.' });
    }

    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { status: ARTICLE_STATUS.ARCHIVED },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Archive article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/articles/:id/restore — EDITOR only
const restoreArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    if (article.status !== ARTICLE_STATUS.ARCHIVED) {
      return res.status(400).json({ message: 'Article is not archived.' });
    }

    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { status: ARTICLE_STATUS.PUBLISHED },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Restore article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/articles/:id/versions
const getVersions = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    const versions = await prisma.articleVersion.findMany({
      where: { articleId: parseInt(id) },
      orderBy: { version: 'desc' },
      include: {
        editedBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(versions);
  } catch (err) {
    console.error('Get versions error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/articles/:id — EDITOR only
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found.' });

    await prisma.article.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/articles/categories
// Returns the static list of valid Category enum values
const getCategories = async (req, res) => {
  try {
    res.json(VALID_CATEGORIES);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  listArticles,
  createArticle,
  getArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  restoreArticle,
  getVersions,
  deleteArticle,
  getCategories,
};
