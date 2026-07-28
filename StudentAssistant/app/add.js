import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { addLessonData } from '../api/services';

export default function AddDataScreen() {
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [subjectId, setSubjectId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setSuccessMessage(''); // إخفاء أي رسالة قديمة

    if (!title.trim() || !htmlContent.trim()) {
      setSuccessMessage('⚠️ يجدر كتابة عنوان ومحتوى الدرس أولاً');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        html_content: htmlContent.trim(),
        subject_id: parseInt(subjectId) || 1
      };

      const res = await addLessonData(payload);

      if (res && (res.success || res.id || res.data)) {
        setSuccessMessage('✨ تم حفظ الدرس في قاعدة البيانات بنجاح!');
        setTitle('');
        setHtmlContent('');
      } else {
        setSuccessMessage('❌ لم يتم حفظ الدرس بشكل صحيح.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'فشل في الاتصال بالخادم';
      setSuccessMessage(`❌ خطأ: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>إضافة درس جديد للقاعدة</Text>

          {/* رسالة النجاح أو الخطأ تظهر هنا مباشرة على الشاشة والمتصفح */}
          {successMessage ? (
            <View style={[styles.banner, successMessage.includes('❌') ? styles.errorBanner : styles.successBanner]}>
              <Text style={styles.bannerText}>{successMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>رقم المادة (Subject ID):</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            value={subjectId}
            onChangeText={setSubjectId}
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>عنوان الدرس:</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: مقدمة في قواعد البيانات"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />

          <Text style={styles.label}>محتوى الدرس (HTML أو نص):</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="اكتب محتوى الدرس هنا..."
            value={htmlContent}
            onChangeText={setHtmlContent}
            multiline
            numberOfLines={8}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            activeOpacity={0.7}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>حفظ الدرس في قاعدة البيانات</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f6f9' },
  container: { flexGrow: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'right', color: '#1a1a1a' },
  banner: { padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  successBanner: { backgroundColor: '#d1fae5', borderWidth: 1, borderColor: '#34d399' },
  errorBanner: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#f87171' },
  bannerText: { fontSize: 15, fontWeight: '600', color: '#1f2937', textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'right', color: '#444' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', textAlign: 'right', fontSize: 15 },
  textArea: { height: 160, textAlignVertical: 'top' },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});