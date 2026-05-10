// Wallet Screen - Temo Thuo Market
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants/theme";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

interface WalletScreenProps { navigation: any; }

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const balance = 12500;
  const transactions = [
    { id: "1", type: "received", amount: 4500, description: "Maize sale - Kgagelo", date: "Today" },
    { id: "2", type: "payment", amount: -1200, description: "Fertilizer purchase", date: "Yesterday" },
    { id: "3", type: "received", amount: 2800, description: "Tomatoes order - Green Valley", date: "2 days ago" },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.balanceCard} variant="elevated">
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>P{balance.toLocaleString()}</Text>
          <View style={styles.balanceActions}>
            <Button title="Add Money" onPress={() => {}} size="small" style={styles.balanceButton} />
            <Button title="Withdraw" onPress={() => {}} variant="outline" size="small" style={styles.balanceButton} />
          </View>
        </Card>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <Card>
          <TouchableOpacity style={styles.paymentMethod}><Ionicons name="phone-portrait" size={24} color="#F57C00" /><Text style={styles.paymentName}>Orange Money</Text><Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.paymentMethod}><Ionicons name="card" size={24} color="#1976D2" /><Text style={styles.paymentName}>Visa/Mastercard</Text><Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} /></TouchableOpacity>
        </Card>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Card>
          {transactions.map((tx, i) => (
            <View key={tx.id} style={[styles.transactionItem, i < transactions.length - 1 && styles.transactionBorder]}>
              <View style={[styles.txIcon, { backgroundColor: tx.amount > 0 ? COLORS.success + "20" : COLORS.error + "20" }]}>
                <Ionicons name={tx.amount > 0 ? "arrow-down" : "arrow-up"} size={18} color={tx.amount > 0 ? COLORS.success : COLORS.error} />
              </View>
              <View style={styles.txInfo}><Text style={styles.txDesc}>{tx.description}</Text><Text style={styles.txDate}>{tx.date}</Text></View>
              <Text style={[styles.txAmount, { color: tx.amount > 0 ? COLORS.success : COLORS.error }]}>P{Math.abs(tx.amount).toLocaleString()}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  balanceCard: { margin: SPACING.lg, backgroundColor: COLORS.primary, padding: SPACING.xl },
  balanceLabel: { fontSize: FONT_SIZES.sm, color: COLORS.white, opacity: 0.8 },
  balanceAmount: { fontSize: 48, fontWeight: "bold", color: COLORS.white, marginTop: SPACING.xs },
  balanceActions: { flexDirection: "row", gap: SPACING.md, marginTop: SPACING.lg },
  balanceButton: { flex: 1 },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
  paymentMethod: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md },
  paymentName: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text, marginLeft: SPACING.md },
  transactionItem: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  transactionBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  txInfo: { flex: 1, marginLeft: SPACING.md },
  txDesc: { fontSize: FONT_SIZES.md, color: COLORS.text },
  txDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  txAmount: { fontSize: FONT_SIZES.md, fontWeight: "600" },
});

export default WalletScreen;
