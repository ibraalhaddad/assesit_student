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
    Image,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1. الأنواع (TypeScript Interfaces)
type MainTab = 'discussions' | 'live' | 'chat';

interface StudyGroup {
    id: string;
    title: string;
    subject: string;
    membersCount: number;
    maxMembers: number;
    activeTopic: string;
    tags: string[];
}

interface LiveStream {
    id: string;
    title: string;
    teacherName: string;
    teacherTitle: string;
    subject: string;
    isLive: boolean;
    viewersCount?: number;
    startTime?: string;
    avatar: string;
}

interface ChatMessage {
    id: string;
    senderName: string;
    senderRole?: string;
    message: string;
    time: string;
    isMe: boolean;
    avatar: string;
}

// 2. البيانات الافتراضية
const STUDY_GROUPS: StudyGroup[] = [
    {
        id: '1',
        title: 'مجموعة مراجعة التفاضل والتكامل',
        subject: 'الرياضيات',
        membersCount: 8,
        maxMembers: 10,
        activeTopic: 'حل مسائل التكامل بالتعويض',
        tags: ['رياضيات', 'مراجعة_نهائية'],
    },
    {
        id: '2',
        title: 'قروب الفيزياء الموجية والنواة',
        subject: 'الفيزياء',
        membersCount: 5,
        maxMembers: 8,
        activeTopic: 'ملخص قوانين الموجات الكهرومغناطيسية',
        tags: ['فيزياء', 'تجارب'],
    },
    {
        id: '3',
        title: 'نادي قواعد اللغة العربية',
        subject: 'اللغة العربية',
        membersCount: 12,
        maxMembers: 15,
        activeTopic: 'إعراب أفعال المقاربة والرجاء',
        tags: ['نحو', 'بلاغة'],
    },
];

const LIVE_STREAMS: LiveStream[] = [
    {
        id: '1',
        title: 'شرح وتفكيك أعقد مسائل الفيزياء للثانوية',
        teacherName: 'أ. أحمد السعيد',
        teacherTitle: 'خبير الفيزياء ومؤلف سلسلة التميّز',
        subject: 'الفيزياء',
        isLive: true,
        viewersCount: 342,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
        id: '2',
        title: 'مراجعة شاملة لقواعد الإنجليزي - Unit 1 to 4',
        teacherName: 'د. مريم الخالد',
        teacherTitle: 'استشاري مناهج اللغة الإنجليزية',
        subject: 'اللغة الإنجليزية',
        isLive: false,
        startTime: 'اليوم، 8:00 مساءً',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    {
        id: '3',
        title: 'أسرار حل الكيمياء العضوية بدون تعقيد',
        teacherName: 'أ. خالد القاسم',
        teacherTitle: 'مدرس كيمياء متميز',
        subject: 'الكيمياء',
        isLive: false,
        startTime: 'غداً، 5:00 مساءً',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: '1',
        senderName: 'محمد العتيبي',
        senderRole: 'طالب',
        message: 'السلام عليكم يا شباب، من عنده ملخص باب التفاضل كملف PDF؟',
        time: '10:30 ص',
        isMe: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    },
    {
        id: '2',
        senderName: 'سارة الشمري',
        senderRole: 'طالبة ممتازة',
        message: 'وعليكم السلام! الملاحظات المثبتة في قسم الرياضيات فيها كل قوانين التفاضل بشكل ممتاز.',
        time: '10:32 ص',
        isMe: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
        id: '3',
        senderName: 'أنا',
        message: 'يعطيكِ العافية سارة، فعلاً الملاحظات ممتازة وساعدتني كثير.',
        time: '10:35 ص',
        isMe: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
    },
];

export default function CommunityScreen(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<MainTab>('discussions');

    // نص رسالة الدردشة والرسائل الحالية
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

    // إرسال رسالة دردشة جديدة
    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            senderName: 'أنا',
            message: chatInput.trim(),
            time: 'الآن',
            isMe: true,
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
        };

        setMessages((prev) => [...prev, newMsg]);
        setChatInput('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* --- 1. الشريط العلوي (Header) --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} onPress={() => router.back()}>
                    <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>مجتمع علاّم</Text>

                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
                    <Ionicons name="search-outline" size={20} color="#1E293B" />
                </TouchableOpacity>
            </View>

            {/* --- 2. التبويبات الرئيسية (Tabs Header) --- */}
            <View style={styles.tabsContainer}>
                {[
                    { id: 'discussions', label: 'مناقشات ودراسة', icon: 'people-outline' },
                    { id: 'live', label: 'بث مباشر 🔴', icon: 'videocam-outline' },
                    { id: 'chat', label: 'دردشة عامة', icon: 'chatbubbles-outline' },
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                            onPress={() => setActiveTab(tab.id as MainTab)}
                        >
                            <Ionicons
                                name={tab.icon as any}
                                size={16}
                                color={isActive ? '#4F46E5' : '#64748B'}
                            />
                            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* --- 3. محتوى التبويب --- */}
            <View style={styles.contentArea}>

                {/* --- التبويب الأول: مناقشات ودراسة --- */}
                {activeTab === 'discussions' && (
                    <ScrollView contentContainerStyle={styles.tabScrollContent} showsVerticalScrollIndicator={false}>
                        {/* زر تكوين قروب جديد */}
                        <TouchableOpacity style={styles.createGroupBanner} activeOpacity={0.85}>
                            <View style={styles.bannerIconBox}>
                                <Ionicons name="add-circle" size={28} color="#4F46E5" />
                            </View>
                            <View style={styles.bannerTextContainer}>
                                <Text style={styles.bannerTitle}>تكوين مجموعة مذاكرة جديدة</Text>
                                <Text style={styles.bannerSubtitle}>اختر المادة، حدد الأهداف، وادعُ زملائك للمذاكرة سوياً</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>مجموعات المذاكرة النشطة</Text>
                            <Text style={styles.sectionBadge}>{STUDY_GROUPS.length} مجموعات</Text>
                        </View>

                        {/* بطاقات مجموعات المذاكرة */}
                        <View style={styles.groupsList}>
                            {STUDY_GROUPS.map((group) => (
                                <View key={group.id} style={styles.groupCard}>
                                    <View style={styles.groupCardHeader}>
                                        <View style={styles.subjectBadge}>
                                            <Text style={styles.subjectBadgeText}>{group.subject}</Text>
                                        </View>
                                        <View style={styles.membersCountBox}>
                                            <Ionicons name="people" size={14} color="#64748B" />
                                            <Text style={styles.membersCountText}>
                                                {group.membersCount} / {group.maxMembers}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.groupTitle}>{group.title}</Text>

                                    <View style={styles.activeTopicBox}>
                                        <Ionicons name="chatbox-ellipses-outline" size={14} color="#4F46E5" />
                                        <Text style={styles.activeTopicText} numberOfLines={1}>
                                            {group.activeTopic}
                                        </Text>
                                    </View>

                                    <View style={styles.tagsRow}>
                                        {group.tags.map((tag, idx) => (
                                            <Text key={idx} style={styles.tagText}>#{tag}</Text>
                                        ))}
                                    </View>

                                    <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
                                        <Text style={styles.joinButtonText}>انضمام للمجموعة</Text>
                                        <Ionicons name="arrow-back" size={16} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}

                {/* --- التبويب الثاني: بث مباشر --- */}
                {activeTab === 'live' && (
                    <ScrollView contentContainerStyle={styles.tabScrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>الدروس والحروس المباشرة</Text>
                            <Text style={styles.liveNowTag}>🔴 بث حي</Text>
                        </View>

                        <View style={styles.streamsList}>
                            {LIVE_STREAMS.map((stream) => (
                                <View key={stream.id} style={styles.streamCard}>
                                    {/* رأس بطاقة البث */}
                                    <View style={styles.streamHeader}>
                                        <Image source={{ uri: stream.avatar }} style={styles.teacherAvatar} />
                                        <View style={styles.teacherMeta}>
                                            <Text style={styles.teacherName}>{stream.teacherName}</Text>
                                            <Text style={styles.teacherTitle}>{stream.teacherTitle}</Text>
                                        </View>
                                        {stream.isLive ? (
                                            <View style={styles.liveBadge}>
                                                <View style={styles.liveDot} />
                                                <Text style={styles.liveBadgeText}>مباشر الآن</Text>
                                            </View>
                                        ) : (
                                            <View style={styles.upcomingBadge}>
                                                <Text style={styles.upcomingText}>قريباً</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* عنوان الدرس */}
                                    <Text style={styles.streamTitle}>{stream.title}</Text>

                                    {/* تفاصيل وحالة البث */}
                                    <View style={styles.streamFooter}>
                                        {stream.isLive ? (
                                            <View style={styles.viewersInfo}>
                                                <Ionicons name="eye-outline" size={16} color="#DC2626" />
                                                <Text style={styles.viewersText}>{stream.viewersCount} مشاهد حالياً</Text>
                                            </View>
                                        ) : (
                                            <View style={styles.viewersInfo}>
                                                <Ionicons name="time-outline" size={16} color="#D97706" />
                                                <Text style={styles.timeText}>{stream.startTime}</Text>
                                            </View>
                                        )}

                                        <TouchableOpacity
                                            style={[
                                                styles.watchButton,
                                                !stream.isLive && styles.watchButtonSecondary,
                                            ]}
                                            activeOpacity={0.8}
                                        >
                                            <Text
                                                style={[
                                                    styles.watchButtonText,
                                                    !stream.isLive && styles.watchButtonTextSecondary,
                                                ]}
                                            >
                                                {stream.isLive ? 'دخول البث الآن' : 'تذكيري بالموعد'}
                                            </Text>
                                            <Ionicons
                                                name={stream.isLive ? 'play' : 'notifications-outline'}
                                                size={14}
                                                color={stream.isLive ? '#FFF' : '#4F46E5'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}

                {/* --- التبويب الثالث: مراسلات ودردشة عامة --- */}
                {activeTab === 'chat' && (
                    <View style={styles.chatContainer}>
                        {/* قائمة الرسائل */}
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.chatListContent}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.messageRow,
                                        item.isMe ? styles.messageRowMe : styles.messageRowOther,
                                    ]}
                                >
                                    {!item.isMe && (
                                        <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                                    )}
                                    <View
                                        style={[
                                            styles.messageBubble,
                                            item.isMe ? styles.bubbleMe : styles.bubbleOther,
                                        ]}
                                    >
                                        {!item.isMe && (
                                            <Text style={styles.senderName}>
                                                {item.senderName}{' '}
                                                {item.senderRole && <Text style={styles.senderRole}>({item.senderRole})</Text>}
                                            </Text>
                                        )}
                                        <Text style={[styles.messageText, item.isMe && styles.messageTextMe]}>
                                            {item.message}
                                        </Text>
                                        <Text style={[styles.messageTime, item.isMe && styles.messageTimeMe]}>
                                            {item.time}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />

                        {/* حقل إرسال الرسالة */}
                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={handleSendMessage}>
                                <Ionicons name="send" size={18} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.chatInput}
                                placeholder="اكتب رسالتك للمجتمع هنا..."
                                placeholderTextColor="#94A3B8"
                                value={chatInput}
                                onChangeText={setChatInput}
                            />
                        </View>
                    </View>
                )}

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

    // شريط التبويبات
    tabsContainer: {
        flexDirection: 'row-reverse',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        gap: 6,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 9,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        gap: 6,
    },
    tabBtnActive: {
        backgroundColor: '#EEF2FF',
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    tabTextActive: {
        color: '#4F46E5',
        fontWeight: 'bold',
    },

    // المنطقة المتغيرة
    contentArea: {
        flex: 1,
    },
    tabScrollContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 30,
    },

    // التبويب 1: مناقشات ودراسة
    createGroupBanner: {
        flexDirection: 'row-reverse',
        backgroundColor: '#EEF2FF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#C7D2FE',
        alignItems: 'center',
        gap: 12,
    },
    bannerIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTextContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3730A3',
        textAlign: 'right',
    },
    bannerSubtitle: {
        fontSize: 11,
        color: '#4C51BF',
        marginTop: 2,
        textAlign: 'right',
    },
    sectionTitleRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    sectionBadge: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    groupsList: {
        gap: 12,
    },
    groupCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 10,
    },
    groupCardHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    subjectBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#334155',
    },
    membersCountBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    membersCountText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    groupTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'right',
    },
    activeTopicBox: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 8,
        gap: 6,
    },
    activeTopicText: {
        fontSize: 12,
        color: '#475569',
        flex: 1,
        textAlign: 'right',
    },
    tagsRow: {
        flexDirection: 'row-reverse',
        gap: 6,
    },
    tagText: {
        fontSize: 11,
        color: '#4F46E5',
        fontWeight: '500',
    },
    joinButton: {
        flexDirection: 'row-reverse',
        backgroundColor: '#4F46E5',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 4,
    },
    joinButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },

    // التبويب 2: بث مباشر
    liveNowTag: {
        fontSize: 12,
        color: '#DC2626',
        fontWeight: 'bold',
    },
    streamsList: {
        gap: 14,
    },
    streamCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    streamHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
    },
    teacherAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    teacherMeta: {
        flex: 1,
        alignItems: 'flex-start',
    },
    teacherName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'right',
    },
    teacherTitle: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'right',
    },
    liveBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DC2626',
    },
    liveBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#DC2626',
    },
    upcomingBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    upcomingText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D97706',
    },
    streamTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 22,
        textAlign: 'right',
    },
    streamFooter: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 10,
    },
    viewersInfo: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    viewersText: {
        fontSize: 12,
        color: '#DC2626',
        fontWeight: '600',
    },
    timeText: {
        fontSize: 12,
        color: '#D97706',
        fontWeight: '600',
    },
    watchButton: {
        flexDirection: 'row-reverse',
        backgroundColor: '#DC2626',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        gap: 6,
    },
    watchButtonSecondary: {
        backgroundColor: '#EEF2FF',
    },
    watchButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    watchButtonTextSecondary: {
        color: '#4F46E5',
    },

    // التبويب 3: دردشة عامة
    chatContainer: {
        flex: 1,
    },
    chatListContent: {
        padding: 16,
        gap: 12,
    },
    messageRow: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 4,
    },
    messageRowMe: {
        justifyContent: 'flex-start',
    },
    messageRowOther: {
        justifyContent: 'flex-start',
    },
    chatAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        gap: 2,
    },
    bubbleMe: {
        backgroundColor: '#4F46E5',
        borderBottomRightRadius: 2,
    },
    bubbleOther: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderBottomLeftRadius: 2,
    },
    senderName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#4F46E5',
        textAlign: 'right',
    },
    senderRole: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: 'normal',
    },
    messageText: {
        fontSize: 13,
        color: '#1E293B',
        lineHeight: 18,
        textAlign: 'right',
    },
    messageTextMe: {
        color: '#FFF',
    },
    messageTime: {
        fontSize: 9,
        color: '#94A3B8',
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    messageTimeMe: {
        color: '#E0E7FF',
    },
    inputContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        gap: 8,
    },
    chatInput: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 13,
        color: '#0F172A',
        textAlign: 'right',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxHeight: 80,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
});