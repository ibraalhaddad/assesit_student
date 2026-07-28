import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen(): React.JSX.Element {
  // حالات المفاتيح التفاعلية (Switches)
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiHintsOnly, setAiHintsOnly] = useState(false);

  // إجراء تسجيل الخروج
  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت تأكد من رغبتك في تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تسجيل الخروج',
        style: 'destructive',
        onPress: () => {
          // إضافة منطق تسجيل الخروج هنا
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* --- 1. الشريط العلوي --- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-forward" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>الإعدادات</Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- 2. التنبيهات والإشعارات --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التنبيهات والإشعارات</Text>
          <View style={styles.settingsGroup}>
            <SettingSwitchRow
              icon="notifications-outline"
              title="إشعارات التطبيق"
              subtitle="تنبيهات الامتحانات والرسائل"
              value={notifications}
              onValueChange={setNotifications}
            />
            <SettingSwitchRow
              icon="alarm-outline"
              title="تذكيرات أوقات المذاكرة"
              subtitle="تنبيه يومي لبدء الجلسات الدراسية"
              value={studyReminders}
              onValueChange={setStudyReminders}
              isLast
            />
          </View>
        </View>

        {/* --- 3. تفضيلات الذكاء الاصطناعي (علاّم AI) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مساعد علاّم الذكي 🤖</Text>
          <View style={styles.settingsGroup}>
            <SettingSwitchRow
              icon="bulb-outline"
              title="تقديم تلميحات فقط"
              subtitle="توجيه الذكاء الاصطناعي لإعطاء تلميحات بدل الحل المباشر"
              value={aiHintsOnly}
              onValueChange={setAiHintsOnly}
            />
            <SettingClickRow
              icon="trash-bin-outline"
              title="مسح سجل محادثات علاّم"
              subtitle="حذف كافة الاستفسارات السابقة مع المساعد"
              onPress={() => Alert.alert('تم المسح', 'تم مسح سجل المحادثات بنجاح.')}
              isLast
            />
          </View>
        </View>

        {/* --- 4. تفضيلات التطبيق والمظهر --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المظهر واللغة</Text>
          <View style={styles.settingsGroup}>
            <SettingSwitchRow
              icon="moon-outline"
              title="الوضع الداكن (Dark Mode)"
              subtitle="تغيير ألوان التطبيق إلى المظهر الليلي"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <SettingClickRow
              icon="language-outline"
              title="لغة التطبيق"
              subtitle="العربية (المملكة العربية السعودية)"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* --- 5. الحساب والأمان --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الحساب والأمان</Text>
          <View style={styles.settingsGroup}>
            <SettingClickRow
              icon="key-outline"
              title="تغيير كلمة المرور"
              subtitle="تحديث كلمة المرور الخاصة بحسابك"
              onPress={() => {}}
            />
            <SettingClickRow
              icon="shield-checkmark-outline"
              title="الخصوصية وشروط الاستخدام"
              subtitle="سياسة التعامل مع البيانات والخصوصية"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* --- 6. الدعم وعن التطبيق --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الدعم والدعم الفني</Text>
          <View style={styles.settingsGroup}>
            <SettingClickRow
              icon="help-circle-outline"
              title="مركز المساعدة والأسئلة الشائعة"
              subtitle="إجابات على أكثر الأسئلة شيوعاً"
              onPress={() => {}}
            />
            <SettingClickRow
              icon="information-circle-outline"
              title="عن تطبيق علاّم"
              subtitle="الإصدار 1.0.0 — مساعدك الدراسي الذكي"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* --- 7. زر تسجيل الخروج --- */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>تسجيل الخروج من الحساب</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// مكون السطر الذي يحتوي على زر التبديل (Switch Row)
function SettingSwitchRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.settingRow, !isLast && styles.rowBorder]}>
      <View style={styles.rowRight}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color="#4F46E5" />
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: '#818CF8' }}
        thumbColor={value ? '#4F46E5' : '#F1F5F9'}
      />
    </View>
  );
}

// مكون السطر القابل للنقر (Clickable Row)
function SettingClickRow({
  icon,
  title,
  subtitle,
  onPress,
  isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, !isLast && styles.rowBorder]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.rowRight}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color="#4F46E5" />
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-back" size={18} color="#94A3B8" />
    </TouchableOpacity>
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
    gap: 16,
    paddingBottom: 40,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
  settingsGroup: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  rowSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
  logoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});