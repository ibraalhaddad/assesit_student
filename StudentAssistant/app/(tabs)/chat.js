import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // استقبال بيانات الدرس والمزود والموديل
  const { lessonId, title, content, aiProvider: initialProvider, aiModel: initialModel } = params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // حالات المزود والموديل الخاصة بجلسة الشات الحالية (قابلة للتغيير)
  const [availableModels, setAvailableModels] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(initialProvider || '');
  const [selectedModel, setSelectedModel] = useState(initialModel || '');
  const [showSettings, setShowSettings] = useState(false);

  const flatListRef = useRef(null);
  const storageKey = `chat_session_${lessonId || 'general'}`;

  // 1. جلب النماذج المتاحة وتنزيل جلسة المحادثة المحفوظة سابقاً لهذا الدرس
  useEffect(() => {
    fetchAvailableModels();
    loadSavedSession();
  }, [lessonId]);

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch('http://localhost:3000/ai-models');
      const data = await response.json();
      if (data.success) {
        setAvailableModels(data.models);
      }
    } catch (error) {
      console.error("Failed to fetch AI models:", error);
    }
  };

  const loadSavedSession = async () => {
    try {
      const savedData = await AsyncStorage.getItem(storageKey);
      if (savedData) {
        const parsedMessages = JSON.parse(savedData);
        setMessages(parsedMessages);
      } else {
        // رسالة ترحيبية افتراضية تلقائية عند فتح الدرس لأول مرة
        const initialMsg = {
          id: '1',
          role: 'assistant',
          content: `أهلاً بك! هذه جلسة عمل خاصة بالدرس: "${title || 'المختار'}". أنا جاهز لمساعدتك، تلخيص الأفكار، أو الإجابة على أسئلتك.`
        };
        setMessages([initialMsg]);
        saveSession([initialMsg]);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const saveSession = async (newMessages) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: inputText };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    saveSession(updatedMessages);
    
    const currentQuery = inputText;
    setInputText('');
    setLoading(true);

    try {
      const response = await apiClient.post('/generate', {
        lessonId: lessonId || null,
        lesson: `محتوى الدرس السياقي:\n${content}\n\nسؤال المستخدم: ${currentQuery}`,
        type: 'chat',
        aiProvider: selectedProvider,
        aiModel: selectedModel,
      });

      if (response.data.success) {
        const aiData = response.data.data;
        const aiReply = aiData.chat || aiData.summary || JSON.stringify(aiData);
        
        const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiReply };
        const finalMessages = [...updatedMessages, assistantMessage];
        
        setMessages(finalMessages);
        saveSession(finalMessages);
      } else {
        throw new Error('فشل الرد من الخادم');
      }
    } catch (error) {
      const errorMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي أو نفاد الرصيد.' };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveSession(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  // لوحة تغيير المزود والموديل من داخل صفحة الشات
  const renderSettingsBar = () => {
    const providers = Object.keys(availableModels);
    const modelsForCurrentProvider = selectedProvider ? (availableModels[selectedProvider] || []) : [];

    if (!showSettings) return null;

    return (
      <View style={styles.settingsPanel}>
        <Text style={styles.settingsTitle}>تغيير مزود وموديل الذكاء الاصطناعي للجلسة:</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <TouchableOpacity 
            style={[styles.chip, selectedProvider === '' && styles.activeChip]}
            onPress={() => { setSelectedProvider(''); setSelectedModel(''); }}
          >
            <Text style={[styles.chipText, selectedProvider === '' && styles.activeChipText]}>تلقائي</Text>
          </TouchableOpacity>
          {providers.map((prov, idx) => (
            <TouchableOpacity 
              key={idx}
              style={[styles.chip, selectedProvider === prov && styles.activeChip]}
              onPress={() => { setSelectedProvider(prov); setSelectedModel(''); }}
            >
              <Text style={[styles.chipText, selectedProvider === prov && styles.activeChipText]}>{prov}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedProvider !== '' && modelsForCurrentProvider.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipScroll, { marginTop: 6 }]}>
            <TouchableOpacity 
              style={[styles.chip, selectedModel === '' && styles.activeChip]}
              onPress={() => setSelectedModel('')}
            >
              <Text style={[styles.chipText, selectedModel === '' && styles.activeChipText]}>الموديل الافتراضي</Text>
            </TouchableOpacity>
            {modelsForCurrentProvider.map((mod, idx) => (
              <TouchableOpacity 
                key={idx}
                style={[styles.chip, selectedModel === mod && styles.activeChip]}
                onPress={() => setSelectedModel(mod)}
              >
                <Text style={[styles.chipText, selectedModel === mod && styles.activeChipText]}>{mod}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
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
      {/* شريط علوي */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← عودة</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title || 'محادثة الدرس'}</Text>
          <Text style={styles.headerSubtitle}>
            {selectedProvider ? `المزود: ${selectedProvider} ${selectedModel ? `(${selectedModel})` : ''}` : 'المزود: تلقائي'}
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsToggleBtn} onPress={() => setShowSettings(!showSettings)}>
          <Text style={styles.settingsToggleText}>⚙️ إعدادات AI</Text>
        </TouchableOpacity>
      </View>

      {/* لوحة إعدادات المزود والموديل المتغيرة */}
      {renderSettingsBar()}

      {/* قائمة الرسائل */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>جاري التفكير والتوليد...</Text>
        </View>
      )}

      {/* شريط الإدخال */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالتك أو استفسارك هنا..."
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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { paddingRight: 5 },
  backText: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  headerSubtitle: { fontSize: 11, color: '#666', textAlign: 'right', marginTop: 2 },
  settingsToggleBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  settingsToggleText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  settingsPanel: { backgroundColor: '#fff', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  settingsTitle: { fontSize: 12, fontWeight: 'bold', color: '#555', textAlign: 'right', marginBottom: 6 },
  chipScroll: { flexDirection: 'row' },
  chip: { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, marginHorizontal: 3 },
  activeChip: { backgroundColor: '#007bff' },
  chipText: { fontSize: 11, color: '#333', fontWeight: '600' },
  activeChipText: { color: '#fff' },
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