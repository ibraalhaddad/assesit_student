import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // حركة ظهور الشعار وتكبيره
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // التوجيه التلقائي إلى شاشة Onboarding بعد 2.5 ثانية
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.logoBox}>
          <Ionicons name="school" size={54} color="#4F46E5" />
        </View>

        <Text style={styles.brandTitle}>علاّم</Text>
        <Text style={styles.brandSubtitle}>مساعدك الدراسي الذكي</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>جميع الحقوق محفوظة ©</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoBox: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 6,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    fontSize: 11,
    color: '#C7D2FE',
  },
});