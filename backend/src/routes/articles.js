const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/articleController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All article routes require authentication
router.use(verifyToken);

router.get('/categories', getCategories);
router.get('/', listArticles);
router.post('/', createArticle);
router.get('/:id', getArticle);
router.put('/:id', updateArticle);
router.post('/:id/publish', publishArticle);
router.post('/:id/archive', requireRole('EDITOR'), archiveArticle);
router.post('/:id/restore', requireRole('EDITOR'), restoreArticle);
router.get('/:id/versions', getVersions);
router.delete('/:id', requireRole('EDITOR'), deleteArticle);

module.exports = router;
