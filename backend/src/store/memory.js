/**
 * 인메모리 스토어 — MongoDB 없이 즉시 실행용
 * MongoDB URI가 설정되면 이 파일은 사용되지 않습니다.
 */

const deals = [];   // { dealId, title, originalUrl, source, createdAt }
const users = [];   // { fcmToken, keywords, isActive, lastLogin }

// 7일 지난 딜 자동 삭제 (1시간마다 정리)
setInterval(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  for (let i = deals.length - 1; i >= 0; i--) {
    if (new Date(deals[i].createdAt).getTime() < cutoff) {
      deals.splice(i, 1);
    }
  }
}, 60 * 60 * 1000);

const store = {
  // === Deals ===
  findDeal(dealId) {
    return deals.find(d => d.dealId === dealId) || null;
  },

  createDeal(deal) {
    const doc = { ...deal, _id: deal.dealId, createdAt: new Date() };
    deals.push(doc);
    return doc;
  },

  findDeals({ skip = 0, limit = 50 } = {}) {
    return deals
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit);
  },

  // === Users ===
  upsertUser(fcmToken, update = {}) {
    let user = users.find(u => u.fcmToken === fcmToken);
    if (!user) {
      user = { _id: fcmToken, fcmToken, keywords: [], isActive: true, lastLogin: new Date() };
      users.push(user);
    }
    Object.assign(user, update, { lastLogin: new Date() });
    return user;
  },

  findUserByToken(fcmToken) {
    return users.find(u => u.fcmToken === fcmToken) || null;
  },

  findActiveUsersWithKeywords() {
    return users.filter(u => u.isActive && u.keywords.length > 0);
  },

  deleteUsersByTokens(tokens) {
    for (let i = users.length - 1; i >= 0; i--) {
      if (tokens.includes(users[i].fcmToken)) users.splice(i, 1);
    }
  },
};

// 전역으로 접근 가능하게 설정
global.__memoryStore = store;

module.exports = store;
