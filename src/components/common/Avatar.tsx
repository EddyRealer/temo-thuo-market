// Avatar Component - Temo Thuo Market

import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'medium',
  style,
  imageStyle,
  showOnlineIndicator = false,
  isOnline = false,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 60;
      case 'xlarge':
        return 80;
      default:
        return 44;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return FONT_SIZES.xs;
      case 'large':
        return FONT_SIZES.xl;
      case 'xlarge':
        return FONT_SIZES.xxxl;
      default:
        return FONT_SIZES.md;
    }
  };

  const getInitials = (): string => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getBackgroundColor = (): string => {
    if (!name) return COLORS.textSecondary;
    // Generate a consistent color based on name
    const colors = [
      COLORS.primary,
      COLORS.secondary,
      COLORS.accent,
      '#8E44AD',
      '#2980B9',
      '#16A085',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const containerSize = getSize();
  const showIndicator = showOnlineIndicator && isOnline !== undefined;

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: containerSize, height: containerSize, borderRadius: containerSize / 2 },
            imageStyle,
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: containerSize,
              height: containerSize,
              borderRadius: containerSize / 2,
              backgroundColor: getBackgroundColor(),
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: getFontSize() }]}>
            {getInitials()}
          </Text>
        </View>
      )}
      {showIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              right: 0,
              bottom: 0,
              width: containerSize * 0.25,
              height: containerSize * 0.25,
              borderRadius: containerSize * 0.125,
              backgroundColor: isOnline ? COLORS.success : COLORS.textSecondary,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: COLORS.white,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

export default Avatar;