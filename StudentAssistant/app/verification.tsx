import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function VerificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark-outline" size={32} color="#4F46E5" />
        </View>

        <Text style={styles.title}>رمز التحقق</Text>
        <Text style={styles.subtitle}>أدخل رمز التحقق المكون من 4 أرقام المرسل إلى بريدك الإلكتروني.</Text>

        <View style={styles.codeContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <TextInput key={index} style={styles.codeInput} maxLength={1} keyboardType="numeric" />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/selectGrade')}>
          <Text style={styles.primaryButtonText}>تحقق وتأكيد</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>لم تستلم الرمز؟ <Text style={styles.linkText}>إعادة إرسال</Text></Text>
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
  codeContainer: { flexDirection: 'row-reverse', justifyContent: 'center', gap: 12, marginBottom: 25 },
  codeInput: { width: 55, height: 55, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  primaryButton: { backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 4 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  resendContainer: { marginTop: 20, alignItems: 'center' },
  resendText: { color: '#64748B', fontSize: 14 },
  linkText: { color: '#4F46E5', fontWeight: 'bold' }
});