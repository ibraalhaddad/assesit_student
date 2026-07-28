import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RecoveryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-open-outline" size={32} color="#4F46E5" />
        </View>

        <Text style={styles.title}>استعادة كلمة المرور</Text>
        <Text style={styles.subtitle}>أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput style={styles.input} placeholder="example@domain.com" placeholderTextColor="#94A3B8" />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/verification')}>
          <Text style={styles.primaryButtonText}>إرسال الرمز</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>العودة لتسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', textAlign: 'right', marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, height: 50, textAlign: 'right', fontSize: 14, color: '#1E293B' },
  primaryButton: { backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 4 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#64748B', fontSize: 14, fontWeight: '600' }
});