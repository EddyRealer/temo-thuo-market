// Divider Component - Temo Thuo Market

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color = COLORS.divider,
  thickness = 1,
  vertical = false,
}) => {
  if (vertical) {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: color, width: thickness },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        { backgroundColor: color, height: thickness },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    marginVertical: SPACING.sm,
  },
  vertical: {
    height: '100%',
    marginHorizontal: SPACING.sm,
  },
});

export default Divider;