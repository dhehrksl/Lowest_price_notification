import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function KeywordScreen() {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState(['아이패드', '에어팟', '맥북']);

  const addKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const removeKeyword = (item: string) => {
    setKeywords(keywords.filter(k => k !== item));
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
        />
        <TouchableOpacity style={styles.addButton} onPress={addKeyword}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={keywords}
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
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginRight: 8 },
  addButton: { backgroundColor: '#007bff', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 8 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  keywordItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  keywordText: { fontSize: 16, color: '#333' },
  deleteText: { color: '#ff4444', fontWeight: 'bold' }
});
