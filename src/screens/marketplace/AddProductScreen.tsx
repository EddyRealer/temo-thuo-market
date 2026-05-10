import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MARKETPLACE_CATEGORIES } from "../../constants/theme";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import { useAuth } from "../../contexts/AuthContext";
import { addProduct } from "../../services/firestoreService";
import { Product, ProductCategory } from "../../types";

interface AddProductScreenProps { navigation: any; }

const AddProductScreen: React.FC<AddProductScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    quantity: "",
    unit: "kg",
    description: "",
    location: "",
  });

  const handleSave = async () => {
    if (!user) return;
    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!formData.title || !formData.price || !formData.quantity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        description: formData.description,
        category: selectedCategory as ProductCategory,
        price: parseFloat(formData.price),
        currency: "BWP",
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        photos: [], // In a real app, we'd upload photos to Storage first
        location: formData.location || user.farmLocation || "Unknown",
        deliveryOptions: ["Pickup"],
        status: "available",
      };

      await addProduct(user.id, user.displayName, productData);
      
      Alert.alert("Success", "Product listed successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to list product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>List New Product</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <Card><View style={styles.photoPlaceholder}><Ionicons name="camera-outline" size={40} color={COLORS.textLight} /><Text style={styles.photoText}>Tap to add photos</Text></View></Card>
        
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryGrid}>
          {MARKETPLACE_CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[
                styles.categoryItem,
                selectedCategory === cat.id && styles.categoryItemSelected
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[
                styles.categoryName,
                selectedCategory === cat.id && styles.categoryNameSelected
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Details</Text>
        <Card>
          <Input 
            label="Title" 
            placeholder="Product name" 
            leftIcon="pricetag-outline"
            value={formData.title}
            onChangeText={(v) => setFormData({...formData, title: v})}
          />
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input 
                label="Price (BWP)" 
                placeholder="0.00" 
                keyboardType="numeric" 
                leftIcon="cash-outline"
                value={formData.price}
                onChangeText={(v) => setFormData({...formData, price: v})}
              />
            </View>
            <View style={styles.flex1}>
              <Input 
                label="Quantity" 
                placeholder="0" 
                keyboardType="numeric" 
                leftIcon="scale-outline"
                value={formData.quantity}
                onChangeText={(v) => setFormData({...formData, quantity: v})}
              />
            </View>
          </View>
          <Input 
            label="Unit (e.g. kg, bag, head)" 
            placeholder="kg"
            value={formData.unit}
            onChangeText={(v) => setFormData({...formData, unit: v})}
          />
          <Input 
            label="Location" 
            placeholder="Pickup location" 
            leftIcon="location-outline"
            value={formData.location}
            onChangeText={(v) => setFormData({...formData, location: v})}
          />
          <Input 
            label="Description" 
            placeholder="Describe your product..." 
            multiline 
            numberOfLines={4}
            value={formData.description}
            onChangeText={(v) => setFormData({...formData, description: v})}
          />
        </Card>
        <Button 
          title={loading ? "Listing..." : "List Product"} 
          onPress={handleSave} 
          fullWidth 
          size="large" 
          disabled={loading}
          style={styles.saveButton} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  photoPlaceholder: { height: 150, backgroundColor: COLORS.surfaceSecondary, borderRadius: BORDER_RADIUS.lg, justifyContent: "center", alignItems: "center" },
  photoText: { color: COLORS.textSecondary, marginTop: SPACING.sm },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  categoryItem: { width: "31%", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  categoryItemSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + "10" },
  categoryIcon: { fontSize: 28, marginBottom: SPACING.xs },
  categoryName: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  categoryNameSelected: { color: COLORS.primary, fontWeight: "bold" },
  row: { flexDirection: "row", gap: SPACING.md },
  flex1: { flex: 1 },
  saveButton: { marginVertical: SPACING.xl },
});

export default AddProductScreen;
