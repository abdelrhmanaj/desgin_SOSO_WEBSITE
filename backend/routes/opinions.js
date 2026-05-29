const express = require('express');
const router = express.Router();
const {
  createOpinion,
  getOpinions,
  getAdminOpinions,
  updateOpinionVisibility,
  deleteOpinion,
} = require('../controllers/opinionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createOpinion)
  .get(getOpinions);

router.get('/admin', protect, getAdminOpinions);

router.route('/:id')
  .put(protect, updateOpinionVisibility)
  .delete(protect, deleteOpinion);

module.exports = router;
