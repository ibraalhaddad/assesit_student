import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  StatusBar,
  ViewToken
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface SlideItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconType: 'material' | 'ionicons';
}

const SLIDES: SlideItem[] = [
  {
    id: '1',
    title: 'مساعد الذكاء الاصطناعي',
    description: 'شروحات فورية ومبسطة لجميع دروسك وإجابات دقيقة على أسئلتك في أي وقت.',
    iconName: 'robot-outline',
    iconType: 'material',
  },
  {
    id: '2',
    title: 'بنك الأسئلة والاختبارات',
    description: 'نماذج امتحانات وزارية مؤتمتة وتدريبات تفاعلية لتضمن تفوقك الدراسي.',
    iconName: 'document-text-outline',
    iconType: 'ionicons',
  },
  {
    id: '3',
    title: 'تتبع تقدمك الدراسي',
    description: 'إحصائيات وتقارير دقيقة تعكس مستوى تحصيلك وتساعدك على تنظيم وقتك.',
    iconName: 'stats-chart-outline',
    iconType: 'ionicons',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // ✅ تثبيت إعدادات الرؤية لمنع خطأ "Changing viewabilityConfig on the fly"
  const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 50 }).current;

  // ✅ تحديد دالة تتبع الشريحة الحالية بشكل ثابت
  const onViewableItemsChangedRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // ✅ الانتقال للشريحة التالية أو صفحة التسجيل
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/login'); 
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* الشريط العلوي - زر التخطي */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>تخطي</Text>
        </TouchableOpacity>
      </View>

      {/* قائمة الشرائح */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChangedRef}
        viewabilityConfig={viewabilityConfigRef}
        // ✅ إضافة قياسات العناصر لضمان سلاسة التنقل بزر "التالي"
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconCircle}>
              {item.iconType === 'material' ? (
                <MaterialCommunityIcons name={item.iconName as any} size={70} color="#4F46E5" />
              ) : (
                <Ionicons name={item.iconName as any} size={70} color="#4F46E5" />
              )}
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        )}
      />

      {/* الجزء السفلي - المؤشرات وزر المتابعة */}
      <View style={styles.footer}>
        {/* مؤشر النقاط */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* زر التالي / بدء الاستخدام */}
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'بدء الاستخدام' : 'التالي'}
          </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#4F46E5',
  },
  nextButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});