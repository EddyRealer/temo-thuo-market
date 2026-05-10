// Badge Component - Temo Thuo Market

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success':
        return COLORS.success + '20';
      case 'warning':
        return COLORS.warning + '20';
      case 'error':
        return COLORS.error + '20';
      case 'info':
        return COLORS.info + '20';
      default:
        return COLORS.primary + '20';
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'success':
        return COLORS.success;
      case 'warning':
        return '#B7950B';
      case 'error':
        return COLORS.error;
      case 'info':
        return COLORS.info;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: size === 'small' ? SPACING.xs : SPACING.sm,
          paddingVertical: size === 'small' ? 2 : SPACING.xs,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: size === 'small' ? FONT_SIZES.xs : FONT_SIZES.sm,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;