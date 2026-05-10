// Card Component - Temo Thuo Market

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
    };

    // Variant styles
    switch (variant) {
      case 'elevated':
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = 0.1;
        baseStyle.shadowRadius = 4;
        baseStyle.elevation = 4;
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = COLORS.border;
        break;
      default:
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 1 };
        baseStyle.shadowOpacity = 0.08;
        baseStyle.shadowRadius = 2;
        baseStyle.elevation = 2;
    }

    // Padding styles
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.padding = SPACING.sm;
        break;
      case 'large':
        baseStyle.padding = SPACING.lg;
        break;
      default:
        baseStyle.padding = SPACING.md;
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

export default Card;