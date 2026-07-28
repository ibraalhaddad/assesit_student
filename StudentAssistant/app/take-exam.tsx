import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// 1. نموذج السؤال والإجابات
interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  questionText: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

// عينة أسئلة محاكاة
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    questionText: 'ما هي قيمة النهاية: lim (x → 0) [ sin(x) / x ] ؟',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: 'غير معرفة' },
      { id: 'd', text: '∞' },
    ],
    correctOptionId: 'b',
    explanation: 'نهاية sin(x)/x عندما تقترب x من الصفر هي مبرهنة أساسية وتساوي 1.',
  },
  {
    id: 'q2',
    questionText: 'ما هي مشتقة الدالة f(x) = x³ + 5x ؟',
    options: [
      { id: 'a', text: '3x² + 5' },
      { id: 'b', text: 'x² + 5' },
      { id: 'c', text: '3x + 5' },
      { id: 'd', text: '3x²' },
    ],
    correctOptionId: 'a',
    explanation: 'تطبيق قاعدة القوة: مشتقة x³ هي 3x² ومشتقة 5x هي 5.',
  },
  {
    id: 'q3',
    questionText: 'تكامل الدالة ∫ cos(x) dx يساوي:',
    options: [
      { id: 'a', text: '-sin(x) + C' },
      { id: 'b', text: 'sin(x) + C' },
      { id: 'c', text: 'tan(x) + C' },
      { id: 'd', text: '-cos(x) + C' },
    ],
    correctOptionId: 'b',
    explanation: 'تكامل جيب التمام هو جيب الزاوية الموجب sin(x) + C.',
  },
];

export default function TakeExamScreen(): React.JSX.Element {
  const params = useLocalSearchParams<{ type?: string; duration?: string }>();
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(
    params.duration ? parseInt(params.duration, 10) * 60 : 600 // 10 دقائق افتراضياً
  );

  const currentQuestion = SAMPLE_QUESTIONS[currentIndex];
  const totalQuestions = SAMPLE_QUESTIONS.length;

  // المؤقت التنازلي
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  // صيغة عرض الوقت (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // إجابة سؤال
  const handleSelectOption = (optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  // إنهاء الاختبار
  const finishExam = () => {
    setIsFinished(true);
  };

  // تأكيد الخروج
  const handleConfirmExit = () => {
    Alert.alert('إنهاء الاختبار', 'هل أنت تأكد من إيقاف الاختبار والخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  // حساب النتيجة النهائية
  const calculateScore = () => {
    let correct = 0;
    SAMPLE_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    const percentage = Math.round((correct / totalQuestions) * 100);
    return { correct, percentage };
  };

  // ================= شاشة نتيجة الاختبار =================
  if (isFinished) {
    const { correct, percentage } = calculateScore();
    const isPassed = percentage >= 50;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.resultCard}>
            <View style={[styles.resultBadge, { backgroundColor: isPassed ? '#DCFCE7' : '#FEE2E2' }]}>
              <Ionicons
                name={isPassed ? 'trophy' : 'alert-circle'}
                size={54}
                color={isPassed ? '#16A34A' : '#DC2626'}
              />
            </View>

            <Text style={styles.resultTitle}>{isPassed ? 'مبارك! اجتزت الاختبار' : 'تحتاج لمزيد من المراجعة'}</Text>
            <Text style={styles.resultSubtitle}>
              لقد أجبت على {correct} من أصل {totalQuestions} أسئلة بشكل صحيح
            </Text>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{percentage}%</Text>
              <Text style={styles.scoreSubText}>النتيجة النهائية</Text>
            </View>
          </View>

          {/* مراجعة الإجابات */}
          <Text style={styles.reviewHeaderTitle}>مراجعة الأسئلة والإجابات:</Text>
          {SAMPLE_QUESTIONS.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correctOptionId;

            return (
              <View key={q.id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewQuestionNum}>السؤال {idx + 1}</Text>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={22}
                    color={isCorrect ? '#16A34A' : '#DC2626'}
                  />
                </View>
                <Text style={styles.reviewQuestionText}>{q.questionText}</Text>
                
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationText}>💡 الشرح: {q.explanation}</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.finishBtn} activeOpacity={0.85} onPress={() => router.back()}>
            <Text style={styles.finishBtnText}>العودة لقائمة الاختبارات</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ================= شاشة التفاعل مع السؤال =================
  const selectedOption = userAnswers[currentQuestion.id];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* الهيدر مع المؤقت */}
      <View style={styles.examHeader}>
        <TouchableOpacity style={styles.iconCircle} onPress={handleConfirmExit}>
          <Ionicons name="close" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={18} color="#D97706" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <Text style={styles.questionCounter}>
          {currentIndex + 1} / {totalQuestions}
        </Text>
      </View>

      {/* شريط التقدم */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.examScroll} showsVerticalScrollIndicator={false}>
        {/* نص السؤال */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>السؤال {currentIndex + 1}:</Text>
          <Text style={styles.questionBody}>{currentQuestion.questionText}</Text>
        </View>

        {/* الخيارات */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(option.id)}
              >
                <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                  {isSelected && <View style={styles.optionRadioInner} />}
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* شريط التنقل السفلي في الاختبار */}
      <View style={styles.examBottomNav}>
        {currentIndex > 0 ? (
          <TouchableOpacity
            style={styles.navButtonSecondary}
            onPress={() => setCurrentIndex((prev) => prev - 1)}
          >
            <Ionicons name="arrow-forward" size={18} color="#475569" />
            <Text style={styles.navButtonSecondaryText}>السابق</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {currentIndex < totalQuestions - 1 ? (
          <TouchableOpacity
            style={styles.navButtonPrimary}
            onPress={() => setCurrentIndex((prev) => prev + 1)}
          >
            <Text style={styles.navButtonPrimaryText}>التالي</Text>
            <Ionicons name="arrow-back" size={18} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitExamBtn} onPress={finishExam}>
            <Text style={styles.submitExamBtnText}>تسليم الاختبار</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  timerText: { fontSize: 14, fontWeight: 'bold', color: '#D97706' },
  questionCounter: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
  progressBarBackground: { height: 4, backgroundColor: '#E2E8F0', width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5' },
  examScroll: { padding: 16, paddingBottom: 100 },
  questionCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  questionTitle: { fontSize: 13, fontWeight: 'bold', color: '#4F46E5', textAlign: 'right' },
  questionBody: { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginTop: 8, textAlign: 'right', lineHeight: 26 },
  optionsContainer: { gap: 12 },
  optionCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  optionCardSelected: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: { borderColor: '#4F46E5' },
  optionRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4F46E5' },
  optionText: { fontSize: 15, color: '#334155', flex: 1, textAlign: 'right' },
  optionTextSelected: { color: '#4F46E5', fontWeight: 'bold' },
  examBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButtonPrimary: {
    flexDirection: 'row-reverse',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  navButtonPrimaryText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  navButtonSecondary: {
    flexDirection: 'row-reverse',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  navButtonSecondaryText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  submitExamBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitExamBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  
  // شاشة النتيجة
  resultScroll: { padding: 20, paddingBottom: 40 },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  resultBadge: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', textAlign: 'center' },
  resultSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4, textAlign: 'center' },
  scoreCircle: { marginTop: 20, alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 16 },
  scoreText: { fontSize: 32, fontWeight: 'bold', color: '#4F46E5' },
  scoreSubText: { fontSize: 12, color: '#64748B' },
  reviewHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, textAlign: 'right' },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  reviewCardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6 },
  reviewQuestionNum: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  reviewQuestionText: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', textAlign: 'right', marginBottom: 8 },
  explanationBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8 },
  explanationText: { fontSize: 12, color: '#475569', textAlign: 'right' },
  finishBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  finishBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});