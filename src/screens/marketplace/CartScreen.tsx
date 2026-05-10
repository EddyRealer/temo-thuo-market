// Cart Screen - Temo Thuo Market
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useCart } from "../../contexts/CartContext";

interface CartScreenProps { navigation: any; }

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <EmptyState 
          icon="cart-outline"
          title="Your cart is empty"
          message="Browse the marketplace and add items to your cart"
          actionLabel="Go to Marketplace"
          onAction={() => navigation.navigate("Marketplace")}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList 
        data={items} 
        keyExtractor={item => item.product.id} 
        contentContainerStyle={styles.list} 
        renderItem={({ item }) => (
          <Card style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.product.title}</Text>
              <Text style={styles.itemSeller}>{item.product.sellerName}</Text>
              <Text style={styles.itemPrice}>P{item.product.price.toLocaleString()}</Text>
            </View>
            <View style={styles.rightSection}>
              <TouchableOpacity 
                onPress={() => removeFromCart(item.product.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={18} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )} 
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>P{totalAmount.toLocaleString()}</Text>
        </View>
        <Button 
          title="Proceed to Checkout" 
          onPress={() => navigation.navigate("Checkout")} 
          fullWidth 
          size="large" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  list: { padding: SPACING.lg },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.md },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text },
  itemSeller: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  itemPrice: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.primary, marginTop: SPACING.xs },
  rightSection: { alignItems: "flex-end" },
  removeButton: { marginBottom: SPACING.sm },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  qtyButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceSecondary, justifyContent: "center", alignItems: "center" },
  qtyText: { fontSize: FONT_SIZES.md, fontWeight: "600", marginHorizontal: SPACING.md },
  footer: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.md },
  totalLabel: { fontSize: FONT_SIZES.lg, color: COLORS.text },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: "bold", color: COLORS.primary },
});

export default CartScreen;
