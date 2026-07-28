import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. بيانات وهمية مرنة (Mock Data)
const STUDY_PROGRESS = [
  { id: '1', title: 'الرياضيات', percentage: 80 },
  { id: '2', title: 'English', percentage: 75 },
  { id: '3', title: 'الفيزياء', percentage: 60 },
  { id: '4', title: 'الأحياء', percentage: 90 },
];

const UPCOMING_TASKS = [
  { id: '1', title: 'تسليم مشروع البرمجيات', time: 'غداً، 10:00 ص' },
  { id: '2', title: 'اختبار قصير للشبكات', time: 'بعد غدٍ' },
];

export default function HomeScreen() {
  // حالة التحكم في فتح وإغلاق القائمة الجانبية
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* الشريط العلوي مع شعار "علاّم" */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.push('/')}>
          <Ionicons name="person-outline" size={20} color="#4F46E5" />
        </TouchableOpacity>

        <View style={styles.headerBrand}>
          <View style={styles.brandIconBox}>
            <Ionicons name="school" size={16} color="#FFF" />
          </View>
          <Text style={styles.headerTitleText}>علاّم</Text>
        </View>

        {/* زر فتح القائمة الجانبية */}
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={toggleSidebar}>
          <Ionicons name="menu" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* المحتوى الرئيسي */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>لوحة التحكم (Dashboard)</Text>

        {/* قسم التقدم والمهام السريعة */}
        <View style={styles.row}>
          {/* بطاقة نسب التقدم الديناميكية */}
          <View style={[styles.card, { flex: 1.4 }]}>
            <Text style={styles.cardTitleSmall}>معدل التقدم الدراسي</Text>
            {STUDY_PROGRESS.map((item) => (
              <View key={item.id} style={styles.progressItem}>
                <View style={styles.progressInfoRow}>
                  <Text style={styles.progressVal}>{item.percentage}%</Text>
                  <Text style={styles.progressLabel}>{item.title}</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                </View>
              </View>
            ))}
          </View>

          {/* أزرار الإجراءات السريعة */}
          <View style={{ flex: 1, gap: 10, justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.smallActionCard} activeOpacity={0.8}>
              <View style={styles.actionIconBox}>
                <Ionicons name="calendar-outline" size={18} color="#4F46E5" />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>المهام القادمة</Text>
                <Text style={styles.actionSub}>{UPCOMING_TASKS.length} مهام معلقة</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallActionCard} activeOpacity={0.8}>
              <View style={styles.actionIconBox}>
                <Ionicons name="notifications-outline" size={18} color="#4F46E5" />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>الإشعارات</Text>
                <Text style={styles.actionSub}>تحديثات جديدة</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* قسم الرسوم البيانية الإحصائية */}
        <View style={styles.row}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.cardTitleSmall}>ساعات الدراسة (Study Hours)</Text>
            <View style={styles.fakeChartBox}>
              <Ionicons name="analytics" size={38} color="#4F46E5" />
              <Text style={styles.chartMainVal}>18.5 ساعة</Text>
              <Text style={styles.chartSub}>هذا الأسبوع</Text>
            </View>
          </View>

          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.cardTitleSmall}>تقييم المحتوى (Content)</Text>
            <View style={styles.fakeChartBox}>
              <Ionicons name="pie-chart-outline" size={38} color="#10B981" />
              <Text style={styles.chartMainVal}>ممتاز</Text>
              <Text style={styles.chartSub}>بناءً على تفاعلك</Text>
            </View>
          </View>
        </View>

        {/* بطاقة دردشة الذكاء الاصطناعي المميزة */}
        <TouchableOpacity style={styles.aiBannerCard} activeOpacity={0.9} onPress={() => router.push('/chat')}>
          <View style={styles.aiIconCircle}>
            <MaterialCommunityIcons name="robot-outline" size={26} color="#FFF" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>مساعد الذكاء الاصطناعي (علاّم)</Text>
            <Text style={styles.aiSubtitle}>اسأل عن أي درس واحصل على شرح فوري مبسط</Text>
          </View>
          <Ionicons name="chevron-back" size={20} color="#4F46E5" />
        </TouchableOpacity>

        {/* ــــــــــــــــــــــــ الأيقونات السريعة الجديدة (مواد، اختبار، خطة...) ــــــــــــــــــــــــ */}
        <View style={styles.quickServicesContainer}>
          <Text style={styles.sectionHeading}>الخدمات السريعة</Text>
          <View style={styles.quickServicesGrid}>
            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/selecttermsubject')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="book-outline" size={22} color="#4F46E5" />
              </View>
              <Text style={styles.quickServiceText}>المواد</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/general-exams')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text-outline" size={22} color="#D97706" />
              </View>
              <Text style={styles.quickServiceText}>اختبار</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/study-plan')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="calendar-outline" size={22} color="#059669" />
              </View>
              <Text style={styles.quickServiceText}>خطة</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/statistics')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="journal-outline" size={22} color="#9333EA" />
              </View>
              <Text style={styles.quickServiceText}>احصائيات</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.quickServicesGrid}>
            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/notes')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="book-outline" size={22} color="#4F46E5" />
              </View>
              <Text style={styles.quickServiceText}>الملاحظات</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/community')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text-outline" size={22} color="#D97706" />
              </View>
              <Text style={styles.quickServiceText}>المجنمع</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/settings')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="calendar-outline" size={22} color="#059669" />
              </View>
              <Text style={styles.quickServiceText}>الإعدادات</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.quickServiceItem}
              activeOpacity={0.8}
              onPress={() => router.push('/achievements')}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="journal-outline" size={22} color="#9333EA" />
              </View>
              <Text style={styles.quickServiceText}>انجازات</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* شريط التنقل السفلي المخصص */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/add')}>
          <Ionicons name="book-outline" size={22} color="#64748B" />
          <Text style={styles.navText}>مساحة دراسة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/savedlessons')}>
          <Ionicons name="documents-outline" size={22} color="#64748B" />
          <Text style={styles.navText}>كتب الفصل</Text>
        </TouchableOpacity>

        {/* الأيقونة البارزة في المنتصف (الرئيسية) */}
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.9} onPress={() => router.push('/aiResponse')}>
            <Ionicons name="home" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/chat')} >
          <Ionicons name="chatbubbles-outline" size={22} color="#64748B" />
          <Text style={styles.navText}>الذكاء الاصطناعي</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={22} color="#64748B" />
          <Text style={styles.navText}>حسابي</Text>
        </TouchableOpacity>
      </View>

      {/* ــــــــــــــــــــــــ القائمة الجانبية (Sidebar / Drawer Modal) ــــــــــــــــــــــــ */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSidebarVisible}
        onRequestClose={toggleSidebar}
      >
        <View style={styles.modalOverlay}>
          {/* مساحة النقر لإغلاق القائمة */}
          <Pressable style={styles.modalBackdrop} onPress={toggleSidebar} />

          {/* محتوى القائمة الجانبية */}
          <View style={styles.sidebarContainer}>
            {/* رأس القائمة الجانبية */}
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarProfileInfo}>
                <Text style={styles.sidebarUserName}>محمد أحمد</Text>
                <Text style={styles.sidebarUserEmail}>mohamed@example.com</Text>
              </View>
              <View style={styles.sidebarAvatarBox}>
                <Ionicons name="person" size={24} color="#4F46E5" />
              </View>
            </View>

            {/* روابط القائمة */}
            <ScrollView contentContainerStyle={styles.sidebarLinksList}>
              <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={16} color="#94A3B8" />
                <View style={styles.sidebarItemTextGroup}>
                  <Text style={styles.sidebarItemText}>الرئيسية</Text>
                  <Ionicons name="home-outline" size={20} color="#4F46E5" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={16} color="#94A3B8" />
                <View style={styles.sidebarItemTextGroup}>
                  <Text style={styles.sidebarItemText}>الملف الشخصي</Text>
                  <Ionicons name="person-outline" size={20} color="#4F46E5" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={16} color="#94A3B8" />
                <View style={styles.sidebarItemTextGroup}>
                  <Text style={styles.sidebarItemText}>المواد الدراسية</Text>
                  <Ionicons name="book-outline" size={20} color="#4F46E5" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={16} color="#94A3B8" />
                <View style={styles.sidebarItemTextGroup}>
                  <Text style={styles.sidebarItemText}>الإحصائيات والتقارير</Text>
                  <Ionicons name="stats-chart-outline" size={20} color="#4F46E5" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={16} color="#94A3B8" />
                <View style={styles.sidebarItemTextGroup}>
                  <Text style={styles.sidebarItemText}>الإعدادات</Text>
                  <Ionicons name="settings-outline" size={20} color="#4F46E5" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={16} color="#94A3B8" />
                <View style={styles.sidebarItemTextGroup}>
                  <Text style={styles.sidebarItemText}>المساعدة والدعم</Text>
                  <Ionicons name="help-circle-outline" size={20} color="#4F46E5" />
                </View>
              </TouchableOpacity>
            </ScrollView>

            {/* زر تسجيل الخروج في أسفل القائمة */}
            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={() => { toggleSidebar(); router.push('/login'); }}>
                <Text style={styles.logoutText}>تسجيل الخروج</Text>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scrollContainer: { padding: 16, paddingBottom: 90 },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: '#64748B', marginBottom: 12, marginTop: 12, textAlign: 'right' },
  row: { flexDirection: 'row-reverse', gap: 12, marginBottom: 12 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  progressItem: { marginBottom: 10 },
  progressInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: '#334155' },
  progressVal: { fontSize: 12, fontWeight: 'bold', color: '#4F46E5' },
  barBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  smallActionCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flex: 1,
    gap: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  actionIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  actionTextBox: { flex: 1, alignItems: 'flex-end' },
  actionTitle: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },
  actionSub: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  cardTitleSmall: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 10, textAlign: 'right' },
  fakeChartBox: { height: 95, alignItems: 'center', justifyContent: 'center' },
  chartMainVal: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
  chartSub: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  aiBannerCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginTop: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  aiTextContainer: { flex: 1, alignItems: 'flex-end', marginHorizontal: 12 },
  aiTitle: { fontSize: 14, fontWeight: 'bold', color: '#312E81', textAlign: 'right' },
  aiSubtitle: { fontSize: 11, color: '#4338CA', textAlign: 'right', marginTop: 2 },
  aiIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },

  /* التنسيقات الخاصة بالأيقونات السريعة الجديدة */
  quickServicesContainer: {
    marginTop: 8,
  },
  quickServicesGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickServiceItem: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  quickServiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickServiceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
  },

  bottomNav: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 10,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '600'
  },
  fabContainer: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  sidebarContainer: {
    width: '75%',
    maxWidth: 300,
    backgroundColor: '#FFF',
    height: '100%',
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  sidebarHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  sidebarAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarProfileInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sidebarUserName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sidebarUserEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sidebarLinksList: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  sidebarItemTextGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  sidebarItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});