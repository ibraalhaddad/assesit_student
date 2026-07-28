import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen(): React.JSX.Element {
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

        <Text style={styles.headerTitle}>الملف الشخصي</Text>

        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- 2. كارت الصورة الشخصية والمعلومات الأساسية --- */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>أحمد محمد علي</Text>
          <Text style={styles.userGrade}>الصف الثالث الثانوي — الفرع العلمي</Text>
          <Text style={styles.userSchool}>ثانوية النموذجية المتميزة 🏫</Text>

          {/* ملخص الإحصائيات السريع في ملف التلميذ */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7 أيام 🔥</Text>
              <Text style={styles.statLabel}>سلسلة الالتزام</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>المستوى 5 🏅</Text>
              <Text style={styles.statLabel}>المستوى الحالي</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>750 XP 💎</Text>
              <Text style={styles.statLabel}>نقاط الخبرة</Text>
            </View>
          </View>
        </View>

        {/* --- 3. قسم الوصول السريع للمميزات --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نشاطي الأكاديمي</Text>

          <View style={styles.menuGroup}>
            <MenuItem
              icon="analytics-outline"
              iconBg="#EEF2FF"
              iconColor="#4F46E5"
              title="الإحصائيات والأداء"
              subtitle="متابعة ساعات الدراسة ومستوى المواد"
              onPress={() => router.push('/statistics')}
            />

            <MenuItem
              icon="trophy-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="الإنجازات والأوسمة"
              subtitle="الأوسمة المكتسبة ونقاط الـ XP"
              onPress={() => router.push('/achievements')}
            />

            <MenuItem
              icon="document-text-outline"
              iconBg="#DCFCE7"
              iconColor="#16A34A"
              title="الملاحظات والملخصات"
              subtitle="ملاحظاتك المثبتة ملخصة ومجهزة"
              onPress={() => router.push('/notes')}
            />

            <MenuItem
              icon="people-outline"
              iconBg="#E0F2FE"
              iconColor="#0284C7"
              title="مجتمع علاّم"
              subtitle="مجموعات المذاكرة والدردشة العامة"
              onPress={() => router.push('/community')}
              isLast
            />
          </View>
        </View>

        {/* --- 4. قسم إعدادات الحساب السريعة --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إعدادات الملف</Text>

          <View style={styles.menuGroup}>
            <MenuItem
              icon="person-outline"
              iconBg="#F1F5F9"
              iconColor="#475569"
              title="تعديل البيانات الشخصية"
              subtitle="الاسم، المرحلة الدراسية، والفرع"
              onPress={() => {}}
            />

            <MenuItem
              icon="settings-outline"
              iconBg="#F1F5F9"
              iconColor="#475569"
              title="إعدادات التطبيق والتنبيهات"
              subtitle="التنبيهات، المظهر، ولغة التطبيق"
              onPress={() => router.push('/settings')}
              isLast
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// مكون عنصر القائمة (Reusable MenuItem)
function MenuItem({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onPress,
  isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.menuRight}>
        <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.menuTextGroup}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
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

  // كارت المستخدم
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#EEF2FF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userGrade: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  userSchool: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  // الأقسام والروابط
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
  menuGroup: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextGroup: {
    flex: 1,
    alignItems: 'flex-start',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
});