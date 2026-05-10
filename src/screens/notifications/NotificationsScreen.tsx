// Notifications Screen - Temo Thuo Market
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

interface NotificationsScreenProps { navigation: any; }

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const notifications = [
    { id: "1", type: "marketplace", title: "New Order!", body: "Kgagelo ordered 5 bags of maize", time: "5m ago", read: false },
    { id: "2", type: "weather", title: "Rain Alert", body: "Heavy rain expected tomorrow", time: "1h ago", read: false },
    { id: "3", type: "message", title: "New Message", body: "From Mmakgalo Farm", time: "2h ago", read: true },
    { id: "4", type: "livestock", title: "Vaccination Due", body: "Cattle #001 needs vaccination", time: "1d ago", read: true },
  ];

  const getIcon = (type: string) => {
    switch (type) { case "marketplace": return "cart"; case "weather": return "cloud"; case "message": return "chatbubbles"; case "livestock": return "paw"; default: return "notifications"; }
  };
  const getColor = (type: string) => {
    switch (type) { case "marketplace": return COLORS.success; case "weather": return COLORS.info; case "message": return COLORS.primary; case "livestock": return COLORS.secondary; default: return COLORS.textSecondary; }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} /></TouchableOpacity>
      </View>
      <FlatList data={notifications} keyExtractor={item => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (
        <Card style={[styles.notificationCard, !item.read && styles.unreadCard]} onPress={() => {}}>
          <View style={[styles.iconContainer, { backgroundColor: getColor(item.type) + "20" }]}>
            <Ionicons name={getIcon(item.type) as any} size={22} color={getColor(item.type)} />
          </View>
          <View style={styles.notificationInfo}>
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationTitle, !item.read && styles.unreadText]}>{item.title}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            <Text style={styles.notificationBody}>{item.body}</Text>
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </Card>
      )} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  list: { padding: SPACING.lg },
  notificationCard: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm" },
  unreadCard: { backgroundColor: COLORS.primary + "08" },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: SPACING.md },
  notificationInfo: { flex: 1 },
  notificationHeader: { flexDirection: "row", justifyContent: "space-between" },
  notificationTitle: { fontSize: FONT_SIZES.md, fontWeight: "500", color: COLORS.text },
  unreadText: { fontWeight: "700" },
  notificationTime: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  notificationBody: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
});

export default NotificationsScreen;
