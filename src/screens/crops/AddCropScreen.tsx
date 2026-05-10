// Add Crop Screen - Temo Thuo Market

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, CROP_TYPES } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { addCrop, getCrop, updateCrop } from '../../services/firestoreService';
import { Crop, CropType } from '../../types';

interface AddCropScreenProps {
  navigation: any;
  route: any;
}

const AddCropScreen: React.FC<AddCropScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const cropId = route.params?.cropId;
  const isEditing = !!cropId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [formData, setFormData] = useState({
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvest: '',
    quantity: '',
    unit: 'kg',
    notes: '',
    status: 'planted' as Crop['status'],
    irrigationSchedule: '',
    fertilizerReminders: '',
  });

  useEffect(() => {
    if (isEditing) {
      loadCropData();
    }
  }, [isEditing]);

  const loadCropData = async () => {
    try {
      const crop = await getCrop(cropId);
      if (crop) {
        setSelectedCrop(crop.type);
        setFormData({
          plantingDate: crop.plantingDate instanceof Date ? crop.plantingDate.toISOString().split('T')[0] : (crop.plantingDate as any),
          expectedHarvest: crop.expectedHarvestDate instanceof Date ? crop.expectedHarvestDate.toISOString().split('T')[0] : (crop.expectedHarvestDate as any),
          quantity: crop.quantity.toString(),
          unit: crop.unit,
          notes: crop.notes || '',
          status: crop.status,
          irrigationSchedule: crop.irrigationSchedule || '',
          fertilizerReminders: crop.fertilizerReminders?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Error loading crop:', error);
      Alert.alert('Error', 'Failed to load crop data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!selectedCrop) {
      Alert.alert('Error', 'Please select a crop type');
      return;
    }

    setSaving(true);
    try {
      const cropData: Omit<Crop, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        type: selectedCrop as CropType,
        name: CROP_TYPES.find(c => c.id === selectedCrop)?.name || selectedCrop,
        plantingDate: new Date(formData.plantingDate),
        expectedHarvestDate: new Date(formData.expectedHarvest || new Date()),
        quantity: parseFloat(formData.quantity) || 0,
        unit: formData.unit,
        status: formData.status,
        notes: formData.notes,
        irrigationSchedule: formData.irrigationSchedule,
        fertilizerReminders: formData.fertilizerReminders.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (isEditing) {
        await updateCrop(cropId, cropData);
        Alert.alert('Success', 'Crop updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await addCrop(user.id, cropData);
        Alert.alert('Success', 'Crop added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error saving crop:', error);
      Alert.alert('Error', 'Failed to save crop');
    } finally {
      setSaving(false);
    }
  };

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
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Crop' : 'Add New Crop'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Select Crop Type</Text>
        <View style={styles.cropGrid}>
          {CROP_TYPES.map(crop => (
            <TouchableOpacity
              key={crop.id}
              style={[
                styles.cropOption,
                selectedCrop === crop.id && styles.cropOptionSelected,
              ]}
              onPress={() => setSelectedCrop(crop.id)}
            >
              <View style={[styles.cropIcon, { backgroundColor: crop.color + '20' }]}>
                <Text style={styles.cropEmoji}>{crop.icon}</Text>
              </View>
              <Text style={[
                styles.cropName,
                selectedCrop === crop.id && styles.cropNameSelected,
              ]}>
                {crop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Crop Details</Text>
        <Card>
          <Input
            label="Planting Date"
            value={formData.plantingDate}
            onChangeText={(v) => setFormData({ ...formData, plantingDate: v })}
            placeholder="YYYY-MM-DD"
            leftIcon="calendar-outline"
          />
          <Input
            label="Expected Harvest"
            value={formData.expectedHarvest}
            onChangeText={(v) => setFormData({ ...formData, expectedHarvest: v })}
            placeholder="YYYY-MM-DD"
            leftIcon="calendar-outline"
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Quantity"
                value={formData.quantity}
                onChangeText={(v) => setFormData({ ...formData, quantity: v })}
                placeholder="0"
                keyboardType="numeric"
                leftIcon="scale-outline"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Unit"
                value={formData.unit}
                onChangeText={(v) => setFormData({ ...formData, unit: v })}
                placeholder="kg"
              />
            </View>
          </View>
          <Input
            label="Notes"
            value={formData.notes}
            onChangeText={(v) => setFormData({ ...formData, notes: v })}
            placeholder="Add any additional notes..."
            multiline
            numberOfLines={3}
          />
        </Card>

        <Text style={styles.sectionTitle}>Reminders & Schedules</Text>
        <Card>
          <Input
            label="Irrigation Schedule"
            value={formData.irrigationSchedule}
            onChangeText={(v) => setFormData({ ...formData, irrigationSchedule: v })}
            placeholder="e.g. Every morning at 6 AM"
            leftIcon="water-outline"
          />
          <Input
            label="Fertilizer (comma separated)"
            value={formData.fertilizerReminders}
            onChangeText={(v) => setFormData({ ...formData, fertilizerReminders: v })}
            placeholder="e.g. NPK 15-15-15, Urea"
            leftIcon="flask-outline"
          />
        </Card>

        <Button
          title={saving ? "Saving..." : (isEditing ? "Update Crop" : "Save Crop")}
          onPress={handleSave}
          fullWidth
          size="large"
          disabled={saving}
          style={styles.saveButton}
        />
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cropOption: {
    width: '31%',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.transparent,
  },
  cropOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
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
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cropNameSelected: {
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    marginVertical: SPACING.xl,
  },
});

export default AddCropScreen;