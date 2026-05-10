// Header Component - Temo Thuo Market

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightIcon?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightIcon,
  rightComponent,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + SPACING.sm },
        transparent && styles.transparent,
        style,
      ]}
    >
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={transparent ? COLORS.white : COLORS.text}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text
          style={[
            styles.title,
            transparent && styles.titleLight,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              transparent && styles.subtitleLight,
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightSection}>
        {rightComponent ? (
          rightComponent
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIcon}
            style={styles.rightButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon as any}
              size={24}
              color={transparent ? COLORS.white : COLORS.text}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SPACING.xs,
  },
  rightButton: {
    padding: SPACING.xs,
  },
  placeholder: {
    width: 24,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  titleLight: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  subtitleLight: {
    color: COLORS.white,
    opacity: 0.8,
  },
});

export default Header;