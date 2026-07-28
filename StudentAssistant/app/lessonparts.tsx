import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 1. تعريف الأنواع (TypeScript Types & Interfaces)
type IoniconName = keyof typeof Ionicons.glyphMap;

interface CardAction {
  id: string;
  iconName: IoniconName;
  onPress?: () => void;
}

interface CardProps {
  id: string;
  title: string;
  bodyText: string;
  mainIcon?: IoniconName;
  actions: CardAction[];
  onPress?: () => void; // إضافة خاصية الضغط للبطاقة
}

// 2. بيانات البطاقات المنظمة (Mock Data)
const CARDS_DATA: Omit<CardProps, 'onPress'>[] = [
  {
    id: '1',
    title: 'عنوان الفقرة الأولى',
    bodyText: 'محتوى البطاقة الأول هنا',
    mainIcon: 'image-outline',
    actions: [
      { id: '1', iconName: 'book-outline' },
      { id: '2', iconName: 'document-text-outline' },
      { id: '3', iconName: 'videocam-outline' },
      { id: '4', iconName: 'planet-outline' },
    ],
  },
  {
    id: '2',
    title: 'عنوان الفقرة الثانية',
    bodyText: 'محتوى البطاقة الثاني هنا',
    mainIcon: 'image-outline',
    actions: [
      { id: '1', iconName: 'grid-outline' },
      { id: '2', iconName: 'document-text-outline' },
      { id: '3', iconName: 'videocam-outline' },
      { id: '4', iconName: 'planet-outline' },
    ],
  },
];

// 3. مكون البطاقة (تم تحويله إلى TouchableOpacity)
const CardItem: React.FC<CardProps> = ({
  title,
  bodyText,
  mainIcon = 'image-outline',
  actions,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.9}
    onPress={onPress}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>

    <View style={styles.cardBody}>
      <Ionicons name={mainIcon} size={40} color="#CBD5E1" />
      <Text style={styles.cardBodyText}>{bodyText}</Text>
    </View>

    <View style={styles.cardFooter}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.footerIcon}
          activeOpacity={0.7}
          onPress={(e) => {
            // منع انتشار حدث الضغط للبطاقة الرئيسية عند الضغط على أيقونة الفوتر
            e.stopPropagation();
            action.onPress?.();
          }}
        >
          <Ionicons name={action.iconName} size={20} color="#64748B" />
        </TouchableOpacity>
      ))}
    </View>
  </TouchableOpacity>
);

// 4. المكون الرئيسي للشاشة
export default function App(): React.JSX.Element {
  // دالة الانتقال للتفاصيل مع تمرير بيانات الفقرة
  const handleCardPress = (cardTitle: string) => {
    router.push({
      pathname: '/section-details',
      params: { title: cardTitle },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* الشريط العلوي (Header) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={22} color="#4F46E5" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>شعار التطبيق</Text>

        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* المحتوى القابل للتمرير */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {CARDS_DATA.map((card) => (
          <CardItem
            key={card.id}
            id={card.id}
            title={card.title}
            bodyText={card.bodyText}
            mainIcon={card.mainIcon}
            actions={card.actions}
            onPress={() => handleCardPress(card.title)}
          />
        ))}
      </ScrollView>

      {/* شريط التنقل السفلي (Bottom Navigation) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="grid-outline" size={22} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={22} color="#64748B" />
        </TouchableOpacity>

        {/* الأيقونة البارزة في المنتصف */}
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.85}>
            <Ionicons name="home" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="videocam-outline" size={22} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="planet-outline" size={22} color="#64748B" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#FFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardHeader: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  cardBody: {
    height: 120,
    backgroundColor: '#FAFAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBodyText: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#F8FAFC',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  fabContainer: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});