import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const AdminDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1240,
    activeListings: 450,
    pendingReports: 12,
    totalSales: 154000,
  });

  useEffect(() => {
    // Simulate fetching admin stats
    setTimeout(() => setLoading(false), 800);
  }, []);

  const adminModules = [
    { id: 'users', title: 'User Management', icon: 'people-outline', color: COLORS.primary, count: stats.totalUsers },
    { id: 'market', title: 'Market Moderation', icon: 'cart-outline', color: COLORS.success, count: stats.activeListings },
    { id: 'reports', title: 'Report Handling', icon: 'flag-outline', color: COLORS.error, count: stats.pendingReports },
    { id: 'payments', title: 'Payment Monitoring', icon: 'cash-outline', color: COLORS.warning, count: 'P' + stats.totalSales.toLocaleString() },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.grid}>
          {adminModules.map((module) => (
            <TouchableOpacity 
              key={module.id} 
              style={styles.gridItem}
              onPress={() => {}}
            >
              <Card style={styles.moduleCard}>
                <View style={[styles.iconContainer, { backgroundColor: module.color + '15' }]}>
                  <Ionicons name={module.icon as any} size={28} color={module.color} />
                </View>
                <Text style={styles.moduleValue}>{module.count}</Text>
                <Text style={styles.moduleTitle}>{module.title}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: COLORS.success }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New user registered: <Text style={styles.bold}>Lesedi Farm</Text></Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: COLORS.warning }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New product listing: <Text style={styles.bold}>Brahman Bull</Text></Text>
              <Text style={styles.activityTime}>15 minutes ago</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: COLORS.error }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Reported content: <Text style={styles.bold}>Post #8821</Text></Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>System Health</Text>
        <Card>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>Database Status</Text>
            <Badge text="Optimal" variant="success" size="small" />
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>Messaging Server</Text>
            <Badge text="Running" variant="success" size="small" />
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>Storage Usage</Text>
            <Text style={styles.healthValue}>42%</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  content: { padding: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: SPACING.md },
  moduleCard: { alignItems: 'center', padding: SPACING.lg },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  moduleValue: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text },
  moduleTitle: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginRight: SPACING.md },
  activityContent: { flex: 1 },
  activityText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
  bold: { fontWeight: '600' },
  activityTime: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  healthLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  healthValue: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text },
});

export default AdminDashboardScreen;
