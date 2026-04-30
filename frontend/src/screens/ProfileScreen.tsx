import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const [isPushEnabled, setIsPushEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <View>
          <Text style={styles.settingTitle}>푸시 알림 수신</Text>
          <Text style={styles.settingDesc}>새로운 핫딜 알림을 받습니다</Text>
        </View>
        <Switch
          value={isPushEnabled}
          onValueChange={setIsPushEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isPushEnabled ? '#007bff' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>문의하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>앱 버전 정보 (1.0.0)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 20 },
  settingTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  settingDesc: { fontSize: 12, color: '#666' },
  menuItem: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuText: { fontSize: 16, color: '#333' }
});
