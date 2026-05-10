import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, CROP_TYPES } from '../../constants/theme';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { getCrop, updateCrop, deleteCrop } from '../../services/firestoreService';
import { Crop } from '../../types';

interface CropDetailScreenProps {
  navigation: any;
  route: any;
}

const CropDetailScreen: React.FC<CropDetailScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { cropId } = route.params;
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrop();
  }, [cropId]);

  const loadCrop = async () => {
    try {
      const data = await getCrop(cropId);
      setCrop(data);
    } catch (error) {
      console.error('Error loading crop:', error);
      Alert.alert('Error', 'Failed to load crop details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Crop',
      'Are you sure you want to delete this crop record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCrop(cropId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete crop');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'success';
      case 'ready': return 'warning';
      case 'planted': return 'info';
      case 'harvested': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!crop) {
    return (
      <View style={styles.centerContainer}>
        <Text>Crop not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const cropTypeInfo = CROP_TYPES.find(c => c.id === crop.type);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddCrop', { cropId })}>
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={[styles.iconContainer, { backgroundColor: (cropTypeInfo?.color || COLORS.primary) + '20' }]}>
            <Text style={styles.emoji}>{cropTypeInfo?.icon || '🌱'}</Text>
          </View>
          <Text style={styles.cropName}>{crop.name}</Text>
          <Badge text={crop.status} variant={getStatusColor(crop.status) as any} />
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Card>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Planted</Text>
              <Text style={styles.infoValue}>
                {crop.plantingDate instanceof Date ? crop.plantingDate.toLocaleDateString() : crop.plantingDate}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Expected Harvest</Text>
              <Text style={styles.infoValue}>
                {crop.expectedHarvestDate instanceof Date ? crop.expectedHarvestDate.toLocaleDateString() : crop.expectedHarvestDate}
              </Text>
            </View>
          </View>
          <View style={[styles.infoRow, { marginTop: SPACING.md }]}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>{crop.quantity} {crop.unit}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{crop.type}</Text>
            </View>
          </View>
        </Card>

        {crop.irrigationSchedule || (crop.fertilizerReminders && crop.fertilizerReminders.length > 0) ? (
          <>
            <Text style={styles.sectionTitle}>Schedules & Reminders</Text>
            <Card>
              {crop.irrigationSchedule ? (
                <View style={styles.scheduleItem}>
                  <Ionicons name="water-outline" size={20} color={COLORS.primary} />
                  <View style={styles.scheduleText}>
                    <Text style={styles.scheduleLabel}>Irrigation</Text>
                    <Text style={styles.scheduleValue}>{crop.irrigationSchedule}</Text>
                  </View>
                </View>
              ) : null}
              {crop.fertilizerReminders && crop.fertilizerReminders.length > 0 ? (
                <View style={[styles.scheduleItem, { marginTop: crop.irrigationSchedule ? SPACING.md : 0 }]}>
                  <Ionicons name="flask-outline" size={20} color={COLORS.secondary} />
                  <View style={styles.scheduleText}>
                    <Text style={styles.scheduleLabel}>Fertilizers</Text>
                    <Text style={styles.scheduleValue}>{crop.fertilizerReminders.join(', ')}</Text>
                  </View>
                </View>
              ) : null}
            </Card>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Disease Reports</Text>
        {crop.diseaseReports && crop.diseaseReports.length > 0 ? (
          crop.diseaseReports.map((report, index) => (
            <Card key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportDate}>{new Date(report.date).toLocaleDateString()}</Text>
                <Badge 
                  text={report.severity} 
                  variant={report.severity === 'high' ? 'error' : report.severity === 'medium' ? 'warning' : 'info'} 
                  size="small" 
                />
              </View>
              <Text style={styles.reportDesc}>{report.description}</Text>
              <View style={styles.reportFooter}>
                <Ionicons 
                  name={report.treated ? "checkmark-circle" : "alert-circle"} 
                  size={16} 
                  color={report.treated ? COLORS.success : COLORS.warning} 
                />
                <Text style={[styles.reportStatus, { color: report.treated ? COLORS.success : COLORS.warning }]}>
                  {report.treated ? 'Treated' : 'Requires Attention'}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No disease reports recorded.</Text>
            <Button title="Report Disease" variant="outline" size="small" style={{ marginTop: SPACING.sm }} />
          </Card>
        )}

        {crop.notes ? (
          <>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Card>
              <Text style={styles.notesText}>{crop.notes}</Text>
            </Card>
          </>
        ) : null}

        <View style={styles.actions}>
          {crop.status !== 'harvested' && (
            <Button 
              title="Mark as Harvested" 
              onPress={() => {
                Alert.alert('Harvest', 'Mark this crop as harvested?', [
                  { text: 'Cancel' },
                  { text: 'Harvest', onPress: () => updateCrop(cropId, { status: 'harvested', actualHarvestDate: new Date() }).then(loadCrop) }
                ])
              }} 
              fullWidth 
              style={{ marginBottom: SPACING.md }}
            />
          )}
          <Button 
            title="Delete Record" 
            variant="outline" 
            onPress={handleDelete} 
            fullWidth 
            style={{ borderColor: COLORS.error }}
            titleStyle={{ color: COLORS.error }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: SPACING.xl },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  content: { padding: SPACING.lg },
  heroSection: { alignItems: 'center', marginBottom: SPACING.xl },
  iconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  emoji: { fontSize: 40 },
  cropName: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  scheduleItem: { flexDirection: 'row', alignItems: 'center' },
  scheduleText: { marginLeft: SPACING.md },
  scheduleLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  scheduleValue: { fontSize: FONT_SIZES.md, fontWeight: '500', color: COLORS.text },
  reportCard: { marginBottom: SPACING.sm },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  reportDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  reportDesc: { fontSize: FONT_SIZES.md, color: COLORS.text, marginBottom: SPACING.sm },
  reportFooter: { flexDirection: 'row', alignItems: 'center' },
  reportStatus: { fontSize: FONT_SIZES.sm, marginLeft: 4, fontWeight: '500' },
  emptyCard: { alignItems: 'center', padding: SPACING.lg },
  emptyText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  notesText: { fontSize: FONT_SIZES.md, color: COLORS.text, lineHeight: 22 },
  actions: { marginTop: SPACING.xxl, marginBottom: SPACING.xl },
});

export default CropDetailScreen;
