// Custom Button Component - Temo Thuo Market

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = SPACING.xs;
        baseStyle.paddingHorizontal = SPACING.md;
        break;
      case 'large':
        baseStyle.paddingVertical = SPACING.md + 2;
        baseStyle.paddingHorizontal = SPACING.xl;
        break;
      default:
        baseStyle.paddingVertical = SPACING.sm + 4;
        baseStyle.paddingHorizontal = SPACING.lg;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = COLORS.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = COLORS.transparent;
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = COLORS.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = COLORS.transparent;
        break;
      default:
        baseStyle.backgroundColor = COLORS.primary;
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: FONT_WEIGHTS.semibold,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = FONT_SIZES.sm;
        break;
      case 'large':
        baseStyle.fontSize = FONT_SIZES.lg;
        break;
      default:
        baseStyle.fontSize = FONT_SIZES.md;
    }

    // Variant styles
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseStyle.color = COLORS.primary;
        break;
      case 'secondary':
        baseStyle.color = COLORS.textOnSecondary;
        break;
      default:
        baseStyle.color = COLORS.textOnPrimary;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), textStyle, icon && { marginLeft: SPACING.xs }]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Text style={{ marginLeft: SPACING.xs }}>{icon}</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;