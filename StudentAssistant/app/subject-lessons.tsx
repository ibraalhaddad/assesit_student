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

// 1. أنواع البيانات
interface Lesson {
  id: string;
  title: string;
  duration: string;
  partsCount: number;
  status: 'completed' | 'in_progress' | 'locked';
  progressPercent?: number;
}

interface Unit {
  id: string;
  unitNumber: string;
  title: string;
  lessons: Lesson[];
}

// 2. بيانات وهمية للوحدات والدروس
const UNITS_DATA: Unit[] = [
  {
    id: 'u1',
    unitNumber: 'الوحدة الأولى',
    title: 'الجبر والمعادلات الخطية',
    lessons: [
      {
        id: 'l1',
        title: 'الدرس 1: حل المعادلات من الدرجة الأولى',
        duration: '15 دقيقة',
        partsCount: 3,
        status: 'completed',
      },
      {
        id: 'l2',
        title: 'الدرس 2: المتباينات الجبرية وخواصها',
        duration: '20 دقيقة',
        partsCount: 4,
        status: 'in_progress',
        progressPercent: 60,
      },
      {
        id: 'l3',
        title: 'الدرس 3: الأنظمة الخطية بمتغيرين',
        duration: '25 دقيقة',
        partsCount: 5,
        status: 'locked',
      },
    ],
  },
  {
    id: 'u2',
    unitNumber: 'الوحدة الثانية',
    title: 'الهندسة والقياس',
    lessons: [
      {
        id: 'l4',
        title: 'الدرس 1: نظرية فيثاغورس وتطبيقاتها',
        duration: '18 دقيقة',
        partsCount: 3,
        status: 'locked',
      },
      {
        id: 'l5',
        title: 'الدرس 2: حساب أطوال الأضلاع والمساحات',
        duration: '22 دقيقة',
        partsCount: 4,
        status: 'locked',
      },
    ],
  },
];

export default function SubjectLessonsScreen() {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  // حساب نسبة إنجاز المادة الإجمالية
  const totalLessons = UNITS_DATA.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedLessons = UNITS_DATA.reduce(
    (acc, u) => acc + u.lessons.filter((l) => l.status === 'completed').length,
    0
  );
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.status === 'locked') return;
    // الانتقال لصفحة تفاصيل الدرس
    router.push('/lessonparts');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* الشريط العلوي */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-forward" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>مادة الرياضيات</Text>
          <Text style={styles.headerSubtitle}>الفصل الدراسي الأول</Text>
        </View>

        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* بطاقة ملخص تقدم المادة */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>{overallProgress}% مكتمل</Text>
            </View>
            <Text style={styles.progressTitle}>إنجازك في المادة</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
          </View>

          <Text style={styles.progressSub}>
            أنهيت {completedLessons} من أصل {totalLessons} دروس
          </Text>
        </View>

        {/* عرض الوحدات والدروس */}
        {UNITS_DATA.map((unit) => (
          <View key={unit.id} style={styles.unitSection}>
            {/* عنوان الوحدة */}
            <View style={styles.unitHeader}>
              <View style={styles.unitBadge}>
                <Text style={styles.unitBadgeText}>{unit.unitNumber}</Text>
              </View>
              <Text style={styles.unitTitle}>{unit.title}</Text>
            </View>

            {/* قائمة دروس الوحدة */}
            <View style={styles.lessonsList}>
              {unit.lessons.map((lesson) => {
                const isLocked = lesson.status === 'locked';

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
                    activeOpacity={isLocked ? 1 : 0.8}
                    onPress={() => handleLessonPress(lesson)}
                  >
                    {/* أيقونة الحالة */}
                    <View
                      style={[
                        styles.statusIconBox,
                        lesson.status === 'completed' && { backgroundColor: '#DCFCE7' },
                        lesson.status === 'in_progress' && { backgroundColor: '#EEF2FF' },
                        lesson.status === 'locked' && { backgroundColor: '#F1F5F9' },
                      ]}
                    >
                      {lesson.status === 'completed' && (
                        <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                      )}
                      {lesson.status === 'in_progress' && (
                        <Ionicons name="play-circle" size={24} color="#4F46E5" />
                      )}
                      {lesson.status === 'locked' && (
                        <Ionicons name="lock-closed" size={20} color="#94A3B8" />
                      )}
                    </View>

                    {/* تفاصيل الدرس */}
                    <View style={styles.lessonDetails}>
                      <Text
                        style={[styles.lessonTitle, isLocked && styles.textMuted]}
                        numberOfLines={1}
                      >
                        {lesson.title}
                      </Text>

                      <View style={styles.lessonMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={13} color="#64748B" />
                          <Text style={styles.metaText}>{lesson.duration}</Text>
                        </View>
                        <Text style={styles.dotSeparator}>•</Text>
                        <View style={styles.metaItem}>
                          <Ionicons name="document-text-outline" size={13} color="#64748B" />
                          <Text style={styles.metaText}>{lesson.partsCount} أجزاء</Text>
                        </View>
                      </View>

                      {/* شريط تقدم فرعي للدرس الذي هو قيد الدراسة */}
                      {lesson.status === 'in_progress' && lesson.progressPercent && (
                        <View style={styles.lessonProgressBarBg}>
                          <View
                            style={[
                              styles.lessonProgressBarFill,
                              { width: `${lesson.progressPercent}%` },
                            ]}
                          />
                        </View>
                      )}
                    </View>

                    {/* زر السهم */}
                    {!isLocked && (
                      <Ionicons name="chevron-back" size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  badgeBox: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
  },
  unitSection: {
    marginBottom: 24,
  },
  unitHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  unitBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unitBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  lessonsList: {
    gap: 10,
  },
  lessonCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  lessonCardLocked: {
    backgroundColor: '#FAFAFA',
    borderColor: '#F1F5F9',
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  lessonDetails: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'right',
  },
  textMuted: {
    color: '#94A3B8',
  },
  lessonMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  lessonProgressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#EEF2FF',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  lessonProgressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
});