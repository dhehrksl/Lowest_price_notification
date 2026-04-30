import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const MOCK_DATA = [
  { id: '1', title: '[뽐뿌] 아이패드 프로 11인치 M4 100만 대란', source: 'ppomppu', time: '방금 전' },
  { id: '2', title: '[알뜰구매] 에어팟 프로 2세대 20만원 탑승하세요', source: 'ruliweb', time: '5분 전' },
];

export default function HomeScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.source}>{item.source}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>쿠팡에서 확인하기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  source: { fontSize: 12, color: '#666', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  time: { fontSize: 12, color: '#999', marginBottom: 12 },
  button: { backgroundColor: '#e5f3ff', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#007bff', fontWeight: 'bold' }
});
