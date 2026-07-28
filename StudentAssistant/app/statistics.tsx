import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. الأنواع (TypeScript Interfaces)
type TimeFrame = 'week' | 'month' | 'all';

interface SubjectPerformance {
    id: string;
    name: string;
    score: number; // النسبة المئوية 0 - 100
    color: string;
    testsCount: number;
}

interface DailyStudy {
    day: string;
    hours: number;
    isToday?: boolean;
}

// 2. بيانات الساعات الدراسية للأسبوع
const WEEKLY_STUDY_DATA: DailyStudy[] = [
    { day: 'الأحد', hours: 3.5 },
    { day: 'الإثنين', hours: 4.0 },
    { day: 'الثلاثاء', hours: 5.5, isToday: true },
    { day: 'الأربعاء', hours: 2.0 },
    { day: 'الخميس', hours: 4.5 },
    { day: 'الجمعة', hours: 1.5 },
    { day: 'السبت', hours: 3.0 },
];

// 3. بيانات مستوى الأداء حسب المادة
const SUBJECTS_PERFORMANCE: SubjectPerformance[] = [
    { id: 'math', name: 'الرياضيات', score: 92, color: '#4F46E5', testsCount: 8 },
    { id: 'arabic', name: 'اللغة العربية', score: 85, color: '#059669', testsCount: 6 },
    { id: 'physics', name: 'الفيزياء', score: 74, color: '#2563EB', testsCount: 5 },
    { id: 'english', name: 'اللغة الإنجليزية', score: 88, color: '#D97706', testsCount: 7 },
    { id: 'chemistry', name: 'الكيمياء', score: 68, color: '#DC2626', testsCount: 4 },
];

export default function StatisticsScreen(): React.JSX.Element {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');

    // حساب أعلى عدد ساعات للرسم البياني
    const maxHours = Math.max(...WEEKLY_STUDY_DATA.map((d) => d.hours), 6);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* --- 1. الشريط العلوي (Header) --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
                    <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>الإحصائيات والأداء</Text>

                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- 2. فلتر الفترة الزمنية --- */}
                <View style={styles.timeFrameSegment}>
                    {[
                        { id: 'week', label: 'هذا الأسبوع' },
                        { id: 'month', label: 'هذا الشهر' },
                        { id: 'all', label: 'التراكمي' },
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.segmentBtn,
                                timeFrame === item.id && styles.segmentBtnActive,
                            ]}
                            onPress={() => setTimeFrame(item.id as TimeFrame)}
                        >
                            <Text style={[styles.segmentText, timeFrame === item.id && styles.segmentTextActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* --- 3. بطاقات المؤشرات السريعة (KPI Cards) --- */}
                <View style={styles.kpiGrid}>
                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="time-outline" size={22} color="#4F46E5" />
                        </View>
                        <Text style={styles.kpiValue}>24.0 س</Text>
                        <Text style={styles.kpiLabel}>ساعات الدراسة</Text>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="checkmark-done-circle-outline" size={22} color="#16A34A" />
                        </View>
                        <Text style={styles.kpiValue}>85%</Text>
                        <Text style={styles.kpiLabel}>إنجاز المهام</Text>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="trophy-outline" size={22} color="#D97706" />
                        </View>
                        <Text style={styles.kpiValue}>81%</Text>
                        <Text style={styles.kpiLabel}>متوسط الاختبارات</Text>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIconBox, { backgroundColor: '#FFEDD5' }]}>
                            <Ionicons name="flame-outline" size={22} color="#EA580C" />
                        </View>

                        <Text style={styles.kpiValue}>7 أيام</Text>
                        <Text style={styles.kpiLabel}>سلسلة الالتزام 🔥</Text>
                    </View>
                </View>

                {/* --- 4. الرسم البياني لساعات الدراسة اليومية --- */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.cardTitle}>ساعات الدراسة اليومية</Text>
                        <Text style={styles.chartSubText}>المجموع: 24 ساعة</Text>
                    </View>

                    <View style={styles.barChartContainer}>
                        {WEEKLY_STUDY_DATA.map((item, index) => {
                            const heightPercent = (item.hours / maxHours) * 100;
                            return (
                                <View key={index} style={styles.barColumn}>
                                    <Text style={styles.barValueText}>{item.hours}س</Text>
                                    <View style={styles.barTrack}>
                                        <View
                                            style={[
                                                styles.barFill,
                                                { height: `${heightPercent}%` },
                                                item.isToday && styles.barFillToday,
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.barDayLabel, item.isToday && styles.barDayLabelToday]}>
                                        {item.day}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* --- 5. تحليل المستويات حسب المادة --- */}
                <View style={styles.sectionCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.cardTitle}>مستوى الأداء حسب المادة</Text>
                        <Ionicons name="analytics-outline" size={20} color="#4F46E5" />
                    </View>

                    <View style={styles.subjectsList}>
                        {SUBJECTS_PERFORMANCE.map((subject) => (
                            <View key={subject.id} style={styles.subjectRow}>
                                <View style={styles.subjectMeta}>
                                    <Text style={styles.subjectName}>{subject.name}</Text>
                                    <Text style={styles.subjectScoreText}>{subject.score}%</Text>
                                </View>

                                {/* شريط نسبة الإتقان */}
                                <View style={styles.subjectProgressTrack}>
                                    <View
                                        style={[
                                            styles.subjectProgressFill,
                                            { width: `${subject.score}%`, backgroundColor: subject.color },
                                        ]}
                                    />
                                </View>

                                <Text style={styles.testsCountText}>مبني على {subject.testsCount} اختبارات</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- 6. نصيحة الذكاء الاصطناعي (علاّم) --- */}
                <View style={styles.aiInsightCard}>
                    <View style={styles.aiHeader}>
                        <Ionicons name="sparkles" size={20} color="#4F46E5" />
                        <Text style={styles.aiTitle}>ملاحظة الذكاء الاصطناعي</Text>
                    </View>
                    <Text style={styles.aiDescription}>
                        أداؤك ممتااز جداً في **الرياضيات** و**اللغة الإنجليزية**! يُنصح بتركيز خطتك الدراسية للأيام القادمة على مادة **الكيمياء** لرفع نسبة إتقانها إلى فوق 80%.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 16,
    },
    timeFrameSegment: {
        flexDirection: 'row-reverse',
        backgroundColor: '#E2E8F0',
        padding: 4,
        borderRadius: 12,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 9,
    },
    segmentBtnActive: {
        backgroundColor: '#FFF',
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    segmentTextActive: {
        color: '#4F46E5',
        fontWeight: 'bold',
    },

    // الشبكة الخاصة بالمؤشرات (KPIs)
    kpiGrid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 10,
    },
    kpiCard: {
        width: '48.5%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'flex-end',
        gap: 4,
    },
    kpiIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    kpiValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    kpiLabel: {
        fontSize: 12,
        color: '#64748B',
    },

    // رسم الأعمدة البياني
    chartCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chartHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    chartSubText: {
        fontSize: 12,
        color: '#64748B',
    },
    barChartContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingTop: 20,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
    },
    barValueText: {
        fontSize: 10,
        color: '#64748B',
        marginBottom: 4,
    },
    barTrack: {
        width: 14,
        height: 100,
        backgroundColor: '#F1F5F9',
        borderRadius: 7,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        backgroundColor: '#94A3B8',
        borderRadius: 7,
    },
    barFillToday: {
        backgroundColor: '#4F46E5',
    },
    barDayLabel: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 6,
    },
    barDayLabelToday: {
        color: '#4F46E5',
        fontWeight: 'bold',
    },

    // تحليل المواد
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    subjectsList: {
        gap: 14,
        marginTop: 4,
    },
    subjectRow: {
        gap: 4,
    },
    subjectMeta: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    subjectScoreText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    subjectProgressTrack: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    subjectProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    testsCountText: {
        fontSize: 10,
        color: '#94A3B8',
        textAlign: 'right',
    },

    // نصيحة الذكاء الاصطناعي
    aiInsightCard: {
        backgroundColor: '#EEF2FF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#C7D2FE',
        gap: 8,
    },
    aiHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    aiTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    aiDescription: {
        fontSize: 13,
        color: '#334155',
        lineHeight: 20,
        textAlign: 'right',
    },
});