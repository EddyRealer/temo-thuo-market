// Chip Component - Temo Thuo Market

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

interface ChipProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'outline';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  selected = false,
  onPress,
  style,
  variant = 'default',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        variant === 'outline' && styles.outline,
        selected && styles.selected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={selected ? COLORS.white : COLORS.primary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  outline: {
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.border,
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  labelSelected: {
    color: COLORS.white,
  },
});

export default Chip;