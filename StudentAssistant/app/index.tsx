import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [secureText, setSecureText] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* شعار علام */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="school" size={50} color="#4F46E5" />
          </View>
          <Text style={styles.brandTitle}>علاّم</Text>
          <Text style={styles.brandSubtitle}>منصة تعليمية</Text>
        </View>

        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>أدخل بيانات حسابك للمتابعة</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>البريد الإلكتروني أو اسم المستخدم</Text>
          <TextInput style={styles.input} placeholder="أدخل البريد الإلكتروني" placeholderTextColor="#94A3B8" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>كلمة المرور</Text>
          <View style={styles.passwordRow}>
            <TextInput 
              style={[styles.input, { flex: 1, borderWidth: 0 }]} 
              placeholder="أدخل كلمة المرور" 
              placeholderTextColor="#94A3B8"
              secureTextEntry={secureText} 
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
              <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/recovery')} style={styles.forgotContainer}>
          <Text style={styles.forgotText}>هل نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.primaryButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}>انشئ حساب جديد</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoPlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  brandSubtitle: { fontSize: 13, color: '#64748B' },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B', textAlign: 'right', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'right', marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', textAlign: 'right', marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, height: 50, textAlign: 'right', fontSize: 14, color: '#1E293B' },
  passwordRow: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12 },
  eyeIcon: { paddingHorizontal: 12 },
  forgotContainer: { alignItems: 'flex-start', marginBottom: 20 },
  forgotText: { color: '#4F46E5', fontSize: 13, fontWeight: '600' },
  primaryButton: { backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 4 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerRow: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#64748B', fontSize: 14 },
  linkText: { color: '#4F46E5', fontSize: 14, fontWeight: 'bold' }
});