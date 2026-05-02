import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { AppContext } from '../../App';
import { updateKeywords } from '../services/api';

export default function KeywordScreen() {
  const { fcmToken, userKeywords, setUserKeywords } = useContext(AppContext);
  const [keyword, setKeyword] = useState('');

  const syncKeywords = async (newKeywords: string[]) => {
    setUserKeywords(newKeywords);
    if (!fcmToken) return;
    try {
      await updateKeywords(fcmToken, newKeywords);
    } catch {
      Alert.alert('동기화 실패', '서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.');
    }
  };

  const addKeyword = () => {
    const trimmed = keyword.trim();
    if (trimmed && !userKeywords.includes(trimmed)) {
      syncKeywords([...userKeywords, trimmed]);
      setKeyword('');
    }
  };

  const removeKeyword = (item: string) => {
    syncKeywords(userKeywords.filter((k) => k !== item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>알림 받을 키워드를 등록하세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="예: 아이패드, 물티슈"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={addKeyword}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addKeyword}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      {userKeywords.length === 0 && (
        <Text style={styles.emptyText}>
          등록된 키워드가 없습니다.{'\n'}관심 상품 키워드를 추가해보세요!
        </Text>
      )}

      <FlatList
        data={userKeywords}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.keywordItem}>
            <Text style={styles.keywordText}>{item}</Text>
            <TouchableOpacity onPress={() => removeKeyword(item)}>
              <Text style={styles.deleteText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  keywordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  keywordText: { fontSize: 16, color: '#333' },
  deleteText: { color: '#ff4444', fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
});
