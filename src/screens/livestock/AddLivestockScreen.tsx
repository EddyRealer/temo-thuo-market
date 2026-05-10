// Add Livestock Screen - Temo Thuo Market

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, LIVESTOCK_TYPES } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

interface AddLivestockScreenProps {
  navigation: any;
}

const AddLivestockScreen: React.FC<AddLivestockScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    tagNumber: '',
    breed: '',
    weight: '',
    dateOfBirth: '',
    purchasePrice: '',
    notes: '',
  });

  const handleSave = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a livestock type');
      return;
    }
    Alert.alert('Success', 'Livestock added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Livestock</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Select Type</Text>
        <View style={styles.typeGrid}>
          {LIVESTOCK_TYPES.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeOption,
                selectedType === type.id && styles.typeOptionSelected,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                <Text style={styles.typeEmoji}>{type.icon}</Text>
              </View>
              <Text style={[
                styles.typeName,
                selectedType === type.id && styles.typeNameSelected,
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Details</Text>
        <Card>
          <Input
            label="Name/Identifier"
            value={formData.name}
            onChangeText={(v) => setFormData({ ...formData, name: v })}
            placeholder="e.g., Cow #001"
            leftIcon="paw-outline"
          />
          <Input
            label="Tag Number"
            value={formData.tagNumber}
            onChangeText={(v) => setFormData({ ...formData, tagNumber: v })}
            placeholder="e.g., BT-2024-001"
            leftIcon="pricetag-outline"
          />
          <Input
            label="Breed"
            value={formData.breed}
            onChangeText={(v) => setFormData({ ...formData, breed: v })}
            placeholder="e.g., Brahman"
            leftIcon="help-outline"
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Weight (kg)"
                value={formData.weight}
                onChangeText={(v) => setFormData({ ...formData, weight: v })}
                placeholder="0"
                keyboardType="numeric"
                leftIcon="scale-outline"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChangeText={(v) => setFormData({ ...formData, dateOfBirth: v })}
                placeholder="YYYY-MM-DD"
                leftIcon="calendar-outline"
              />
            </View>
          </View>
          <Input
            label="Purchase Price (P)"
            value={formData.purchasePrice}
            onChangeText={(v) => setFormData({ ...formData, purchasePrice: v })}
            placeholder="0"
            keyboardType="numeric"
            leftIcon="cash-outline"
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChangeText={(v) => setFormData({ ...formData, notes: v })}
            placeholder="Add any additional notes..."
            multiline
            numberOfLines={3}
          />
        </Card>

        <Button
          title="Save Livestock"
          onPress={handleSave}
          fullWidth
          size="large"
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeOption: {
    width: '31%',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.transparent,
  },
  typeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  typeNameSelected: {
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

export default AddLivestockScreen;