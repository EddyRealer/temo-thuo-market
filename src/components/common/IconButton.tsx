// IconButton Component - Temo Thuo Market

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outline' | 'ghost';
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  color,
  backgroundColor,
  style,
  disabled = false,
}) => {
  const getButtonSize = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 52;
      default:
        return 44;
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 28;
      default:
        return 22;
    }
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();
  const iconColor = color || (variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: buttonSize,
      height: buttonSize,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'outline':
        baseStyle.backgroundColor = COLORS.transparent;
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = backgroundColor || COLORS.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = COLORS.transparent;
        break;
      default:
        baseStyle.backgroundColor = backgroundColor || COLORS.primary;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name={icon as any} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default IconButton;