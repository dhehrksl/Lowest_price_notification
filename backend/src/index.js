require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/deals', require('./routes/deals'));
app.use('/api/users', require('./routes/users'));

// 헬스체크
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: '초저가알리미 API' });
});

// Firebase Admin 초기화
function initFirebase() {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.warn('[Firebase] 환경변수 미설정 — 푸시 알림 비활성화');
    return;
  }
  const admin = require('firebase-admin');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  console.log('[Firebase] 초기화 완료');
}

// 서버 시작
async function start() {
  try {
    // MongoDB URI가 있으면 MongoDB, 없으면 인메모리 모드
    if (process.env.MONGODB_URI) {
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('[MongoDB] 연결 성공');
    } else {
      console.log('[DB] MONGODB_URI 미설정 — 인메모리 모드로 실행');
      require('./store/memory'); // 인메모리 스토어 초기화
    }

    initFirebase();
    startScheduler();

    app.listen(PORT, () => {
      console.log(`[Server] http://localhost:${PORT} 에서 실행 중`);
    });
  } catch (err) {
    console.error('[Server] 시작 실패:', err.message);
    process.exit(1);
  }
}

start();
