import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useCart } from '../../contexts/CartContext';

interface CheckoutScreenProps {
  navigation: any;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { totalAmount, clearCart } = useCart();

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Placed',
      'Your order has been placed successfully. The seller will be notified.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            clearCart();
            navigation.navigate('MarketplaceHome');
          } 
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Card>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.addressText}>Main Farm, Mogoditshane, Gaborone</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Card>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="wallet-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.paymentText}>Orange Money (P520.00 balance)</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Card>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>P{totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>P0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>P{totalAmount.toLocaleString()}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={`Pay P${totalAmount.toLocaleString()}`} 
          onPress={handlePlaceOrder} 
          fullWidth 
          size="large" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  content: { padding: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  addressText: { marginLeft: SPACING.md, fontSize: FONT_SIZES.md, color: COLORS.text },
  paymentText: { marginLeft: SPACING.md, fontSize: FONT_SIZES.md, color: COLORS.text },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  summaryValue: { fontSize: FONT_SIZES.md, color: COLORS.text, fontWeight: '500' },
  totalRow: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
  footer: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
});

export default CheckoutScreen;
