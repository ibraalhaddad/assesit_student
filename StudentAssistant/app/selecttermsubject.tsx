import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// أنواع البيانات
type Semester = 'term_1' | 'term_2';

interface Subject {
    id: string;
    name: string;
    iconName: string;
    iconType: 'ionicons' | 'material';
    color: string;
    bgColor: string;
    unitsCount: number;
}

// قائمة المواد الدراسية
const SUBJECTS: Subject[] = [
    {
        id: 'math',
        name: 'الرياضيات',
        iconName: 'calculator-variant-outline',
        iconType: 'material',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        unitsCount: 5,
    },
    {
        id: 'physics',
        name: 'الفيزياء',
        iconName: 'atom',
        iconType: 'material',
        color: '#0891B2',
        bgColor: '#ECFEFF',
        unitsCount: 4,
    },
    {
        id: 'chemistry',
        name: 'الكيمياء',
        iconName: 'flask-outline',
        iconType: 'ionicons',
        color: '#059669',
        bgColor: '#ECFDF5',
        unitsCount: 4,
    },
    {
        id: 'biology',
        name: 'الأحياء',
        iconName: 'dna',
        iconType: 'material',
        color: '#D97706',
        bgColor: '#FFFBEB',
        unitsCount: 3,
    },
    {
        id: 'arabic',
        name: 'اللغة العربية',
        iconName: 'book-open-page-variant-outline',
        iconType: 'material',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        unitsCount: 6,
    },
    {
        id: 'english',
        name: 'اللغة الإنجليزية',
        iconName: 'language',
        iconType: 'ionicons',
        color: '#7C3AED',
        bgColor: '#F5F3FF',
        unitsCount: 5,
    },
    {
        id: 'islamic',
        name: 'التربية الإسلامية',
        iconName: 'book-outline',
        iconType: 'ionicons',
        color: '#16A34A',
        bgColor: '#F0FDF4',
        unitsCount: 4,
    },
];

export default function SelectTermAndSubjectScreen() {
    const [step, setStep] = useState<'semester' | 'subject'>('semester');
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    // عند اختيار الفصل الدراسي
    const handleSelectSemester = (semester: Semester) => {
        setSelectedSemester(semester);
        setStep('subject'); // الانتقال لخطوة اختيار المادة
    };

    // عند اختيار المادة والدخول
    const handleSelectSubject = (subject: Subject) => {
        setSelectedSubject(subject);
        // التوجيه إلى الشاشة الرئيسية للتطبيق
        router.replace('/subject-lessons');
    };

    // العودة لخطوة اختيار الفصل
    const handleBackToSemester = () => {
        setStep('semester');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* الشريط العلوي */}
            <View style={styles.header}>
                {step === 'subject' ? (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToSemester}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-forward" size={22} color="#0F172A" />
                        <Text style={styles.backText}>تغيير الفصل</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ height: 40 }} />
                )}

                {/* شريط التقدم */}
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {step === 'semester' ? 'الخطوة 1 من 2' : 'الخطوة 2 من 2'}
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ===================== الخطوة الأولى: اختيار الفصل الدراسي ===================== */}
                {step === 'semester' && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>اختر الفصل الدراسي</Text>
                        <Text style={styles.subtitle}>
                            حدد الفصل الذي ترغب ببدء المذاكرة ومراجعة دروسه
                        </Text>

                        <View style={styles.cardsGap}>
                            {/* بطاقة الفصل الأول */}
                            <TouchableOpacity
                                style={styles.semesterCard}
                                activeOpacity={0.85}
                                onPress={() => handleSelectSemester('term_1')}
                            >
                                <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                                    <MaterialCommunityIcons name="numeric-1-circle" size={40} color="#4F46E5" />
                                </View>
                                <View style={styles.cardTextContent}>
                                    <Text style={styles.cardTitle}>الفصل الدراسي الأول</Text>
                                    <Text style={styles.cardDescription}>
                                        دروس واختبارات النصف الأول من العام
                                    </Text>
                                </View>
                                <Ionicons name="chevron-back" size={20} color="#94A3B8" />
                            </TouchableOpacity>

                            {/* بطاقة الفصل الثاني */}
                            <TouchableOpacity
                                style={styles.semesterCard}
                                activeOpacity={0.85}
                                onPress={() => handleSelectSemester('term_2')}
                            >
                                <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                                    <MaterialCommunityIcons name="numeric-2-circle" size={40} color="#16A34A" />
                                </View>
                                <View style={styles.cardTextContent}>
                                    <Text style={styles.cardTitle}>الفصل الدراسي الثاني</Text>
                                    <Text style={styles.cardDescription}>
                                        دروس واختبارات النصف الثاني من العام
                                    </Text>
                                </View>
                                <Ionicons name="chevron-back" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* ===================== الخطوة الثانية: اختيار المادة ===================== */}
                {step === 'subject' && (
                    <View style={styles.stepContainer}>
                        <View style={styles.selectedSemesterBanner}>
                            <Ionicons name="checkmark-circle" size={18} color="#4F46E5" />
                            <Text style={styles.bannerText}>
                                تم اختيار: {selectedSemester === 'term_1' ? 'الفصل الدراسي الأول' : 'الفصل الدراسي الثاني'}
                            </Text>
                        </View>

                        <Text style={styles.title}>اختر المادة الدراسية</Text>
                        <Text style={styles.subtitle}>
                            اختر المادة للوصول إلى الملخصات واختبارات الذكاء الاصطناعي
                        </Text>

                        {/* شبكة المواد */}
                        <View style={styles.subjectGrid}>
                            {SUBJECTS.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.subjectCard}
                                    activeOpacity={0.85}
                                    onPress={() => handleSelectSubject(item)}
                                >
                                    <View style={[styles.subjectIconBox, { backgroundColor: item.bgColor }]}>
                                        {item.iconType === 'material' ? (
                                            <MaterialCommunityIcons name={item.iconName as any} size={32} color={item.color} />
                                        ) : (
                                            <Ionicons name={item.iconName as any} size={32} color={item.color} />
                                        )}
                                    </View>
                                    <Text style={styles.subjectName}>{item.name}</Text>
                                    <Text style={styles.unitsCount}>{item.unitsCount} وحدات دراسية</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    backButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    backText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        color: '#4F46E5',
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 30,
    },
    stepContainer: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'right',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'right',
        lineHeight: 22,
        marginBottom: 24,
    },
    cardsGap: {
        gap: 16,
    },
    semesterCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 14,
    },
    cardTextContent: {
        flex: 1,
        alignItems: 'flex-end',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'right',
    },
    selectedSemesterBanner: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    bannerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4F46E5',
    },
    subjectGrid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    subjectCard: {
        width: (width - 52) / 2, // تقسيم الشاشة لعمودين متناسقين
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    subjectIconBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    subjectName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 4,
    },
    unitsCount: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
    },
});