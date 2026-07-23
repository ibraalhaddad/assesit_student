import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, Modal, ScrollView, RefreshControl 
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getLessons, requestAiAction } from '../../api/services';

export default function LessonsScreen() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchLessons();
    }, [])
  );

  const fetchLessons = async () => {
    try {
      const data = await getLessons();
      setLessons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLessons();
  };

  const handleAiRequest = async (lessonId, lessonContent, type) => {
    setAiLoading(true);
    try {
      // type يمكن أن يكون: summary, explanation, quiz, flashcards
      const result = await requestAiAction(lessonId, lessonContent, type);
      if (result.success) {
        const responseData = result.data;
        // استخراج القيمة بناءً على العمود المعني في جدول قاعدة البيانات
        const contentToShow = responseData[type] || responseData;

        setAiResult({
          type: type.toUpperCase(),
          content: typeof contentToShow === 'object' ? JSON.stringify(contentToShow, null, 2) : contentToShow
        });
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في توليد الرد من الذكاء الاصطناعي');
    } finally {
      setAiLoading(false);
    }
  };

  const renderLessonItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.snippet} numberOfLines={3}>{item.html_content || item.content}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, styles.summaryBtn]} 
          onPress={() => handleAiRequest(item.id, item.html_content || item.content, 'summary')}
          disabled={aiLoading}>
          <Text style={styles.btnText}>Summary 📝</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, styles.quizBtn]} 
          onPress={() => handleAiRequest(item.id, item.html_content || item.content, 'quiz')}
          disabled={aiLoading}>
          <Text style={styles.btnText}>Quiz 🤖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {aiLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>جاري المعالجة والحفظ في قاعدة البيانات...</Text>
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLessonItem}
          contentContainerStyle={{ padding: 15 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد دروس حالياً. أضف درساً جديداً من تبويب "إدخال بيانات".</Text>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>نتيجة: {aiResult?.type}</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalBody}>{aiResult?.content}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 8, color: '#1a1a1a' },
  snippet: { color: '#555', textAlign: 'right', marginBottom: 16, lineHeight: 22 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, padding: 12, borderRadius: 8, alignItems: 'center' },
  summaryBtn: { backgroundColor: '#10b981' },
  quizBtn: { backgroundColor: '#6366f1' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  loadingBox: { backgroundColor: '#fff', padding: 25, borderRadius: 12, alignItems: 'center' },
  loadingText: { marginTop: 12, fontWeight: 'bold', color: '#333' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#007bff', marginBottom: 15 },
  modalScroll: { marginVertical: 10 },
  modalBody: { fontSize: 15, lineHeight: 24, textAlign: 'left', writingDirection: 'ltr', color: '#333' },
  closeBtn: { backgroundColor: '#ef4444', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 }
});