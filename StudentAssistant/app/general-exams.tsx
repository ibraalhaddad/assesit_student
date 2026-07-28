import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. الأنواع (TypeScript Types)
type MainTab = 'subjects' | 'ministerial';
type TestType = 'quick' | 'custom' | 'full';

interface Subject {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  unitsCount: number;
}

interface MinisterialExam {
  id: string;
  subjectId: string;
  subjectName: string;
  year: string;
  session: string; // الدور الأول / الثاني
  questionsCount: number;
  duration: string;
}

// 2. بيانات المواد الدراسية
const SUBJECTS_DATA: Subject[] = [
  { id: 'math', name: 'الرياضيات', icon: 'calculator-outline', color: '#4F46E5', unitsCount: 5 },
  { id: 'arabic', name: 'اللغة العربية', icon: 'book-outline', color: '#059669', unitsCount: 6 },
  { id: 'english', name: 'اللغة الإنجليزية', icon: 'language-outline', color: '#D97706', unitsCount: 4 },
  { id: 'physics', name: 'الفيزياء', icon: 'atom-outline' as any, color: '#2563EB', unitsCount: 4 },
  { id: 'chemistry', name: 'الكيماء', icon: 'flask-outline', color: '#DC2626', unitsCount: 3 },
  { id: 'biology', name: 'الأحياء', icon: 'leaf-outline', color: '#16A34A', unitsCount: 4 },
];

// 3. بيانات الاختبارات الوزارية السابقة
const MINISTERIAL_EXAMS: MinisterialExam[] = [
  { id: 'm1', subjectId: 'math', subjectName: 'الرياضيات', year: '2025', session: 'الدور الأول', questionsCount: 40, duration: '3 ساعات' },
  { id: 'm2', subjectId: 'math', subjectName: 'الرياضيات', year: '2024', session: 'الدور الأول', questionsCount: 40, duration: '3 ساعات' },
  { id: 'm3', subjectId: 'arabic', subjectName: 'اللغة العربية', year: '2025', session: 'الدور الأول', questionsCount: 50, duration: '3 ساعات' },
  { id: 'm4', subjectId: 'physics', subjectName: 'الفيزياء', year: '2024', session: 'الدور الثاني', questionsCount: 35, duration: '2.5 ساعة' },
  { id: 'm5', subjectId: 'english', subjectName: 'اللغة الإنجليزية', year: '2023', session: 'الدور الأول', questionsCount: 40, duration: '2.5 ساعة' },
];

export default function GeneralExamsScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<MainTab>('subjects');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');

  // المادة المختارة حالياً
  const currentSubject = SUBJECTS_DATA.find((s) => s.id === selectedSubjectId) || SUBJECTS_DATA[0];

  // تصفية الامتحانات الوزارية بحسب المادة والسنة
  const filteredMinisterialExams = MINISTERIAL_EXAMS.filter((exam) => {
    const matchSubject = exam.subjectId === selectedSubjectId;
    const matchYear = selectedYearFilter === 'all' || exam.year === selectedYearFilter;
    return matchSubject && matchYear;
  });

  // بدء اختبار محدد
  const handleStartTest = (type: TestType) => {
    if (type === 'custom') {
      // الانتقال لشاشة تخصيص الوحدات والدروس
      router.push({
        pathname: '/custom-test-setup' as any,
        params: { subjectId: currentSubject.id, subjectName: currentSubject.name },
      });
    } else {
      // الانتقال لمباشرة بدء الاختبار
      router.push({
        pathname: '/take-exam' as any,
        params: { type, subjectId: currentSubject.id },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* --- 1. الشريط العلوي (Header) --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>الاختبارات العامة</Text>

        <View style={{ width: 38 }} />
      </View>

      {/* --- 2. التبويبان الأساسيان (المواد / وزارية) --- */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabSegment, activeTab === 'subjects' && styles.activeTabSegment]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('subjects')}
        >
          <Ionicons
            name="grid-outline"
            size={18}
            color={activeTab === 'subjects' ? '#4F46E5' : '#64748B'}
          />
          <Text style={[styles.tabSegmentText, activeTab === 'subjects' && styles.activeTabText]}>
            اختبارات المواد
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabSegment, activeTab === 'ministerial' && styles.activeTabSegment]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('ministerial')}
        >
          <Ionicons
            name="ribbon-outline"
            size={18}
            color={activeTab === 'ministerial' ? '#4F46E5' : '#64748B'}
          />
          <Text style={[styles.tabSegmentText, activeTab === 'ministerial' && styles.activeTabText]}>
            النماذج الوزارية
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- 3. شريط اختيار المادة (مشترك للتبويبين) --- */}
      <View style={styles.subjectSelectorContainer}>
        <Text style={styles.sectionLabel}>اختر المادة الدراسية:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectsScroll}>
          {SUBJECTS_DATA.map((subject) => {
            const isSelected = subject.id === selectedSubjectId;
            return (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectChip,
                  isSelected && { backgroundColor: subject.color, borderColor: subject.color },
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedSubjectId(subject.id)}
              >
                <Ionicons
                  name={subject.icon}
                  size={16}
                  color={isSelected ? '#FFF' : subject.color}
                />
                <Text style={[styles.subjectChipText, isSelected && styles.subjectChipTextSelected]}>
                  {subject.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* --- 4. محتوى التبويبات --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ============= تبويب المواد ============= */}
        {activeTab === 'subjects' && (
          <View style={styles.sectionContainer}>
            <View style={styles.currentSubjectBanner}>
              <View style={[styles.subjectIconBadge, { backgroundColor: `${currentSubject.color}15` }]}>
                <Ionicons name={currentSubject.icon} size={24} color={currentSubject.color} />
              </View>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle}>اختبارات مادة {currentSubject.name}</Text>
                <Text style={styles.bannerSubtitle}>{currentSubject.unitsCount} وحدات دراسية متوفرة</Text>
              </View>
            </View>

            {/* الخيار 1: اختبار سريع */}
            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.85}
              onPress={() => handleStartTest('quick')}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="flash-outline" size={26} color="#4F46E5" />
              </View>
              <View style={styles.optionDetails}>
                <Text style={styles.optionTitle}>اختبار سريع</Text>
                <Text style={styles.optionDesc}>10 أسئلة عشوائية لتقييم مستواك السريع في المادة</Text>
              </View>
              <Ionicons name="chevron-back" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* الخيار 2: اختبار مخصص */}
            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.85}
              onPress={() => handleStartTest('custom')}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="options-outline" size={26} color="#D97706" />
              </View>
              <View style={styles.optionDetails}>
                <View style={styles.badgeRow}>
                  <Text style={styles.optionTitle}>اختبار مخصص</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>موصى به</Text>
                  </View>
                </View>
                <Text style={styles.optionDesc}>تحديد وحدات ودروس معينة للاختبار فيها فقط</Text>
              </View>
              <Ionicons name="chevron-back" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* الخيار 3: اختبار مادة كاملة */}
            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.85}
              onPress={() => handleStartTest('full')}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="trophy-outline" size={26} color="#16A34A" />
              </View>
              <View style={styles.optionDetails}>
                <Text style={styles.optionTitle}>اختبار مادة كاملة</Text>
                <Text style={styles.optionDesc}>اختبار شامل محاكي للامتحان النهائي لجميع الوحدات</Text>
              </View>
              <Ionicons name="chevron-back" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}

        {/* ============= تبويب الوزارية ============= */}
        {activeTab === 'ministerial' && (
          <View style={styles.sectionContainer}>
            {/* فلترة السنوات */}
            <View style={styles.yearsFilterRow}>
              <Text style={styles.filterLabel}>السنة:</Text>
              {['all', '2025', '2024', '2023'].map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearChip,
                    selectedYearFilter === year && styles.yearChipSelected,
                  ]}
                  onPress={() => setSelectedYearFilter(year)}
                >
                  <Text
                    style={[
                      styles.yearChipText,
                      selectedYearFilter === year && styles.yearChipTextSelected,
                    ]}
                  >
                    {year === 'all' ? 'الكل' : year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* قائمة النماذج الوزارية */}
            {filteredMinisterialExams.length > 0 ? (
              filteredMinisterialExams.map((exam) => (
                <View key={exam.id} style={styles.ministerialCard}>
                  <View style={styles.ministerialHeader}>
                    <View style={styles.yearTag}>
                      <Ionicons name="calendar-outline" size={14} color="#4F46E5" />
                      <Text style={styles.yearTagText}>{exam.year} م</Text>
                    </View>
                    <Text style={styles.sessionText}>{exam.session}</Text>
                  </View>

                  <Text style={styles.ministerialTitle}>
                    امتحان نماذج وزارة التربية - {exam.subjectName}
                  </Text>

                  <View style={styles.ministerialMeta}>
                    <View style={styles.metaBadge}>
                      <Ionicons name="help-circle-outline" size={14} color="#64748B" />
                      <Text style={styles.metaBadgeText}>{exam.questionsCount} سؤالاً</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Ionicons name="time-outline" size={14} color="#64748B" />
                      <Text style={styles.metaBadgeText}>{exam.duration}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.startExamBtn}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: '/take-exam' as any,
                        params: { examId: exam.id, type: 'ministerial' },
                      })
                    }
                  >
                    <Ionicons name="play-circle-outline" size={18} color="#FFF" />
                    <Text style={styles.startExamBtnText}>ابدأ النموذج الآن</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>لا تتوفر نماذج وزارية لهذه المادة للسنة المحددة حالياً.</Text>
              </View>
            )}
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
  tabBar: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FFF',
    padding: 6,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabSegment: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  activeTabSegment: {
    backgroundColor: '#EEF2FF',
  },
  tabSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  subjectSelectorContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
    textAlign: 'right',
  },
  subjectsScroll: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingBottom: 4,
  },
  subjectChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  subjectChipText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  subjectChipTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    gap: 14,
  },
  currentSubjectBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  subjectIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  optionIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  recommendedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'right',
  },
  yearsFilterRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  yearChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearChipSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  yearChipText: {
    fontSize: 12,
    color: '#475569',
  },
  yearChipTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  ministerialCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  ministerialHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  yearTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  sessionText: {
    fontSize: 12,
    color: '#64748B',
  },
  ministerialTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  ministerialMeta: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 12,
    color: '#64748B',
  },
  startExamBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  startExamBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});