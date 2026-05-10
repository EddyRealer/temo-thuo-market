// Splash Screen - Temo Thuo Market

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      // Check if user is logged in
      // For now, navigate to Onboarding
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoIcon}>
          <Ionicons name="leaf" size={80} color={COLORS.white} />
        </View>
        <Text style={styles.appName}>Temo Thuo</Text>
        <Text style={styles.tagline}>Market</Text>
      </Animated.View>
      <Animated.Text
        style={[styles.slogan, { opacity: fadeAnim }]}
      >
        Where Innovation meets Tradition, Feeding beyond Africa
      </Animated.Text>
      <Animated.View style={[styles.loadingDots, { opacity: fadeAnim }]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONT_SIZES.title,
    fontWeight: '300',
    color: COLORS.secondary,
    marginTop: -5,
  },
  slogan: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xl,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 6,
    opacity: 0.6,
  },
});

export default SplashScreen;