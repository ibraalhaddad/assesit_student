import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            {/* 1. الشريط العلوي (Header) */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconCircle}>
                    <Ionicons name="person-outline" size={22} color="#4F46E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>شعار التطبيق</Text>
                <TouchableOpacity style={styles.iconCircle}>
                    <Ionicons name="menu" size={24} color="#221ac8" />
                </TouchableOpacity>
            </View>

            {/* المحتوى القابل للتمرير */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* البطاقة الأولى (Card 1) */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>عنوان الفقرة</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Ionicons name="image-outline" size={40} color="#CBD5E1" />
                        <Text style={styles.cardBodyText}>محتوى البطاقة هنا</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="book-outline" size={20} color="#64748B" /></TouchableOpacity>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="document-text-outline" size={20} color="#64748B" /></TouchableOpacity>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="videocam-outline" size={20} color="#64748B" /></TouchableOpacity>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="planet-outline" size={20} color="#64748B" /></TouchableOpacity>
                    </View>
                </View>

                {/* البطاقة الثانية (Card 2) */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>عنوان الفقرة</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Ionicons name="image-outline" size={40} color="#CBD5E1" />
                        <Text style={styles.cardBodyText}>محتوى البطاقة هنا</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="grid-outline" size={20} color="#64748B" /></TouchableOpacity>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="document-text-outline" size={20} color="#64748B" /></TouchableOpacity>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="videocam-outline" size={20} color="#64748B" /></TouchableOpacity>
                        <TouchableOpacity style={styles.footerIcon}><Ionicons name="planet-outline" size={20} color="#64748B" /></TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* 3. شريط التنقل السفلي (Bottom Navigation) */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}><Ionicons name="grid-outline" size={22} color="#64748B" /></TouchableOpacity>
                <TouchableOpacity style={styles.navItem}><Ionicons name="document-text-outline" size={22} color="#64748B" /></TouchableOpacity>

                {/* الأيقونة البارزة في المنتصف */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity style={styles.fabButton}>
                        <Ionicons name="home" size={26} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem}><Ionicons name="videocam-outline" size={22} color="#64748B" /></TouchableOpacity>
                <TouchableOpacity style={styles.navItem}><Ionicons name="planet-outline" size={22} color="#64748B" /></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // خلفية عامة فاتحة وهادئة
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
        backgroundColor: '#4F46E5', // لون عصري بارز (Indigo)
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
});