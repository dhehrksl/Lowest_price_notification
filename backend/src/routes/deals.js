const express = require('express');
const router = express.Router();

function isMongoMode() {
  return !global.__memoryStore;
}

// GET /api/deals — 최근 딜 목록 조회
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 50;
    const skip = (page - 1) * limit;

    let deals;
    if (isMongoMode()) {
      const Deal = require('../models/Deal');
      deals = await Deal.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      deals = global.__memoryStore.findDeals({ skip, limit });
    }

    res.json(deals);
  } catch (err) {
    console.error('[Deals] 조회 실패:', err.message);
    res.status(500).json({ error: '딜 목록 조회에 실패했습니다.' });
  }
});

module.exports = router;
