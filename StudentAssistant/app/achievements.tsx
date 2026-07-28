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
type Category = 'all' | 'study' | 'streak' | 'exams';

interface Achievement {
    id: string;
    title: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap;
    category: 'study' | 'streak' | 'exams';
    isUnlocked: boolean;
    unlockedAt?: string;
    currentProgress?: number;
    maxProgress?: number;
    xpReward: number;
}

// 2. بيانات الأوسمة والإنجازات
const ACHIEVEMENTS_DATA: Achievement[] = [
    {
        id: '1',
        title: 'المستكشف النشط',
        description: 'إكمال أول حلسة دراسية متكاملة',
        iconName: 'compass-outline',
        category: 'study',
        isUnlocked: true,
        unlockedAt: '12 يوليو',
        xpReward: 50,
    },
    {
        id: '2',
        title: 'شعلة الالتزام 🔥',
        description: 'الدراسة لمدة 7 أيام متتالية دون انقطاع',
        iconName: 'flame-outline',
        category: 'streak',
        isUnlocked: true,
        unlockedAt: '20 يوليو',
        xpReward: 150,
    },
    {
        id: '3',
        title: 'عبقري الرياضيات',
        description: 'الحصول على درجة 90%+ في 5 اختبارات رياضيات',
        iconName: 'calculator-outline',
        category: 'exams',
        isUnlocked: false,
        currentProgress: 3,
        maxProgress: 5,
        xpReward: 200,
    },
    {
        id: '4',
        title: 'سيد التركيز ⏱️',
        description: 'إكمال 25 ساعة دراسية إجمالاً',
        iconName: 'timer-outline',
        category: 'study',
        isUnlocked: false,
        currentProgress: 18,
        maxProgress: 25,
        xpReward: 300,
    },
    {
        id: '5',
        title: 'البداية القوية',
        description: 'إضافة جميع المواد الدراسية في جدولك',
        iconName: 'book-outline',
        category: 'study',
        isUnlocked: true,
        unlockedAt: '5 يوليو',
        xpReward: 100,
    },
    {
        id: '6',
        title: 'محارب الامتحانات',
        description: 'إجتياز 10 اختبارات تجريبية بنجاح',
        iconName: 'trophy-outline',
        category: 'exams',
        isUnlocked: false,
        currentProgress: 6,
        maxProgress: 10,
        xpReward: 250,
    },
];

export default function AchievementsScreen(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<Category>('all');

    // تصفية الإنجازات حسب الفئة
    const filteredAchievements = ACHIEVEMENTS_DATA.filter((item) => {
        if (activeTab === 'all') return true;
        return item.category === activeTab;
    });

    const unlockedCount = ACHIEVEMENTS_DATA.filter((item) => item.isUnlocked).length;
    const totalCount = ACHIEVEMENTS_DATA.length;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* --- 1. الشريط العلوي --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
                    <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>الإنجازات والأوسمة</Text>

                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- 2. كارت المستوى والنقاط (Level Card) --- */}
                <View style={styles.levelCard}>
                    <View style={styles.levelHeader}>
                        <View style={styles.levelBadge}>
                            <Ionicons name="ribbon" size={22} color="#FFF" />
                            <Text style={styles.levelText}>المستوى 5</Text>
                        </View>
                        <Text style={styles.rankTitle}>طالب مجتهد 🌟</Text>
                    </View>

                    {/* شريط التقدم للمستوى التالي */}
                    <View style={styles.xpProgressContainer}>
                        <View style={styles.xpMeta}>
                            <Text style={styles.xpText}>750 / 1000 XP</Text>
                            <Text style={styles.xpLabel}>التقدم للمستوى 6</Text>
                        </View>
                        <View style={styles.xpTrack}>
                            <View style={[styles.xpFill, { width: '75%' }]} />
                        </View>
                    </View>

                    {/* إحصائية سريعة للأوسمة */}
                    <View style={styles.levelFooter}>
                        <Text style={styles.footerStatText}>
                            الأوسمة المكتسبة: <Text style={styles.footerHighlight}>{unlockedCount}</Text> من {totalCount}
                        </Text>
                    </View>
                </View>

                {/* --- 3. الفلاتر (Tabs) --- */}
                <View style={styles.tabsContainer}>
                    {[
                        { id: 'all', label: 'الكل' },
                        { id: 'study', label: 'الدراسة' },
                        { id: 'streak', label: 'الاستمرارية' },
                        { id: 'exams', label: 'الاختبارات' },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
                            onPress={() => setActiveTab(tab.id as Category)}
                        >
                            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* --- 4. قائمة الأوسمة --- */}
                <View style={styles.achievementsGrid}>
                    {filteredAchievements.map((item) => {
                        const progressPercent =
                            item.currentProgress && item.maxProgress
                                ? (item.currentProgress / item.maxProgress) * 100
                                : 0;

                        return (
                            <View
                                key={item.id}
                                style={[
                                    styles.achievementCard,
                                    !item.isUnlocked && styles.achievementCardLocked,
                                ]}
                            >
                                {/* الأيقونة */}
                                <View
                                    style={[
                                        styles.badgeIconBox,
                                        item.isUnlocked ? styles.badgeUnlocked : styles.badgeLocked,
                                    ]}
                                >
                                    <Ionicons
                                        name={item.iconName}
                                        size={28}
                                        color={item.isUnlocked ? '#4F46E5' : '#94A3B8'}
                                    />
                                </View>

                                {/* تفاصيل الوسام */}
                                <View style={styles.achievementInfo}>
                                    <View style={styles.titleRow}>
                                        <Text style={[styles.achievementTitle, !item.isUnlocked && styles.textMuted]}>
                                            {item.title}
                                        </Text>
                                        <View style={styles.xpPill}>
                                            <Text style={styles.xpPillText}>+{item.xpReward} XP</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.achievementDesc}>{item.description}</Text>

                                    {/* حالة الوسام: مفتوح أم قيد التقدم */}
                                    {item.isUnlocked ? (
                                        <View style={styles.unlockedMeta}>
                                            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                                            <Text style={styles.unlockedText}>تم الفتح في {item.unlockedAt}</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.progressSection}>
                                            <View style={styles.progressTrack}>
                                                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                                            </View>
                                            <Text style={styles.progressText}>
                                                {item.currentProgress} / {item.maxProgress}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
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
        gap: 18,
        paddingBottom: 40,
    },

    // كارت المستوى
    levelCard: {
        backgroundColor: '#1E1B4B', // indigo داكن لتسليط الضوء
        borderRadius: 20,
        padding: 18,
        gap: 16,
    },
    levelHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#4F46E5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    levelText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
    rankTitle: {
        color: '#E0E7FF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    xpProgressContainer: {
        gap: 8,
    },
    xpMeta: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    xpText: {
        color: '#818CF8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    xpLabel: {
        color: '#94A3B8',
        fontSize: 12,
    },
    xpTrack: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    xpFill: {
        height: '100%',
        backgroundColor: '#818CF8',
        borderRadius: 4,
    },
    levelFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 12,
        alignItems: 'flex-end',
    },
    footerStatText: {
        color: '#94A3B8',
        fontSize: 12,
    },
    footerHighlight: {
        color: '#FFF',
        fontWeight: 'bold',
    },

    // الفلاتر
    tabsContainer: {
        flexDirection: 'row-reverse',
        gap: 8,
    },
    tabBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    tabBtnActive: {
        backgroundColor: '#4F46E5',
    },
    tabText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },

    // شبكة الإنجازات
    achievementsGrid: {
        gap: 12,
    },
    achievementCard: {
        flexDirection: 'row-reverse',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        gap: 12,
    },
    achievementCardLocked: {
        backgroundColor: '#F8FAFC',
        borderColor: '#F1F5F9',
    },
    badgeIconBox: {
        width: 54,
        height: 54,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeUnlocked: {
        backgroundColor: '#EEF2FF',
    },
    badgeLocked: {
        backgroundColor: '#E2E8F0',
    },
    achievementInfo: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    textMuted: {
        color: '#64748B',
    },
    xpPill: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    xpPillText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#D97706',
    },
    achievementDesc: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'right',
    },
    unlockedMeta: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    unlockedText: {
        fontSize: 11,
        color: '#16A34A',
        fontWeight: '500',
    },
    progressSection: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    progressTrack: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: 'bold',
    },
});