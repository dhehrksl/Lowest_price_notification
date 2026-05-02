function isMongoMode() {
  return !global.__memoryStore;
}

/**
 * 신규 딜의 제목과 사용자 키워드를 매칭하여 푸시 알림을 발송합니다.
 */
async function matchAndNotify(deal) {
  try {
    let users;

    if (isMongoMode()) {
      const User = require('../models/User');
      users = await User.find({
        isActive: true,
        keywords: { $exists: true, $not: { $size: 0 } },
      }).lean();
    } else {
      users = global.__memoryStore.findActiveUsersWithKeywords();
    }

    const titleLower = deal.title.toLowerCase();

    // 키워드 매칭되는 사용자의 FCM 토큰 수집
    const matchedTokens = [];
    for (const user of users) {
      const matched = user.keywords.some((kw) =>
        titleLower.includes(kw.toLowerCase())
      );
      if (matched) {
        matchedTokens.push(user.fcmToken);
      }
    }

    if (matchedTokens.length === 0) return;

    console.log(
      `[Notifier] "${deal.title}" → ${matchedTokens.length}명에게 알림 발송`
    );

    // Firebase Admin이 초기화되어 있을 때만 실제 푸시 발송
    let admin;
    try {
      admin = require('firebase-admin');
      if (admin.apps.length === 0) {
        console.log('[Notifier] Firebase 미초기화 — 푸시 건너뜀 (로그만 출력)');
        return;
      }
    } catch {
      console.log('[Notifier] Firebase 모듈 없음 — 푸시 건너뜀');
      return;
    }

    // 500개씩 배치 발송 (FCM 제한)
    const batchSize = 500;
    for (let i = 0; i < matchedTokens.length; i += batchSize) {
      const batch = matchedTokens.slice(i, i + batchSize);

      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        notification: {
          title: '핫딜 알림!',
          body: deal.title,
        },
        data: {
          url: deal.originalUrl,
          dealId: deal.dealId,
        },
      });

      // 만료된 토큰 정리
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (
            resp.error &&
            resp.error.code === 'messaging/registration-token-not-registered'
          ) {
            failedTokens.push(batch[idx]);
          }
        });

        if (failedTokens.length > 0) {
          if (isMongoMode()) {
            const User = require('../models/User');
            await User.deleteMany({ fcmToken: { $in: failedTokens } });
          } else {
            global.__memoryStore.deleteUsersByTokens(failedTokens);
          }
          console.log(`[Notifier] 만료 토큰 ${failedTokens.length}개 삭제`);
        }
      }
    }
  } catch (err) {
    console.error('[Notifier] 알림 발송 오류:', err.message);
  }
}

module.exports = { matchAndNotify };
