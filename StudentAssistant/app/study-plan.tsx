import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. الأنواع (TypeScript Interfaces)
interface Task {
    id: string;
    subject: string;
    topic: string;
    duration: string;
    timeSlot: string;
    color: string;
    completed: boolean;
}

interface DayItem {
    id: string;
    dayName: string;
    dayNum: string;
    isToday?: boolean;
}

// 2. بيانات أيام الأسبوع
const DAYS_DATA: DayItem[] = [
    { id: 'sun', dayName: 'الأحد', dayNum: '10' },
    { id: 'mon', dayName: 'الإثنين', dayNum: '11' },
    { id: 'tue', dayName: 'الثلاثاء', dayNum: '12', isToday: true },
    { id: 'wed', dayName: 'الأربعاء', dayNum: '13' },
    { id: 'thu', dayName: 'الخميس', dayNum: '14' },
    { id: 'fri', dayName: 'الجمعة', dayNum: '15' },
    { id: 'sat', dayName: 'السبت', dayNum: '16' },
];

// 3. بيانات المهام الدراسية لليوم المالي
const INITIAL_TASKS: Task[] = [
    {
        id: 't1',
        subject: 'الرياضيات',
        topic: 'مراجعة درس التفاضل وتطبيقاته + حل 10 تمارين',
        duration: '1.5 ساعة',
        timeSlot: '04:00 م - 05:30 م',
        color: '#4F46E5',
        completed: true,
    },
    {
        id: 't2',
        subject: 'الفيزياء',
        topic: 'قراءة الفصل الثاني: التيار الكهربائي وقوانين كيرشوف',
        duration: '1 ساعة',
        timeSlot: '06:00 م - 07:00 م',
        color: '#2563EB',
        completed: false,
    },
    {
        id: 't3',
        subject: 'اللغة العربية',
        topic: 'حفظ قصيدة أرق على أرق ومراجعة قواعد النحو',
        duration: '45 دقيقة',
        timeSlot: '08:00 م - 08:45 م',
        color: '#059669',
        completed: false,
    },
    {
        id: 't4',
        subject: 'اللغة الإنجليزية',
        topic: 'حل نماذج أسئلة القواعد (Grammar Unit 3)',
        duration: '1 ساعة',
        timeSlot: '09:00 م - 10:00 م',
        color: '#D97706',
        completed: false,
    },
];

export default function StudyPlanScreen(): React.JSX.Element {
    const [selectedDay, setSelectedDay] = useState<string>('tue');
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

    // حالة النافذة المنبثقة لإضافة جلسة دراسية جديدة
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [newSubject, setNewSubject] = useState<string>('');
    const [newTopic, setNewTopic] = useState<string>('');
    const [newDuration, setNewDuration] = useState<string>('');

    // تغيير حالة إنجاز المهمة
    const toggleTaskCompletion = (taskId: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // إضافة مهمة جديدة
    const handleAddTask = () => {
        if (!newSubject.trim() || !newTopic.trim()) {
            Alert.alert('تنبيه', 'يرجى كتابة اسم المادة والموضوع المطلوب دراسته');
            return;
        }

        const newTaskItem: Task = {
            id: Date.now().toString(),
            subject: newSubject,
            topic: newTopic,
            duration: newDuration || '1 ساعة',
            timeSlot: 'محدد لاحقاً',
            color: '#4F46E5',
            completed: false,
        };

        setTasks([...tasks, newTaskItem]);
        setNewSubject('');
        setNewTopic('');
        setNewDuration('');
        setIsModalVisible(false);
    };

    // حساب نسبة الإنجاز اليومية
    const completedCount = tasks.filter((t) => t.completed).length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* --- 1. الشريط العلوي (Header) --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
                    <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>الخطة الدراسية</Text>

                <TouchableOpacity
                    style={styles.addButtonCircle}
                    activeOpacity={0.8}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Ionicons name="add" size={22} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* --- 2. بطاقة الملخص الإنجاز الأسبوعي واليومي --- */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <View style={styles.summaryBadge}>
                            <Ionicons name="calendar-outline" size={16} color="#4F46E5" />
                            <Text style={styles.summaryBadgeText}>خطة هذا الأسبوع</Text>
                        </View>
                        <Text style={styles.percentageText}>{progressPercentage}% مكتمل</Text>
                    </View>

                    {/* شريط التقدم */}
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                    </View>

                    <View style={styles.summaryStatsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#059669" />
                            <Text style={styles.statText}>
                                المهام المنجزة: <Text style={styles.statHighlight}>{completedCount}/{tasks.length}</Text>
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={18} color="#D97706" />
                            <Text style={styles.statText}>
                                المتبقي: <Text style={styles.statHighlight}>{tasks.length - completedCount} جلسات</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {/* --- 3. شريط اختيار الأيام (Days Selector) --- */}
                <View style={styles.daysContainer}>
                    <Text style={styles.sectionTitle}>أيام الأسبوع:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                        {DAYS_DATA.map((item) => {
                            const isSelected = item.id === selectedDay;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.dayChip,
                                        isSelected && styles.dayChipSelected,
                                        item.isToday && !isSelected && styles.dayChipToday,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedDay(item.id)}
                                >
                                    <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>
                                        {item.dayName}
                                    </Text>
                                    <Text style={[styles.dayNum, isSelected && styles.dayTextSelected]}>
                                        {item.dayNum}
                                    </Text>
                                    {item.isToday && <View style={[styles.todayDot, isSelected && { backgroundColor: '#FFF' }]} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* --- 4. قائمة الجلسات الدراسية لليوم --- */}
                <View style={styles.tasksSection}>
                    <View style={styles.tasksHeaderRow}>
                        <Text style={styles.sectionTitle}>جلسات اليوم الدراسية</Text>
                        <Text style={styles.tasksCountText}>{tasks.length} مهام محددة</Text>
                    </View>

                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TouchableOpacity
                                key={task.id}
                                style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
                                activeOpacity={0.85}
                                onPress={() => toggleTaskCompletion(task.id)}
                            >
                                {/* زر خانة الاختيار Checkbox */}
                                <TouchableOpacity
                                    style={styles.checkboxTouch}
                                    onPress={() => toggleTaskCompletion(task.id)}
                                >
                                    <Ionicons
                                        name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={24}
                                        color={task.completed ? '#059669' : '#CBD5E1'}
                                    />
                                </TouchableOpacity>

                                {/* تفاصيل المهمة */}
                                <View style={styles.taskDetails}>
                                    <View style={styles.taskTagRow}>
                                        <View style={[styles.subjectTag, { backgroundColor: `${task.color}15` }]}>
                                            <Text style={[styles.subjectTagText, { color: task.color }]}>{task.subject}</Text>
                                        </View>
                                        <View style={styles.timeTag}>
                                            <Ionicons name="time-outline" size={12} color="#64748B" />
                                            <Text style={styles.timeTagText}>{task.duration}</Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.taskTopicTitle, task.completed && styles.taskTopicCompleted]}>
                                        {task.topic}
                                    </Text>

                                    <Text style={styles.timeSlotText}>⏰ {task.timeSlot}</Text>
                                </View>

                                {/* مؤشر لون المادة */}
                                <View style={[styles.subjectColorBar, { backgroundColor: task.color }]} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="cafe-outline" size={48} color="#CBD5E1" />
                            <Text style={styles.emptyStateText}>لا توجد جلسات دراسية محدودة لهذا اليوم.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* --- 5. النافذة المنبثقة لإضافة جلسة جديدة (Add Task Modal) --- */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>إضافة جلسة دراسية</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close-circle" size={24} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>اسم المادة الدراسية:</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="مثال: الرياضيات، الأحياء..."
                            value={newSubject}
                            onChangeText={setNewSubject}
                            textAlign="right"
                        />

                        <Text style={styles.inputLabel}>الموضوع / الدروس المطلوبة:</Text>
                        <TextInput
                            style={[styles.textInput, { height: 70 }]}
                            placeholder="مثال: قراءة الدرس الأول وحل الواجب..."
                            value={newTopic}
                            onChangeText={setNewTopic}
                            multiline
                            textAlign="right"
                        />

                        <Text style={styles.inputLabel}>المدة المتوقعة:</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="مثال: ساعة ونصف"
                            value={newDuration}
                            onChangeText={setNewDuration}
                            textAlign="right"
                        />

                        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleAddTask}>
                            <Ionicons name="checkmark" size={20} color="#FFF" />
                            <Text style={styles.saveButtonText}>حفظ وتثبيت في الخطة</Text>
                        </TouchableOpacity>
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
    addButtonCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#0F172A' },
    scrollContent: { padding: 16, paddingBottom: 40 },

    // بطاقة الملخص
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    summaryHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    summaryBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#4F46E5' },
    percentageText: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
    progressTrack: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 4 },
    summaryStatsRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingTop: 4,
    },
    statItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    statText: { fontSize: 12, color: '#64748B' },
    statHighlight: { color: '#0F172A', fontWeight: 'bold' },

    // الأيام
    daysContainer: { marginTop: 18 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', textAlign: 'right', marginBottom: 10 },
    daysScroll: { flexDirection: 'row-reverse', gap: 8 },
    dayChip: {
        width: 60,
        height: 70,
        borderRadius: 14,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    dayChipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    dayChipToday: { borderColor: '#4F46E5', borderWidth: 1.5 },
    dayName: { fontSize: 12, color: '#64748B' },
    dayNum: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    dayTextSelected: { color: '#FFF' },
    todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4F46E5', marginTop: 2 },

    // المهام
    tasksSection: { marginTop: 20, gap: 12 },
    tasksHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
    tasksCountText: { fontSize: 12, color: '#64748B' },
    taskCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        gap: 12,
    },
    taskCardCompleted: { backgroundColor: '#F8FAFC', opacity: 0.75 },
    checkboxTouch: { padding: 2 },
    taskDetails: { flex: 1, alignItems: 'flex-end', gap: 6 },
    taskTagRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
    subjectTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    subjectTagText: { fontSize: 11, fontWeight: 'bold' },
    timeTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
    timeTagText: { fontSize: 11, color: '#64748B' },
    taskTopicTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', textAlign: 'right' },
    taskTopicCompleted: { textDecorationLine: 'line-through', color: '#94A3B8' },
    timeSlotText: { fontSize: 11, color: '#94A3B8' },
    subjectColorBar: { width: 4, height: '100%', borderRadius: 2 },

    emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
    emptyStateText: { fontSize: 13, color: '#94A3B8' },

    // النافذة المنبثقة Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 },
    modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#475569', textAlign: 'right' },
    textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, fontSize: 13, color: '#0F172A' },
    saveButton: { flexDirection: 'row-reverse', backgroundColor: '#4F46E5', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
    saveButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});