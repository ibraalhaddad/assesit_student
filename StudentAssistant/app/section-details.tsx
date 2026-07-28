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

// 1. تعريف أنواع التبويبات
type TabType = 'explanation' | 'quiz' | 'ai_assistant';

export default function SectionDetailsScreen(): React.JSX.Element {
  // حالة التبويب النشط
  const [activeTab, setActiveTab] = useState<TabType>('explanation');

  // حالة تجريبية لاختيار إجابة الاختبار
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* --- 1. الشريط العلوي (Header) --- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-forward" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>حل المعادلات الخطية</Text>
          <Text style={styles.headerSubtitle}>الدرس 1 • الوحدة الأولى</Text>
        </View>

        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* --- 2. حاوية مشغل الفيديو (Video Player Area) --- */}
        <View style={styles.videoContainer}>
          {/* صورة مصغرة / خلفية الفيديو */}
          <View style={styles.videoPlaceholder}>
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
              <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* شريط معلومات الفيديو الإضافي */}
            <View style={styles.videoOverlayInfo}>
              <Text style={styles.videoTimeText}>12:45 / 15:00</Text>
              <View style={styles.videoBadge}>
                <Ionicons name="sparkles" size={12} color="#FFF" />
                <Text style={styles.videoBadgeText}>HD</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- 3. شريط التبويبات الثلاثة (Tabs Bar) --- */}
        <View style={styles.tabBarContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'explanation' && styles.activeTabButton]}
            onPress={() => setActiveTab('explanation')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="book-outline"
              size={18}
              color={activeTab === 'explanation' ? '#4F46E5' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'explanation' && styles.activeTabText]}>
              شرح الفقرة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'quiz' && styles.activeTabButton]}
            onPress={() => setActiveTab('quiz')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="help-circle-outline"
              size={18}
              color={activeTab === 'quiz' ? '#4F46E5' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'quiz' && styles.activeTabText]}>
              اختبار
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ai_assistant' && styles.activeTabButton]}
            onPress={() => setActiveTab('ai_assistant')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={activeTab === 'ai_assistant' ? '#4F46E5' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'ai_assistant' && styles.activeTabText]}>
              مساعد ذكي
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- 4. محتوى التبويبات المتغير --- */}
        <View style={styles.tabContentContainer}>
          {/* نافذة 1: شرح الفقرة */}
          {activeTab === 'explanation' && (
            <View style={styles.contentCard}>
              <Text style={styles.sectionTitle}>أهم المفاهيم الواردة في المقطع:</Text>
              <Text style={styles.paragraphText}>
                المعادلة الخطية هي صياغة رياضية تعبر عن المساواة بين طرفين وتحتوي على متغير من
                الدرجة الأولى (أس 1).
              </Text>

              <View style={styles.keyPointBox}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={styles.keyPointText}>
                  قاعدة النقل: عند نقل حد من طرف إلى آخر تتغير إشارته.
                </Text>
              </View>

              <View style={styles.keyPointBox}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={styles.keyPointText}>
                  هدف الحل: تجميع المتغيرات في طرف والأعداد في الطرف الآخر.
                </Text>
              </View>
            </View>
          )}

          {/* نافذة 2: اختبار سريع */}
          {activeTab === 'quiz' && (
            <View style={styles.contentCard}>
              <View style={styles.quizHeader}>
                <Text style={styles.quizQuestionNum}>سؤال 1 من 3</Text>
                <Text style={styles.quizQuestion}>ما هو حل المعادلة: 2 س + 4 = 10 ؟</Text>
              </View>

              {[
                { id: 1, text: 'س = 3' },
                { id: 2, text: 'س = 2' },
                { id: 3, text: 'س = 5' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.quizOption,
                    selectedAnswer === option.id && styles.quizOptionSelected,
                  ]}
                  onPress={() => setSelectedAnswer(option.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      selectedAnswer === option.id
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={18}
                    color={selectedAnswer === option.id ? '#4F46E5' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.quizOptionText,
                      selectedAnswer === option.id && styles.quizOptionTextSelected,
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* نافذة 3: المساعد الذكي */}
          {activeTab === 'ai_assistant' && (
            <View style={styles.contentCard}>
              <View style={styles.aiHeader}>
                <MaterialCommunityIcons name="robot-happy-outline" size={26} color="#4F46E5" />
                <Text style={styles.aiTitle}>علاّم - المساعد الذكي</Text>
              </View>
              <Text style={styles.aiSubtitle}>
                أنا هنا لمساعدتك في فهم هذه الفقرة! يمكنك اختيار سؤال جاهز أو كتابة سؤالك.
              </Text>

              <View style={styles.aiPromptsContainer}>
                <TouchableOpacity style={styles.promptChip} activeOpacity={0.7}>
                  <Text style={styles.promptChipText}>💡 اشرح لي هذه الفقرة بشكل أسهل</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.promptChip} activeOpacity={0.7}>
                  <Text style={styles.promptChipText}>📝 أعطني مثالاً إضافياً محلولاً</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.promptChip} activeOpacity={0.7}>
                  <Text style={styles.promptChipText}>❓ لماذا غيرنا الإشارة عند النقل؟</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- 5. زر التالي والسابق (Fixed Bottom Navigation) --- */}
      <View style={styles.bottomFooter}>
        {/* زر السابق */}
        <TouchableOpacity
          style={[styles.footerNavBtn, styles.prevBtn]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={18} color="#475569" />
          <Text style={styles.prevBtnText}>الفقرة السابقة</Text>
        </TouchableOpacity>

        {/* زر التالي */}
        <TouchableOpacity
          style={[styles.footerNavBtn, styles.nextBtn]}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>الفقرة التالية</Text>
          <Ionicons name="chevron-back" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 90, // مسافة حتى لا يغطي زر التالي/السابق المحتوى
  },
  videoContainer: {
    width: width,
    height: 210,
    backgroundColor: '#0F172A',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  videoOverlayInfo: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoTimeText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  videoBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabBarContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'space-around',
  },
  tabButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  tabContentContainer: {
    padding: 16,
  },
  contentCard: {
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
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'right',
  },
  paragraphText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 14,
  },
  keyPointBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    gap: 8,
  },
  keyPointText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    textAlign: 'right',
  },
  quizHeader: {
    marginBottom: 14,
  },
  quizQuestionNum: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  quizQuestion: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  quizOption: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 10,
    backgroundColor: '#FFF',
  },
  quizOptionSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  quizOptionText: {
    fontSize: 14,
    color: '#334155',
  },
  quizOptionTextSelected: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  aiHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 14,
  },
  aiPromptsContainer: {
    gap: 8,
  },
  promptChip: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptChipText: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'right',
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  footerNavBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  prevBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  nextBtn: {
    backgroundColor: '#4F46E5',
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});