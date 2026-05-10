// Onboarding Screen - Temo Thuo Market

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

interface OnboardingItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    icon: 'storefront-outline',
    title: 'Marketplace',
    description: 'Buy and sell crops, livestock, and farm equipment directly with other farmers and buyers across Africa.',
  },
  {
    id: 2,
    icon: 'leaf-outline',
    title: 'Farm Management',
    description: 'Track your crops, manage livestock, monitor growth, and get smart recommendations for your farm.',
  },
  {
    id: 3,
    icon: 'people-outline',
    title: 'Community',
    description: 'Connect with fellow farmers, share experiences, get advice, and stay updated with agricultural trends.',
  },
  {
    id: 4,
    icon: 'chatbubbles-outline',
    title: 'Direct Messaging',
    description: 'Chat directly with buyers and sellers, negotiate prices, and build lasting business relationships.',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      navigation.navigate('Login');
    }
  };

  const skipOnboarding = () => {
    navigation.navigate('Login');
  };

  const renderOnboardingItem = (item: OnboardingItem, index: number) => (
    <View key={item.id} style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={100} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={skipOnboarding}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map(renderOnboardingItem)}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Bottom Buttons */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          onPress={goToNext}
          fullWidth
          size="large"
        />
        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.footerTagline}>Where Innovation meets Tradition, Feeding beyond Africa</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  slide: {
    width,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
  },
  loginLink: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footerTagline: {
    marginTop: SPACING.md,
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryLight,
    fontStyle: 'italic',
  },
});

export default OnboardingScreen;