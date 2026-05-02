const cron = require('node-cron');
const { fetchDeals } = require('./crawler');
const { matchAndNotify } = require('./notifier');

function isMongoMode() {
  return !global.__memoryStore;
}

/**
 * 2분 간격으로 크롤링 → 신규 딜 저장 → 키워드 매칭 알림 발송
 */
function startScheduler() {
  console.log('[Scheduler] 크롤링 스케줄러 시작 (2분 간격)');

  // 서버 시작 직후 1회 즉시 실행
  runCrawlPipeline();

  // 이후 2분마다 반복
  cron.schedule('*/2 * * * *', runCrawlPipeline);
}

async function runCrawlPipeline() {
  try {
    const deals = await fetchDeals();
    if (deals.length === 0) return;

    let newCount = 0;

    for (const deal of deals) {
      let exists;

      if (isMongoMode()) {
        const Deal = require('../models/Deal');
        exists = await Deal.findOne({ dealId: deal.dealId });
        if (exists) continue;
        await Deal.create(deal);
      } else {
        exists = global.__memoryStore.findDeal(deal.dealId);
        if (exists) continue;
        global.__memoryStore.createDeal(deal);
      }

      newCount++;
      await matchAndNotify(deal);
    }

    if (newCount > 0) {
      console.log(`[Scheduler] 신규 딜 ${newCount}건 저장 완료`);
    }
  } catch (err) {
    console.error('[Scheduler] 파이프라인 오류:', err.message);
  }
}

module.exports = { startScheduler };
