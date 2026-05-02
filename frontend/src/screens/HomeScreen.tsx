import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { fetchDeals, Deal } from '../services/api';

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const SOURCE_LABELS: Record<string, string> = {
  ppomppu: '뽐뿌',
  ruliweb: '루리웹',
  clien: '클리앙',
};

export default function HomeScreen() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDeals = useCallback(async () => {
    try {
      const data = await fetchDeals();
      setDeals(data);
    } catch {
      // 백엔드 미연결 시 빈 상태 유지
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDeals();
  }, [loadDeals]);

  const openDeal = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const renderItem = ({ item }: { item: Deal }) => (
    <View style={styles.card}>
      <Text style={styles.source}>
        {SOURCE_LABELS[item.source] || item.source}
      </Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{getRelativeTime(item.createdAt)}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => openDeal(item.originalUrl)}
      >
        <Text style={styles.buttonText}>확인하기</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>핫딜을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deals}
        renderItem={renderItem}
        keyExtractor={(item) => item.dealId}
        contentContainerStyle={deals.length === 0 ? styles.centered : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007bff']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 핫딜이 없습니다</Text>
            <Text style={styles.emptySubText}>당겨서 새로고침 해보세요</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  source: { fontSize: 12, color: '#666', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  time: { fontSize: 12, color: '#999', marginBottom: 12 },
  button: {
    backgroundColor: '#e5f3ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#007bff', fontWeight: 'bold' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  emptyContainer: { alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#999', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#bbb' },
});
