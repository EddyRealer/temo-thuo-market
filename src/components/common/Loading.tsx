// Loading Component - Temo Thuo Market

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = COLORS.primary,
  message,
  overlay = false,
  style,
}) => {
  if (overlay) {
    return (
      <View style={[styles.overlay, style]}>
        <View style={styles.container}>
          <ActivityIndicator size={size} color={color} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default Loading;