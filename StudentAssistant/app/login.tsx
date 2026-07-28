import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SignInScreen(): React.JSX.Element {
  const [secureText, setSecureText] = useState(true);
  // حالة نوع المستخدم: 'student' أو 'parent'
  const [userRole, setUserRole] = useState<'student' | 'parent'>('student');

  // التعامل مع عملية تسجيل الدخول بناءً على الدور المحدد
  const handleLogin = () => {
    if (userRole === 'parent') {
      router.replace('/parent-dashboard');
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.content}>

        {/* --- شعار علام --- */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="school" size={46} color="#4F46E5" />
          </View>
          <Text style={styles.brandTitle}>علاّم</Text>
          <Text style={styles.brandSubtitle}>منصة تعليمية ذكية</Text>
        </View>

        {/* --- خيار تحديد نوع الحساب (طالب / ولي أمر) --- */}
        <View style={styles.roleSelectorContainer}>
          <TouchableOpacity
            style={[
              styles.roleTab,
              userRole === 'student' && styles.roleTabActive,
            ]}
            onPress={() => setUserRole('student')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="school-outline"
              size={18}
              color={userRole === 'student' ? '#FFF' : '#64748B'}
            />
            <Text
              style={[
                styles.roleTabText,
                userRole === 'student' && styles.roleTabTextActive,
              ]}
            >
              طــالــب
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleTab,
              userRole === 'parent' && styles.roleTabActive,
            ]}
            onPress={() => setUserRole('parent')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="people-outline"
              size={18}
              color={userRole === 'parent' ? '#FFF' : '#64748B'}
            />
            <Text
              style={[
                styles.roleTabText,
                userRole === 'parent' && styles.roleTabTextActive,
              ]}
            >
              ولي أَمـر
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {userRole === 'parent' ? 'تسجيل دخول أولياء الأمور' : 'تسجيل الدخول'}
        </Text>
        <Text style={styles.subtitle}>
          {userRole === 'parent'
            ? 'أدخل بيانات حسابك لمتابعة مستوى أبنائك'
            : 'أدخل بيانات حسابك للمتابعة'}
        </Text>

        {/* --- الحقول --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>البريد الإلكتروني أو رقم الهاتف</Text>
          <TextInput
            style={styles.input}
            placeholder={
              userRole === 'parent'
                ? 'أدخل بريد ولي الأمر المسجل'
                : 'أدخل البريد الإلكتروني'
            }
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
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
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={secureText ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/recovery')}
          style={styles.forgotContainer}
        >
          <Text style={styles.forgotText}>هل نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        {/* --- زر تسجيل الدخول --- */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {userRole === 'parent' ? 'الدخول للوحة المتابعة' : 'تسجيل الدخول'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}>أنشئ حساباً جديداً</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logoPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  brandSubtitle: { fontSize: 13, color: '#64748B' },

  // تبويب اختيار نوع الدخول
  roleSelectorContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  roleTabActive: {
    backgroundColor: '#4F46E5',
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#FFF',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 16,
  },
  inputContainer: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'right',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    textAlign: 'right',
    fontSize: 14,
    color: '#1E293B',
  },
  passwordRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  eyeIcon: { paddingHorizontal: 12 },
  forgotContainer: { alignItems: 'flex-start', marginBottom: 20 },
  forgotText: { color: '#4F46E5', fontSize: 13, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#4F46E5',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  primaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  footerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: { color: '#64748B', fontSize: 13 },
  linkText: { color: '#4F46E5', fontSize: 13, fontWeight: 'bold' },
});