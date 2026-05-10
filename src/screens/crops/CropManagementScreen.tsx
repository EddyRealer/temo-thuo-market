// Crop Management Screen - Temo Thuo Market

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, CROP_TYPES } from '../../constants/theme';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToUserCrops } from '../../services/firestoreService';
import { Crop } from '../../types';

interface CropManagementScreenProps {
  navigation: any;
}

const CropManagementScreen: React.FC<CropManagementScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserCrops(user.id, (fetchedCrops) => {
      setCrops(fetchedCrops);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'success';
      case 'ready': return 'warning';
      case 'planted': return 'info';
      case 'harvested': return 'default';
      default: return 'default';
    }
  };

  const renderCropItem = ({ item }: { item: Crop }) => (
    <Card
      style={styles.cropCard}
      onPress={() => navigation.navigate('CropDetail', { cropId: item.id })}
    >
      <View style={styles.cropHeader}>
        <View style={styles.cropIcon}>
          <Text style={styles.cropEmoji}>
            {CROP_TYPES.find(c => c.id === item.name.toLowerCase())?.icon || '🌱'}
          </Text>
        </View>
        <View style={styles.cropInfo}>
          <Text style={styles.cropName}>{item.name}</Text>
          <Text style={styles.cropDate}>Planted: {item.plantingDate}</Text>
        </View>
        <Badge text={item.status} variant={getStatusColor(item.status) as any} size="small" />
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddCrop')}>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : crops.length > 0 ? (
        <FlatList
          data={crops}
          renderItem={renderCropItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="leaf-outline"
          title="No Crops Yet"
          message="Start tracking your crops by adding your first crop"
          actionLabel="Add Crop"
          onAction={() => navigation.navigate('AddCrop')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.lg,
  },
  cropCard: {
    marginBottom: SPACING.md,
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cropEmoji: {
    fontSize: 24,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  cropDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default CropManagementScreen;