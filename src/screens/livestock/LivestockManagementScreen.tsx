// Livestock Management Screen - Temo Thuo Market

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, LIVESTOCK_TYPES } from '../../constants/theme';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

interface LivestockManagementScreenProps {
  navigation: any;
}

const LivestockManagementScreen: React.FC<LivestockManagementScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const livestock = [
    { id: '1', name: 'Cattle - #001', type: 'cattle', status: 'active', weight: 450 },
    { id: '2', name: 'Goats - #012', type: 'goats', status: 'active', weight: 45 },
    { id: '3', name: 'Chickens - #050', type: 'chickens', status: 'active', weight: 2.5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'sold': return 'info';
      default: return 'default';
    }
  };

  const renderLivestockItem = ({ item }: { item: any }) => (
    <Card
      style={styles.livestockCard}
      onPress={() => navigation.navigate('EditLivestock', { livestockId: item.id })}
    >
      <View style={styles.livestockHeader}>
        <View style={styles.livestockIcon}>
          <Text style={styles.livestockEmoji}>
            {LIVESTOCK_TYPES.find(l => l.id === item.type)?.icon || '🐄'}
          </Text>
        </View>
        <View style={styles.livestockInfo}>
          <Text style={styles.livestockName}>{item.name}</Text>
          <Text style={styles.livestockWeight}>Weight: {item.weight} kg</Text>
        </View>
        <Badge text={item.status} variant={getStatusColor(item.status) as any} size="small" />
      </View>
      <View style={styles.livestockActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="medkit-outline" size={18} color={COLORS.primary} />
          <Text style={styles.actionText}>Vaccinate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="scale-outline" size={18} color={COLORS.secondary} />
          <Text style={styles.actionText}>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={18} color={COLORS.accent} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Livestock Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddLivestock')}>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {livestock.length > 0 ? (
        <FlatList
          data={livestock}
          renderItem={renderLivestockItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="paw-outline"
          title="No Livestock"
          message="Start managing your livestock by adding your first animal"
          actionLabel="Add Livestock"
          onAction={() => navigation.navigate('AddLivestock')}
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
  livestockCard: {
    marginBottom: SPACING.md,
  },
  livestockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  livestockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  livestockEmoji: {
    fontSize: 24,
  },
  livestockInfo: {
    flex: 1,
  },
  livestockName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  livestockWeight: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  livestockActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
});

export default LivestockManagementScreen;