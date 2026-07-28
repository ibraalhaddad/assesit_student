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
import { router, useLocalSearchParams } from 'expo-router';

// 1. هيكل البيانات للوحدات والدروس
interface Lesson {
  id: string;
  title: string;
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

const UNITS_DATA: Unit[] = [
  {
    id: 'u1',
    title: 'الوحدة الأولى: التفاضل وتطبيقاته',
    lessons: [
      { id: 'l1', title: 'الدرس 1: نهايات الدوال الدائرية' },
      { id: 'l2', title: 'الدرس 2: المشتقات العليا' },
      { id: 'l3', title: 'الدرس 3: الاشتقاق الضمني والبارامتري' },
    ],
  },
  {
    id: 'u2',
    title: 'الوحدة الثانية: التكامل وتطبيقاته',
    lessons: [
      { id: 'l4', title: 'الدرس 1: التكامل غير المحدد' },
      { id: 'l5', title: 'الدرس 2: التكامل بالتجزئة والتعويض' },
      { id: 'l6', title: 'الدرس 3: حساب المساحات والحجوم' },
    ],
  },
];

export default function CustomTestSetupScreen(): React.JSX.Element {
  const params = useLocalSearchParams<{ subjectId?: string; subjectName?: string }>();
  const subjectTitle = params.subjectName || 'المادة';

  // الحالات المختارة
  const [selectedLessons, setSelectedLessons] = useState<string[]>(['l1', 'l2']);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [expandedUnits, setExpandedUnits] = useState<string[]>(['u1', 'u2']);

  // تبديل اختيار درس معين
  const toggleLesson = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  // تحديد/إلغاء تحديد كل دروس وحدة
  const toggleUnitAll = (unit: Unit) => {
    const unitLessonIds = unit.lessons.map((l) => l.id);
    const allSelected = unitLessonIds.every((id) => selectedLessons.includes(id));

    if (allSelected) {
      setSelectedLessons((prev) => prev.filter((id) => !unitLessonIds.includes(id)));
    } else {
      setSelectedLessons((prev) => Array.from(new Set([...prev, ...unitLessonIds])));
    }
  };

  // توسيع/طي الوحدة
  const toggleExpandUnit = (unitId: string) => {
    setExpandedUnits((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  // بدء الاختبار المخصص
  const handleStartExam = () => {
    router.push({
      pathname: '/take-exam' as any,
      params: {
        type: 'custom',
        subjectId: params.subjectId,
        questionCount,
        duration: durationMinutes,
        lessonsCount: selectedLessons.length,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تخصيص اختبار - {subjectTitle}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. إعدادات الاختبار (عدد الأسئلة والوقت) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. إعدادات الأسئلة والوقت</Text>

          <Text style={styles.inputLabel}>عدد الأسئلة:</Text>
          <View style={styles.optionsRow}>
            {[10, 15, 20, 30].map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.chip, questionCount === count && styles.chipSelected]}
                onPress={() => setQuestionCount(count)}
              >
                <Text style={[styles.chipText, questionCount === count && styles.chipTextSelected]}>
                  {count} سؤالاً
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>مدة الاختبار (بالدقائق):</Text>
          <View style={styles.optionsRow}>
            {[10, 20, 30, 45].map((mins) => (
              <TouchableOpacity
                key={mins}
                style={[styles.chip, durationMinutes === mins && styles.chipSelected]}
                onPress={() => setDurationMinutes(mins)}
              >
                <Text style={[styles.chipText, durationMinutes === mins && styles.chipTextSelected]}>
                  {mins} دقيقة
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. اختيار الوحدات والدروس */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>2. تحديد الدروس والوحدات</Text>
            <Text style={styles.selectedCountText}>تم تحديد {selectedLessons.length} دروس</Text>
          </View>

          {UNITS_DATA.map((unit) => {
            const isExpanded = expandedUnits.includes(unit.id);
            const unitLessonIds = unit.lessons.map((l) => l.id);
            const isAllUnitSelected = unitLessonIds.every((id) => selectedLessons.includes(id));

            return (
              <View key={unit.id} style={styles.unitContainer}>
                <View style={styles.unitHeader}>
                  <TouchableOpacity
                    style={styles.unitHeaderLeft}
                    onPress={() => toggleExpandUnit(unit.id)}
                  >
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#64748B"
                    />
                    <Text style={styles.unitTitle}>{unit.title}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.selectAllBtn}
                    onPress={() => toggleUnitAll(unit)}
                  >
                    <Ionicons
                      name={isAllUnitSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isAllUnitSelected ? '#4F46E5' : '#94A3B8'}
                    />
                    <Text style={styles.selectAllText}>الكل</Text>
                  </TouchableOpacity>
                </View>

                {/* قوائم الدروس داخل الوحدة */}
                {isExpanded && (
                  <View style={styles.lessonsList}>
                    {unit.lessons.map((lesson) => {
                      const isSelected = selectedLessons.includes(lesson.id);
                      return (
                        <TouchableOpacity
                          key={lesson.id}
                          style={styles.lessonItem}
                          activeOpacity={0.7}
                          onPress={() => toggleLesson(lesson.id)}
                        >
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={isSelected ? '#4F46E5' : '#CBD5E1'}
                          />
                          <Text style={[styles.lessonTitle, isSelected && styles.lessonTitleSelected]}>
                            {lesson.title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* زر بدء الاختبار الثابت في الأسفل */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButton, selectedLessons.length === 0 && styles.disabledButton]}
          disabled={selectedLessons.length === 0}
          activeOpacity={0.85}
          onPress={handleStartExam}
        >
          <Ionicons name="play-outline" size={20} color="#FFF" />
          <Text style={styles.primaryButtonText}>ابدأ الاختبار المخصص الآن</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', textAlign: 'right' },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedCountText: { fontSize: 12, color: '#4F46E5', fontWeight: '600' },
  inputLabel: { fontSize: 13, color: '#64748B', marginTop: 10, marginBottom: 8, textAlign: 'right' },
  optionsRow: { flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  chipSelected: { backgroundColor: '#4F46E5' },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  chipTextSelected: { color: '#FFF' },
  unitContainer: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  unitHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
    padding: 12,
  },
  unitHeaderLeft: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, flex: 1 },
  unitTitle: { fontSize: 13, fontWeight: 'bold', color: '#334155' },
  selectAllBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  selectAllText: { fontSize: 12, color: '#64748B' },
  lessonsList: { padding: 10, backgroundColor: '#FFF', gap: 8 },
  lessonItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  lessonTitle: { fontSize: 13, color: '#475569' },
  lessonTitleSelected: { color: '#0F172A', fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  primaryButton: {
    flexDirection: 'row-reverse',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: { backgroundColor: '#94A3B8' },
  primaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});