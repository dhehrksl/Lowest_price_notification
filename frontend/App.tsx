import React, { createContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { registerUser } from './src/services/api';

export const AppContext = createContext<{
  fcmToken: string;
  userKeywords: string[];
  setUserKeywords: (kw: string[]) => void;
  isPushActive: boolean;
  setIsPushActive: (v: boolean) => void;
}>({
  fcmToken: '',
  userKeywords: [],
  setUserKeywords: () => {},
  isPushActive: true,
  setIsPushActive: () => {},
});

export default function App() {
  const [fcmToken, setFcmToken] = useState('');
  const [userKeywords, setUserKeywords] = useState<string[]>([]);
  const [isPushActive, setIsPushActive] = useState(true);

  useEffect(() => {
    initUser();
  }, []);

  async function initUser() {
    try {
      // 기기 고유 토큰 생성 (실제 배포 시 expo-notifications의 getDevicePushTokenAsync로 교체)
      const token = `device_${Platform.OS}_${Date.now()}`;
      setFcmToken(token);

      const user = await registerUser(token);
      setUserKeywords(user.keywords || []);
      setIsPushActive(user.isActive);
    } catch {
      // 백엔드 미연결 시 로컬 모드로 동작
      console.log('[App] 백엔드 연결 실패, 로컬 모드로 동작');
    }
  }

  return (
    <AppContext.Provider
      value={{ fcmToken, userKeywords, setUserKeywords, isPushActive, setIsPushActive }}
    >
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
