// Input Component - Temo Thuo Market

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  disabled?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  disabled = false,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getInputStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: error
        ? COLORS.error
        : isFocused
        ? COLORS.primary
        : COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      minHeight: 50,
    };

    if (disabled) {
      baseStyle.backgroundColor = COLORS.surfaceSecondary;
      baseStyle.opacity = 0.7;
    }

    return baseStyle;
  };

  const isPassword = props.secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      <View style={[getInputStyle(), error && { borderColor: COLORS.error }]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          {...props}
          style={[styles.input, inputStyle]}
          placeholderTextColor={COLORS.textLight}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          secureTextEntry={isPassword}
        />
        {props.secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !props.secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  required: {
    color: COLORS.error,
    marginLeft: 2,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIconButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  error: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default Input;