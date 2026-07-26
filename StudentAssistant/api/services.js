import apiClient from './client';

// 1. فحص الاتصال بقاعدة البيانات
export const testDatabaseConnection = async () => {
  const response = await apiClient.get('/test-db');
  return response.data;
};

// 2. إدخال درس جديد إلى قاعدة البيانات (تم التعديل لاستقبال الإرسال كاملاً)
export const addLessonData = async (payload) => {
  const response = await apiClient.post('/lessons', payload);
  return response.data;
};

// 3. جلب جميع الدروس المحفوظة
export const getLessons = async () => {
  const response = await apiClient.get('/lessons');
  return response.data;
};

// 4. طلب تلخيص أو اختبار من الـ AI (مع إرسال رقم الدرس والمزود والموديل المختار)
export const requestAiAction = async (lessonId, lessonText, actionType, aiProvider, aiModel, level = 'جامعي') => {
  const response = await apiClient.post('/generate', {
    lessonId: lessonId || null,
    lesson: lessonText,
    type: actionType, // 'summary' or 'quiz'
    aiProvider: aiProvider, // المزود المختار (Groq, Gemini, إلخ)
    aiModel: aiModel,       // 🔥 الموديل المختار بالتحديد (مثل gemma2-9b-it)
    level: level
  });
  return response.data;
};

// 5. جلب كل استجابات الـ AI المحفوظة مسبقاً
export const getSavedAiResponses = async () => {
  const response = await apiClient.get('/ai-responses');
  return response.data;
};