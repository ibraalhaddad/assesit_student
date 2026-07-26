import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '../../api/client'; // تأكد من مسار ملف الـ client لديك

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // استقبال بيانات الدرس والمزود والموديل الممررة عبر الـ params
  const { lessonId, title, content, aiProvider, aiModel } = params;

  const [messages, setMessages] = useState([
    { 
      id: '1', 
      role: 'assistant', 
      content: `أهلاً بك! أنا مستعد لمساعدتك في فهم درس "${title || 'المختار'}". تفطّل واطرح أي سؤال.` 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputText;
    setInputText('');
    setLoading(true);

    try {
      // إرسال طلب المحادثة إلى الخادم الخلفي
      const response = await apiClient.post('/generate', {
        lessonId: lessonId || null,
        lesson: `محتوى الدرس السياقي:\n${content}\n\nسؤال المستخدم: ${currentQuery}`,
        type: 'chat', // نوع الطلب محادثة
        aiProvider: aiProvider || '',
        aiModel: aiModel || '',
      });

      if (response.data.success) {
        const aiData = response.data.data;
        const aiReply = aiData.chat || aiData.summary || JSON.stringify(aiData);
        
        const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiReply };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('فشل الرد من الخادم');
      }
    } catch (error) {
      const errorMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* شريط علوي بسيط يوضح عنوان الدرس */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← عودة</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title || 'محادثة الذكاء الاصطناعي'}</Text>
      </View>

      {/* قائمة الرسائل */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* مؤشر التحميل عند انتظار رد الـ AI */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>جاري التفكير...</Text>
        </View>
      )}

      {/* شريط إدخال الرسالة */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب سؤالك حول الدرس..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendButtonText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { marginRight: 15 },
  backText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  chatList: { padding: 15, paddingBottom: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginVertical: 6 },
  userBubble: { backgroundColor: '#007bff', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#e2e8f0' },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff', textAlign: 'right' },
  aiText: { color: '#333', textAlign: 'right' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8 },
  loadingText: { marginLeft: 8, color: '#666', fontSize: 13 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100, textAlign: 'right', fontSize: 15 },
  sendButton: { backgroundColor: '#007bff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 8, justifyContent: 'center' },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});