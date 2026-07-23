import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SignUpScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>إنشاء حساب جديد</Text>
                <Text style={styles.subtitle}>املأ البيانات التالية للمتابعة</Text>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>الاسم الأول</Text>
                        <TextInput style={styles.input} placeholder="أدخل اسمك الأول" placeholderTextColor="#94A3B8" />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Text style={styles.label}>الاسم الثاني</Text>
                        <TextInput style={styles.input} placeholder="أدخل اسمك الثاني" placeholderTextColor="#94A3B8" />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>تاريخ الميلاد</Text>
                    <View style={styles.selectBox}>
                        <Text style={styles.selectText}>يوم / شهر / سنة</Text>
                        <Ionicons name="chevron-down" size={18} color="#64748B" />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>الجنس</Text>
                    <View style={styles.selectBox}>
                        <Text style={styles.selectText}>اختر الجنس</Text>
                        <Ionicons name="chevron-down" size={18} color="#64748B" />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>كلمة المرور</Text>
                    <TextInput style={styles.input} placeholder="أدخل كلمة المرور" secureTextEntry placeholderTextColor="#94A3B8" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>تأكيد كلمة المرور</Text>
                    <TextInput style={styles.input} placeholder="أعد إدخال كلمة المرور" secureTextEntry placeholderTextColor="#94A3B8" />
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/verification')}>
                    <Text style={styles.primaryButtonText}>إنشاء حساب</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>هل لديك حساب بالفعل؟ </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>تسجيل الدخول</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scroll: { padding: 24 },
    title: { fontSize: 22, fontWeight: '700', color: '#1E293B', textAlign: 'right', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748B', textAlign: 'right', marginBottom: 20 },
    row: { flexDirection: 'row-reverse' },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 13, fontWeight: '600', color: '#334155', textAlign: 'right', marginBottom: 6 },
    input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, height: 48, textAlign: 'right', fontSize: 14, color: '#1E293B' },
    selectBox: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, height: 48 },
    selectText: { color: '#94A3B8', fontSize: 14 },
    primaryButton: { backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 4 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    footerRow: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 20, marginBottom: 20 },
    footerText: { color: '#64748B', fontSize: 14 },
    linkText: { color: '#4F46E5', fontSize: 14, fontWeight: 'bold' }
});