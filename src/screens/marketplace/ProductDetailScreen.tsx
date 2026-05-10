import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { getProduct } from "../../services/firestoreService";
import { Product } from "../../types";
import { useCart } from "../../contexts/CartContext";

interface ProductDetailScreenProps { 
  navigation: any; 
  route: any;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      Alert.alert("Success", "Product added to cart", [
        { text: "View Cart", onPress: () => navigation.navigate("Cart") },
        { text: "Continue Shopping" }
      ]);
    }
  };

  const loadProduct = async () => {
    try {
      const data = await getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text>Product not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Product Details</Text>
        <TouchableOpacity><Ionicons name="share-outline" size={24} color={COLORS.text} /></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imagePlaceholder}>
          {product.photos && product.photos.length > 0 ? (
            <Text>Image here</Text>
          ) : (
            <Ionicons name="image-outline" size={80} color={COLORS.textLight} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>P{product.price.toLocaleString()} <Text style={styles.unit}>/ {product.unit}</Text></Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color={COLORS.warning} />
            <Text style={styles.rating}>{product.rating || 0} ({product.reviewCount || 0} reviews)</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || "No description provided."}</Text>
          
          <Text style={styles.sectionTitle}>Seller Info</Text>
          <Card>
            <TouchableOpacity 
              style={styles.sellerRow}
              onPress={() => navigation.navigate("Profile", { userId: product.sellerId })}
            >
              <View style={styles.sellerAvatar}>
                <Ionicons name="person" size={24} color={COLORS.white} />
              </View>
              <View>
                <Text style={styles.sellerName}>{product.sellerName}</Text>
                <Text style={styles.sellerLocation}>{product.location}</Text>
              </View>
            </TouchableOpacity>
          </Card>
          
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.deliveryRow}>
            {product.deliveryOptions.map((option, index) => (
              <View key={index} style={styles.deliveryChip}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                <Text style={styles.deliveryText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
           <Text style={styles.stockText}>In Stock: {product.quantity} {product.unit}</Text>
        </View>
        <View style={styles.buttonRow}>
          <Button 
            title="Message Seller" 
            onPress={() => navigation.navigate("Chat", { recipientId: product.sellerId, recipientName: product.sellerName })} 
            variant="outline"
            style={styles.flex1}
          />
          <View style={{ width: SPACING.md }} />
          <Button 
            title="Add to Cart" 
            onPress={handleAddToCart} 
            style={styles.flex1}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text, flex: 1, textAlign: "center" },
  imagePlaceholder: { height: 300, backgroundColor: COLORS.surfaceSecondary, justifyContent: "center", alignItems: "center" },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: "bold", color: COLORS.text },
  price: { fontSize: FONT_SIZES.xl, fontWeight: "bold", color: COLORS.primary, marginTop: SPACING.xs },
  unit: { fontSize: FONT_SIZES.md, fontWeight: "normal", color: COLORS.textSecondary },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.sm },
  rating: { marginLeft: SPACING.xs, color: COLORS.textSecondary },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  description: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 22 },
  sellerRow: { flexDirection: "row", alignItems: "center" },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginRight: SPACING.md },
  sellerName: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text },
  sellerLocation: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  deliveryRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  deliveryChip: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surfaceSecondary, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 16 },
  deliveryText: { marginLeft: 4, fontSize: FONT_SIZES.sm, color: COLORS.text },
  footer: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  quantityContainer: { marginBottom: SPACING.md },
  stockText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  buttonRow: { flexDirection: "row" },
  flex1: { flex: 1 },
});

export default ProductDetailScreen;
