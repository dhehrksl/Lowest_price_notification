const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

// 뽐뿌 국내뽐뿌 게시판
const PPOMPPU_URL = 'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu';
const PPOMPPU_BASE = 'https://www.ppomppu.co.kr/zboard/';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

/**
 * 뽐뿌 핫딜 게시판 최신 글을 크롤링합니다.
 * @returns {Promise<Array<{dealId: string, title: string, originalUrl: string, source: string}>>}
 */
async function fetchDeals() {
  try {
    const response = await axios.get(PPOMPPU_URL, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    });

    // 뽐뿌는 EUC-KR 인코딩 사용
    const html = iconv.decode(Buffer.from(response.data), 'euc-kr');
    const $ = cheerio.load(html);

    const deals = [];

    // 게시판 테이블의 각 글 행 파싱
    $('tr.baseList').each((_, row) => {
      try {
        const $row = $(row);

        // 글 번호 추출 (baseList-numb 셀 또는 list-num 셀)
        const postNum = $row.find('td.baseList-numb').text().trim()
          || $row.find('td.baseList-space.list-num').text().trim();
        if (!postNum || isNaN(Number(postNum))) return; // 공지사항 등 제외

        // 제목 추출
        const $titleLink = $row.find('a.baseList-title');
        const title = $titleLink.text().trim();
        if (!title) return;

        // 링크 추출
        const href = $titleLink.attr('href') || '';
        const originalUrl = href.startsWith('http')
          ? href
          : PPOMPPU_BASE + href;

        deals.push({
          dealId: `ppomppu_${postNum}`,
          title,
          originalUrl,
          source: 'ppomppu',
        });
      } catch {
        // 개별 행 파싱 실패 시 건너뜀
      }
    });

    console.log(`[Crawler] 뽐뿌에서 ${deals.length}개 글 파싱 완료`);
    return deals;
  } catch (err) {
    console.error('[Crawler] 크롤링 실패:', err.message);
    return [];
  }
}

module.exports = { fetchDeals };
