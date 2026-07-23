import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerTitleAlign: 'center',
                tabBarActiveTintColor: '#007bff',
                tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'الدروس والـ AI',
                    tabBarLabel: 'الدروس',
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'إضافة درس جديد',
                    tabBarLabel: 'إدخال بيانات',
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'الاستجابات المحفوظة',
                    tabBarLabel: 'المحفوظات',
                }}
            />
            <Tabs.Screen
                name="app"
                options={{
                    title: 'الشاشة ',
                    tabBarLabel: 'الرئيسية',
                }}
            />
        </Tabs>
    );
}