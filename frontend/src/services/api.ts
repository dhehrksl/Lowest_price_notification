// 개발/프로덕션 환경에 따라 BASE_URL을 변경하세요
// 로컬 개발 시: 컴퓨터의 로컬 IP로 변경 (예: http://192.168.0.10:4000/api)
const BASE_URL = __DEV__
  ? 'http://10.0.2.2:4000/api'   // Android 에뮬레이터 기본값
  : 'https://your-app.onrender.com/api'; // 프로덕션 배포 후 변경

export interface Deal {
  _id: string;
  dealId: string;
  title: string;
  originalUrl: string;
  source: string;
  createdAt: string;
}

export interface User {
  _id: string;
  fcmToken: string;
  keywords: string[];
  isActive: boolean;
  lastLogin: string;
}

export async function fetchDeals(page: number = 1): Promise<Deal[]> {
  const res = await fetch(`${BASE_URL}/deals?page=${page}`);
  if (!res.ok) throw new Error('딜 목록 조회 실패');
  return res.json();
}

export async function registerUser(fcmToken: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fcmToken }),
  });
  if (!res.ok) throw new Error('사용자 등록 실패');
  return res.json();
}

export async function updateKeywords(
  fcmToken: string,
  keywords: string[]
): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/keywords`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fcmToken, keywords }),
  });
  if (!res.ok) throw new Error('키워드 업데이트 실패');
  return res.json();
}

export async function updatePushToggle(
  fcmToken: string,
  isActive: boolean
): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/push-toggle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fcmToken, isActive }),
  });
  if (!res.ok) throw new Error('푸시 토글 업데이트 실패');
  return res.json();
}
