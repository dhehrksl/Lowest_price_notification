import React, { useContext } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { AppContext } from '../../App';
import { updatePushToggle } from '../services/api';

export default function ProfileScreen() {
  const { fcmToken, isPushActive, setIsPushActive, userKeywords } =
    useContext(AppContext);

  const handleToggle = async (value: boolean) => {
    setIsPushActive(value);
    if (!fcmToken) return;
    try {
      await updatePushToggle(fcmToken, value);
    } catch {
      Alert.alert('동기화 실패', '서버와 연결할 수 없습니다.');
      setIsPushActive(!value); // 롤백
    }
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@hotdeal-app.com?subject=초저가알리미 문의');
  };

  return (
    <View style={styles.container}>
      {/* 푸시 알림 토글 */}
      <View style={styles.settingItem}>
        <View>
          <Text style={styles.settingTitle}>푸시 알림 수신</Text>
          <Text style={styles.settingDesc}>새로운 핫딜 알림을 받습니다</Text>
        </View>
        <Switch
          value={isPushActive}
          onValueChange={handleToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isPushActive ? '#007bff' : '#f4f3f4'}
        />
      </View>

      {/* 등록된 키워드 수 */}
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>등록 키워드</Text>
        <Text style={styles.infoValue}>{userKeywords.length}개</Text>
      </View>

      {/* 메뉴 */}
      <TouchableOpacity style={styles.menuItem} onPress={handleContact}>
        <Text style={styles.menuText}>문의하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
        <Text style={styles.menuText}>앱 버전 정보 (1.0.0)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  settingDesc: { fontSize: 12, color: '#666' },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoLabel: { fontSize: 16, color: '#333' },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuText: { fontSize: 16, color: '#333' },
});
