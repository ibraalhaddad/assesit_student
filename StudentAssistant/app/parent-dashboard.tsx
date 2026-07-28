import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. الأنواع (TypeScript Interfaces)
interface SubjectProgress {
    id: string;
    name: string;
    score: number;
    status: 'ممتاز' | 'جيد جداً' | 'يحتاج تحسين';
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
}

interface RecentActivity {
    id: string;
    title: string;
    date: string;
    score: string;
    type: 'exam' | 'assignment' | 'lesson';
}

// 2. البيانات الافتراضية لأداء الطالب
const SUBJECTS_DATA: SubjectProgress[] = [
    { id: '1', name: 'الرياضيات', score: 95, status: 'ممتاز', color: '#10B981', icon: 'calculator-outline' },
    { id: '2', name: 'الفيزياء', score: 84, status: 'جيد جداً', color: '#4F46E5', icon: 'flash-outline' },
    { id: '3', name: 'اللغة العربية', score: 98, status: 'ممتاز', color: '#10B981', icon: 'book-outline' },
    { id: '4', name: 'اللغة الإنجليزية', score: 89, status: 'جيد جداً', color: '#0284C7', icon: 'language-outline' },
    { id: '5', name: 'الكيمياء', score: 72, status: 'يحتاج تحسين', color: '#F59E0B', icon: 'beaker-outline' },
];

const RECENT_ACTIVITIES: RecentActivity[] = [
    { id: '1', title: 'اختبار شهر يوليو - التفاضل والتكامل', date: 'أمس، 4:30 م', score: '95 / 100', type: 'exam' },
    { id: '2', title: 'تسليم واجب الفيزياء الموجية', date: 'قبل يومين', score: 'تم التسليم', type: 'assignment' },
    { id: '3', title: 'إكمال 3 دروس في قواعد النحو', date: '25 يوليو', score: '100%', type: 'lesson' },
];

export default function ParentDashboardScreen(): React.JSX.Element {
    const [selectedChild] = useState('أحمد محمد علي');

    const handleLogout = () => {
        Alert.alert('تسجيل الخروج', 'هل ترغب في تسجيل الخروج من لوحة ولي الأمر؟', [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'خروج', style: 'destructive', onPress: () => router.replace('/login') },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* --- 1. الشريط العلوي --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconCircle} onPress={handleLogout} activeOpacity={0.7}>
                    <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                </TouchableOpacity>

                <View style={styles.headerTitleBox}>
                    <Text style={styles.headerTitle}>لوحة متابعة ولي الأمر</Text>
                    <Text style={styles.headerSubtitle}>مرحباً بك، أ. محمد 👋</Text>
                </View>

                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
                    <Ionicons name="notifications-outline" size={20} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- 2. كارت معلومات الطالب المُنتمي لولي الأمر --- */}
                <View style={styles.studentCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200' }}
                        style={styles.avatar}
                    />
                    <View style={styles.studentInfo}>
                        <View style={styles.childBadge}>
                            <Ionicons name="person" size={12} color="#4F46E5" />
                            <Text style={styles.childBadgeText}>الطالب المتابع</Text>
                        </View>
                        <Text style={styles.studentName}>{selectedChild}</Text>
                        <Text style={styles.studentDetails}>الصف الثالث الثانوي — العلمي</Text>
                        <Text style={styles.lastActiveText}>🟢 نشط الآن على المنصة</Text>
                    </View>
                </View>

                {/* --- 3. شبكة الإحصائيات السريعة --- */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="trophy" size={20} color="#4F46E5" />
                        </View>
                        <Text style={styles.statValue}>87.6%</Text>
                        <Text style={styles.statLabel}>المعدل العام</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="time" size={20} color="#16A34A" />
                        </View>
                        <Text style={styles.statValue}>18.5 س</Text>
                        <Text style={styles.statLabel}>دراسة هذا الأسبوع</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="checkmark-circle" size={20} color="#D97706" />
                        </View>
                        <Text style={styles.statValue}>95%</Text>
                        <Text style={styles.statLabel}>نسبة الالتزام</Text>
                    </View>
                </View>

                {/* --- 4. التوصية والملاحظة الذكية (AI Report) --- */}
                <View style={styles.aiNoticeCard}>
                    <View style={styles.aiNoticeHeader}>
                        <Ionicons name="bulb" size={20} color="#D97706" />
                        <Text style={styles.aiNoticeTitle}>تقرير المساعد الذكي لولي الأمر</Text>
                    </View>
                    <Text style={styles.aiNoticeContent}>
                        أحمد يظهر تفوقاً ممتازاً في مادة <Text style={{ fontWeight: 'bold' }}>الرياضيات واللغة العربية</Text>. يُنصح بتحفيزه لمراجعة الفصل الثاني في <Text style={{ fontWeight: 'bold', color: '#D97706' }}>الكيمياء</Text> قبل اختبار الأسبوع القادم.
                    </Text>
                </View>

                {/* --- 5. مستوى أداء الطالب في المواد --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>الأداء حسب المواد الدراسية</Text>
                        <Text style={styles.sectionSub}>5 مواد</Text>
                    </View>

                    <View style={styles.subjectsContainer}>
                        {SUBJECTS_DATA.map((subject) => (
                            <View key={subject.id} style={styles.subjectRow}>
                                <View style={styles.subjectRight}>
                                    <View style={[styles.subIcon, { backgroundColor: '#F1F5F9' }]}>
                                        <Ionicons name={subject.icon} size={18} color="#4F46E5" />
                                    </View>
                                    <View style={styles.subMeta}>
                                        <Text style={styles.subName}>{subject.name}</Text>
                                        <View style={styles.progressTrack}>
                                            <View
                                                style={[
                                                    styles.fillBar,
                                                    { width: `${subject.score}%`, backgroundColor: subject.color },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.scoreBadgeBox}>
                                    <Text style={[styles.scoreText, { color: subject.color }]}>
                                        {subject.score}%
                                    </Text>
                                    <Text style={styles.statusTag}>{subject.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- 6. سجل الأنشطة والاختبارات الأخيرة --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>آخر التقييمات والأنشطة</Text>
                    </View>

                    <View style={styles.activitiesContainer}>
                        {RECENT_ACTIVITIES.map((item) => (
                            <View key={item.id} style={styles.activityItem}>
                                <View style={styles.activityIconBox}>
                                    <Ionicons
                                        name={
                                            item.type === 'exam'
                                                ? 'document-text-outline'
                                                : item.type === 'assignment'
                                                    ? 'checkmark-done-circle-outline'
                                                    : 'play-circle-outline'
                                        }
                                        size={20}
                                        color="#4F46E5"
                                    />
                                </View>
                                <View style={styles.activityMeta}>
                                    <Text style={styles.activityTitle}>{item.title}</Text>
                                    <Text style={styles.activityDate}>{item.date}</Text>
                                </View>
                                <View style={styles.activityResultBox}>
                                    <Text style={styles.activityResultText}>{item.score}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- 7. أزرار التواصل والتصاوير --- */}
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity style={styles.downloadReportBtn} activeOpacity={0.8}>
                        <Ionicons name="download-outline" size={18} color="#FFF" />
                        <Text style={styles.downloadBtnText}>تحميل تقرير (PDF)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactBtn} activeOpacity={0.8}>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#4F46E5" />
                        <Text style={styles.contactBtnText}>التواصل مع معلمي الطالب</Text>
                    </TouchableOpacity>
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
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitleBox: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 40,
    },

    // كارت الطالب
    studentCard: {
        flexDirection: 'row-reverse',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        gap: 14,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#EEF2FF',
    },
    studentInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    childBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
        marginBottom: 4,
    },
    childBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    studentDetails: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    lastActiveText: {
        fontSize: 10,
        color: '#16A34A',
        fontWeight: '600',
        marginTop: 4,
    },

    // الشبكة والإحصائيات
    statsGrid: {
        flexDirection: 'row-reverse',
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2,
        textAlign: 'center',
    },

    // تنبيه الذكاء الاصطناعي
    aiNoticeCard: {
        backgroundColor: '#FEF3C7',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#FDE68A',
        gap: 6,
    },
    aiNoticeHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    aiNoticeTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#92400E',
    },
    aiNoticeContent: {
        fontSize: 12,
        color: '#78350F',
        lineHeight: 18,
        textAlign: 'right',
    },

    // المواد
    section: {
        gap: 10,
    },
    sectionHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    sectionSub: {
        fontSize: 12,
        color: '#64748B',
    },
    subjectsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 14,
    },
    subjectRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    subIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subMeta: {
        flex: 1,
        alignItems: 'flex-start',
    },
    subName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 6,
    },
    progressTrack: {
        width: '90%',
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    fillBar: {
        height: '100%',
        borderRadius: 3,
    },
    scoreBadgeBox: {
        alignItems: 'flex-end',
    },
    scoreText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusTag: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2,
    },

    // السجل
    activitiesContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 10,
    },
    activityItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    activityIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityMeta: {
        flex: 1,
        marginRight: 10,
        alignItems: 'flex-start',
    },
    activityTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'right',
    },
    activityDate: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 2,
    },
    activityResultBox: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    activityResultText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4F46E5',
    },

    // الأزرار
    actionButtonsRow: {
        flexDirection: 'row-reverse',
        gap: 10,
        marginTop: 4,
    },
    downloadReportBtn: {
        flex: 1,
        flexDirection: 'row-reverse',
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    downloadBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    contactBtn: {
        flex: 1,
        flexDirection: 'row-reverse',
        backgroundColor: '#EEF2FF',
        borderWidth: 1,
        borderColor: '#C7D2FE',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    contactBtnText: {
        color: '#4F46E5',
        fontSize: 12,
        fontWeight: 'bold',
    },
});