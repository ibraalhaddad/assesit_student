import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SelectGradeScreen() {
  // حالة لمعرفة البطاقة المحددة
  const [selectedGrade, setSelectedGrade] = useState<'9th' | '12th' | null>(null);

  const handleConfirm = () => {
    if (!selectedGrade) return;
    
    // الانتقال للشاشة التالية (مثل لوحة التحكم الرئيسية)
    // يمكنك حفظ المرحلة المحددة في الـ State Management أو AsyncStorage هنا
    router.push('/home'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* رأس الصفحة */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            activeOpacity={0.7} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-forward" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.title}>اختر المرحلة الدراسية</Text>
          <Text style={styles.subtitle}>
            حدد مرحلتك الحالية لنتمكن من تخصيص المحتوى والملخصات المناسبة لك
          </Text>
        </View>

        {/* قائمة البطاقات (واحدة فوق الأخرى) */}
        <View style={styles.cardsContainer}>
          
          {/* البطاقة الأولى: الصف التاسع */}
          <TouchableOpacity
            style={[
              styles.gradeCard,
              selectedGrade === '9th' && styles.selectedCard
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedGrade('9th')}
          >
            <View style={styles.cardHeader}>
              <View style={[
                styles.iconBox, 
                selectedGrade === '9th' && styles.selectedIconBox
              ]}>
                <MaterialCommunityIcons 
                  name="school-outline" 
                  size={26} 
                  color={selectedGrade === '9th' ? '#FFF' : '#4F46E5'} 
                />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>الشهادة الأساسية</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.gradeTitle}>الصف التاسع</Text>
              <Text style={styles.gradeSub}>
                نماذج بنك الأسئلة، مراجعات امتحانات الوزارة، وملخصات شاملة للمواد.
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={[
                styles.radioButton, 
                selectedGrade === '9th' && styles.radioSelected
              ]}>
                {selectedGrade === '9th' && (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                )}
              </View>
              <Text style={[
                styles.selectText,
                selectedGrade === '9th' && styles.selectedSelectText
              ]}>
                {selectedGrade === '9th' ? 'تم الاختيار' : 'اضغط للاختيار'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* البطاقة الثانية: ثالث ثانوي */}
          <TouchableOpacity
            style={[
              styles.gradeCard,
              selectedGrade === '12th' && styles.selectedCard
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedGrade('12th')}
          >
            <View style={styles.cardHeader}>
              <View style={[
                styles.iconBox, 
                selectedGrade === '12th' && styles.selectedIconBox
              ]}>
                <MaterialCommunityIcons 
                  name="certificate-outline" 
                  size={26} 
                  color={selectedGrade === '12th' ? '#FFF' : '#4F46E5'} 
                />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>الثانوية العامة</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.gradeTitle}>الثالث الثانوي</Text>
              <Text style={styles.gradeSub}>
                اختبارات مؤتمتة، نماذج وزارية سابقة، وشروحات تفاعلية للفرعين العلمي والأدبي.
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={[
                styles.radioButton, 
                selectedGrade === '12th' && styles.radioSelected
              ]}>
                {selectedGrade === '12th' && (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                )}
              </View>
              <Text style={[
                styles.selectText,
                selectedGrade === '12th' && styles.selectedSelectText
              ]}>
                {selectedGrade === '12th' ? 'تم الاختيار' : 'اضغط للاختيار'}
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* زر التأكيد والمتابعة */}
        <TouchableOpacity 
          style={[
            styles.confirmButton, 
            !selectedGrade && styles.disabledButton
          ]} 
          disabled={!selectedGrade}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>متابعة</Text>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 6,
    lineHeight: 20,
  },
  cardsContainer: {
    flex: 1,
    gap: 16,
  },
  gradeCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconBox: {
    backgroundColor: '#4F46E5',
  },
  badge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  cardBody: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  gradeSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  radioSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  selectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  selectedSelectText: {
    color: '#4F46E5',
  },
  confirmButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});