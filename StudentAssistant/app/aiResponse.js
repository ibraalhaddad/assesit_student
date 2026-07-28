import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getSavedAiResponses } from '../api/services';

export default function SavedResponsesScreen() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchResponses();
    }, [])
  );

  const fetchResponses = async () => {
    try {
      const data = await getSavedAiResponses();
      setResponses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchResponses();
  };

  const renderItem = ({ item }) => {
    // تحديد أي عمود تم ملؤه في سجل قاعدة البيانات
    const contentToShow = item.summary || item.explanation || item.quiz || item.flashcards || 'لا توجد بيانات';
    const displayContent = typeof contentToShow === 'object' ? JSON.stringify(contentToShow, null, 2) : contentToShow;

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.badge}>معالجة AI</Text>
          <Text style={styles.date}>
            {new Date(item.generated_at || item.created_at).toLocaleDateString('ar-EG')}
          </Text>
        </View>

        <Text style={styles.lessonTitle}>📁 درس ID: {item.lesson_id || 'عام'}</Text>
        <View style={styles.divider} />

        <Text style={styles.responseText} selectable>{displayContent}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={responses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد استجابات محفوظة حتى الآن.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { backgroundColor: '#e0e7ff', color: '#3730a3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontWeight: 'bold', fontSize: 12 },
  date: { color: '#888', fontSize: 12 },
  lessonTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', color: '#1f2937' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 10 },
  responseText: { fontSize: 14, color: '#374151', lineHeight: 22, textAlign: 'left', writingDirection: 'ltr', backgroundColor: '#f8fafc', padding: 10, borderRadius: 8 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 50, fontSize: 15 }
});