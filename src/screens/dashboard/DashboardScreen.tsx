// Dashboard Screen - Temo Thuo Market

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS, CROP_TYPES, LIVESTOCK_TYPES } from '../../constants/theme';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [weather] = useState({
    temp: 28,
    condition: 'Sunny',
    icon: '☀️',
  });

  const stats = {
    activeCrops: 12,
    activeLivestock: 45,
    pendingOrders: 3,
    unreadMessages: 5,
    totalSales: 12500,
    thisMonthExpenses: 3200,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const quickActions = [
    { icon: 'leaf-outline', label: 'Add Crop', color: COLORS.primary, onPress: () => navigation.navigate('AddCrop') },
    { icon: 'paw-outline', label: 'Add Livestock', color: COLORS.secondary, onPress: () => navigation.navigate('AddLivestock') },
    { icon: 'camera-outline', label: 'Add Product', color: COLORS.accent, onPress: () => navigation.navigate('AddProduct') },
    { icon: 'chatbubbles-outline', label: 'Message', color: COLORS.info, onPress: () => navigation.navigate('ConversationsList') },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.userName}>{user?.displayName || 'Farmer'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Weather Card */}
      <Card style={styles.weatherCard} variant="elevated">
        <View style={styles.weatherContent}>
          <View>
            <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
          </View>
          <Text style={styles.weatherIcon}>{weather.icon}</Text>
        </View>
        <TouchableOpacity
          style={styles.weatherDetails}
          onPress={() => navigation.navigate('Weather')}
        >
          <Text style={styles.weatherLink}>View 7-day forecast</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </Card>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionItem}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Farm Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Farm Overview</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CropManagement')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="elevated">
            <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="leaf" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>{stats.activeCrops}</Text>
            <Text style={styles.statLabel}>Active Crops</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <View style={[styles.statIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <Ionicons name="paw" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.statValue}>{stats.activeLivestock}</Text>
            <Text style={styles.statLabel}>Livestock</Text>
          </Card>
        </View>
      </View>

      {/* Crop Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Crop Status</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CropManagement')}>
            <Text style={styles.viewAllLink}>Manage</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CROP_TYPES.slice(0, 5).map((crop, index) => (
            <Card key={index} style={styles.cropCard}>
              <View style={[styles.cropIcon, { backgroundColor: crop.color + '20' }]}>
                <Text style={styles.cropEmoji}>{crop.icon}</Text>
              </View>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Badge text="Growing" variant="success" size="small" />
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.viewAllLink}>Details</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.financialCard} variant="outlined">
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Total Sales</Text>
              <Text style={styles.financialValue}>P{stats.totalSales.toLocaleString()}</Text>
            </View>
            <View style={styles.financialDivider} />
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>This Month</Text>
              <Text style={[styles.financialValue, { color: COLORS.error }]}>
                -P{stats.thisMonthExpenses.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.profitIndicator}>
            <Ionicons name="trending-up" size={20} color={COLORS.success} />
            <Text style={styles.profitText}>
              P{(stats.totalSales - stats.thisMonthExpenses).toLocaleString()} profit this month
            </Text>
          </View>
        </Card>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card>
          <TouchableOpacity style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.success + '20' }]}>
              <Ionicons name="cart" size={20} color={COLORS.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New order received</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Badge text="New" variant="success" size="small" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.warning + '20' }]}>
              <Ionicons name="water" size={20} color={COLORS.warning} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Irrigation reminder</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.info + '20' }]}>
              <Ionicons name="chatbubbles" size={20} color={COLORS.info} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New message from Kgagelo</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  weatherCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  weatherCondition: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
  },
  weatherIcon: {
    fontSize: 60,
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  weatherLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  viewAllLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  quickActionLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  cropCard: {
    width: 120,
    marginRight: SPACING.sm,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cropIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cropEmoji: {
    fontSize: 24,
  },
  cropName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  financialCard: {
    padding: SPACING.md,
  },
  financialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  financialLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  financialValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  profitIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  profitText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  activityTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default DashboardScreen;