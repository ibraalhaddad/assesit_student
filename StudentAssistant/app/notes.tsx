import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. الأنواع (TypeScript Interfaces)
interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  subject: string;
  color: string;
  isPinned: boolean;
}

// 2. بيانات افتراضية للملاحظات
const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'قوانين الاشتقاق والتكامل المفصلة',
    content: 'تذكر دائماً أن اشتقاق sin(x) هو cos(x)، وقانون ضرب دالتين: الأولى × اشتقاق الثانية + الثانية × اشتقاق الأولى.',
    date: '25 يوليو',
    subject: 'الرياضيات',
    color: '#EEF2FF', // Indigo soft
    isPinned: true,
  },
  {
    id: '2',
    title: 'ملخص الفصل الثالث - الفيزياء الموجية',
    content: 'السعة والتردد والطول الموجي. سرعة الموجة = التردد × الطول الموجي (v = f * λ).',
    date: '22 يوليو',
    subject: 'الفيزياء',
    color: '#FEF3C7', // Amber soft
    isPinned: true,
  },
  {
    id: '3',
    title: 'قواعد النحو: أفعال المقاربة والرجاء',
    content: 'كاد وأوشك يفيدان المقاربة، عسى وحرى يفيدان الرجاء، شرع وأخذ يفيدان الشروع.',
    date: '18 يوليو',
    subject: 'اللغة العربية',
    color: '#DCFCE7', // Green soft
    isPinned: false,
  },
  {
    id: '4',
    title: 'Vocabulary Unit 4 - Technology',
    content: 'Artificial Intelligence, Machine Learning, Data Structures, Algorithms, Cloud Computing.',
    date: '15 يوليو',
    subject: 'اللغة الإنجليزية',
    color: '#FFEDD5', // Orange soft
    isPinned: false,
  },
];

const SUBJECT_FILTERS = ['الكل', 'الرياضيات', 'الفيزياء', 'اللغة العربية', 'اللغة الإنجليزية', 'عامة'];

export default function NotesScreen(): React.JSX.Element {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('الكل');

  // حالة النافذة المنبثقة لإضافة ملاحظة جديدة
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState('الرياضيات');

  // تبديل تثبيت الملاحظة
  const togglePin = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  // حذف ملاحظة
  const deleteNote = (id: string) => {
    Alert.alert('حذف الملاحظة', 'هل أنت تأكد من رغبتك في حذف هذه الملاحظة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => setNotes((prev) => prev.filter((note) => note.id !== id)),
      },
    ]);
  };

  // إضافة ملاحظة جديدة
  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال العنوان ومحتوى الملاحظة.');
      return;
    }

    const colors = ['#EEF2FF', '#FEF3C7', '#DCFCE7', '#FFEDD5', '#F1F5F9'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const createdNote: Note = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      date: 'اليوم',
      subject: newSubject,
      color: randomColor,
      isPinned: false,
    };

    setNotes([createdNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsModalVisible(false);
  };

  // تصفية الملاحظات بناءً على البحث والمادة
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'الكل' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* --- 1. الشريط العلوي --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>الملاحظات والملخصات</Text>

        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- 2. شريط البحث --- */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث في ملاحظاتك وملخصاتك..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* --- 3. فلاتر المواد الدراسية --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {SUBJECT_FILTERS.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.filterChip,
                selectedSubject === subject && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSubject(subject)}
            >
              <Text style={[styles.filterChipText, selectedSubject === subject && styles.filterChipTextActive]}>
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- 4. الملاحظات المثبتة (Pinned Notes) --- */}
        {pinnedNotes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pin" size={16} color="#4F46E5" />
              <Text style={styles.sectionTitle}>الملاحظات المثبتة</Text>
            </View>

            <View style={styles.notesGrid}>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() => togglePin(note.id)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* --- 5. بقية الملاحظات --- */}
        <View style={styles.section}>
          {pinnedNotes.length > 0 && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>جميع الملاحظات</Text>
            </View>
          )}

          {otherNotes.length === 0 && pinnedNotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>لا توجد ملاحظات</Text>
              <Text style={styles.emptySubText}>قم بإضافة ملاحظاتك الأولى لمراجعتها لاحقاً.</Text>
            </View>
          ) : (
            <View style={styles.notesGrid}>
              {otherNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() => togglePin(note.id)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* --- 6. زر إضافة سريع (FAB) --- */}
      <TouchableOpacity style={styles.fabButton} activeOpacity={0.8} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="create-outline" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* --- 7. نافذة إضافة ملاحظة (Modal) --- */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة ملاحظة جديدة</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInputTitle}
              placeholder="عنوان الملاحظة"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={styles.modalInputContent}
              placeholder="اكتب تفاصيل الملاحظة هنا..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={newContent}
              onChangeText={setNewContent}
            />

            <Text style={styles.modalSelectLabel}>اختر المادة الدراسية:</Text>
            <View style={styles.modalSubjectsRow}>
              {SUBJECT_FILTERS.filter((s) => s !== 'الكل').map((subj) => (
                <TouchableOpacity
                  key={subj}
                  style={[
                    styles.miniChip,
                    newSubject === subj && styles.miniChipActive,
                  ]}
                  onPress={() => setNewSubject(subj)}
                >
                  <Text style={[styles.miniChipText, newSubject === subj && styles.miniChipTextActive]}>
                    {subj}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleAddNote}>
              <Text style={styles.saveButtonText}>حفظ الملاحظة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// 8. مكون بطاقة الملاحظة (NoteCard Component)
function NoteCard({
  note,
  onTogglePin,
  onDelete,
}: {
  note: Note;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={[styles.card, { backgroundColor: note.color }]}>
      <View style={styles.cardHeader}>
        <View style={styles.subjectTag}>
          <Text style={styles.subjectTagText}>{note.subject}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity onPress={onTogglePin} style={styles.actionBtn}>
            <Ionicons
              name={note.isPinned ? 'pin' : 'pin-outline'}
              size={18}
              color={note.isPinned ? '#4F46E5' : '#64748B'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.cardTitle}>{note.title}</Text>
      <Text style={styles.cardContent} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>{note.date}</Text>
      </View>
    </View>
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
    paddingBottom: 90,
  },

  // البحث
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'right',
  },

  // الفلاتر
  filterScroll: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // أقسام الملاحظات
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notesGrid: {
    gap: 12,
  },

  // بطاقة الملاحظة
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTag: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  cardContent: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'right',
  },
  cardFooter: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 11,
    color: '#94A3B8',
  },

  // زر الإضافة العائم (FAB)
  fabButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  // الحالة الفارغة
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
  },
  emptySubText: {
    fontSize: 13,
    color: '#94A3B8',
  },

  // النافذة المنبثقة (Modal)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalInputTitle: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalInputContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'right',
    textAlignVertical: 'top',
    height: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSelectLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'right',
  },
  modalSubjectsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  miniChipActive: {
    backgroundColor: '#4F46E5',
  },
  miniChipText: {
    fontSize: 12,
    color: '#64748B',
  },
  miniChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});