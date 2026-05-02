const express = require('express');
const router = express.Router();

function isMongoMode() {
  return !global.__memoryStore;
}

// POST /api/users/register — FCM 토큰 등록
router.post('/register', async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ error: 'fcmToken이 필요합니다.' });
    }

    let user;
    if (isMongoMode()) {
      const User = require('../models/User');
      user = await User.findOneAndUpdate(
        { fcmToken },
        { fcmToken, lastLogin: new Date() },
        { upsert: true, new: true }
      );
    } else {
      user = global.__memoryStore.upsertUser(fcmToken);
    }

    res.json(user);
  } catch (err) {
    console.error('[Users] 등록 실패:', err.message);
    res.status(500).json({ error: '사용자 등록에 실패했습니다.' });
  }
});

// PUT /api/users/keywords — 키워드 업데이트
router.put('/keywords', async (req, res) => {
  try {
    const { fcmToken, keywords } = req.body;
    if (!fcmToken || !Array.isArray(keywords)) {
      return res.status(400).json({ error: 'fcmToken과 keywords 배열이 필요합니다.' });
    }

    let user;
    if (isMongoMode()) {
      const User = require('../models/User');
      user = await User.findOneAndUpdate(
        { fcmToken },
        { keywords },
        { new: true }
      );
    } else {
      user = global.__memoryStore.upsertUser(fcmToken, { keywords });
    }

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (err) {
    console.error('[Users] 키워드 업데이트 실패:', err.message);
    res.status(500).json({ error: '키워드 업데이트에 실패했습니다.' });
  }
});

// PUT /api/users/push-toggle — 푸시 알림 토글
router.put('/push-toggle', async (req, res) => {
  try {
    const { fcmToken, isActive } = req.body;
    if (!fcmToken || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'fcmToken과 isActive(boolean)가 필요합니다.' });
    }

    let user;
    if (isMongoMode()) {
      const User = require('../models/User');
      user = await User.findOneAndUpdate(
        { fcmToken },
        { isActive },
        { new: true }
      );
    } else {
      user = global.__memoryStore.upsertUser(fcmToken, { isActive });
    }

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (err) {
    console.error('[Users] 푸시 토글 실패:', err.message);
    res.status(500).json({ error: '푸시 토글 업데이트에 실패했습니다.' });
  }
});

module.exports = router;
