// Marketplace Screen - Temo Thuo Market
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, MARKETPLACE_CATEGORIES } from "../../constants/theme";
import SearchBar from "../../components/common/SearchBar";
import Card from "../../components/common/Card";
import Chip from "../../components/common/Chip";
import { subscribeToProducts } from "../../services/firestoreService";
import { Product } from "../../types";

interface MarketplaceScreenProps { navigation: any; }

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((fetchedProducts) => {
      setProducts(fetchedProducts);
      setLoading(false);
    }, selectedCategory || undefined);

    return () => unsubscribe();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.productCard} onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}>
      <View style={styles.productImagePlaceholder}>
        <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productSeller} numberOfLines={1}>{item.sellerName}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>P{item.price.toLocaleString()}</Text>
          <Text style={styles.productUnit}>/ {item.unit}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={COLORS.warning} />
          <Text style={styles.ratingText}>{item.rating || 0}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={24} color={COLORS.text} />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>0</Text></View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search products..." style={styles.searchBar} />
        <TouchableOpacity style={styles.filterButton}><Ionicons name="options-outline" size={24} color={COLORS.text} /></TouchableOpacity>
      </View>
      <View style={styles.categoriesContainer}>
        <FlatList horizontal showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: "All", icon: "apps" }, ...MARKETPLACE_CATEGORIES]}
          keyExtractor={item => item.id || "all"}
          renderItem={({ item }) => (
            <Chip label={item.name} icon={item.icon} selected={selectedCategory === item.id} onPress={() => setSelectedCategory(item.id)} style={styles.categoryChip} />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList 
          data={filteredProducts} 
          renderItem={renderProduct} 
          keyExtractor={item => item.id} 
          numColumns={2} 
          contentContainerStyle={styles.productsList} 
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddProduct")}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.xxl, fontWeight: "bold", color: COLORS.text },
  cartButton: { position: "relative" },
  cartBadge: { position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.error, justifyContent: "center", alignItems: "center" },
  cartBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  searchBar: { flex: 1 },
  filterButton: { width: 48, height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  categoriesContainer: { marginTop: SPACING.md },
  categoriesList: { paddingHorizontal: SPACING.lg },
  categoryChip: { marginRight: SPACING.sm },
  productsList: { padding: SPACING.lg },
  productCard: { flex: 1, margin: SPACING.xs, maxWidth: "48%" },
  productImagePlaceholder: { height: 100, backgroundColor: COLORS.surfaceSecondary, borderTopLeftRadius: BORDER_RADIUS.lg, borderTopRightRadius: BORDER_RADIUS.lg, justifyContent: "center", alignItems: "center" },
  productInfo: { padding: SPACING.sm },
  productTitle: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text, marginBottom: 2 },
  productSeller: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  productFooter: { flexDirection: "row", alignItems: "baseline" },
  productPrice: { fontSize: FONT_SIZES.md, fontWeight: "bold", color: COLORS.primary },
  productUnit: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginLeft: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: SPACING.xs },
  ratingText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginLeft: 4 },
  fab: { position: "absolute", bottom: SPACING.lg, right: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", elevation: 4 },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
});

export default MarketplaceScreen;
