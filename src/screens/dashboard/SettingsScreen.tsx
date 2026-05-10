import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../contexts/LanguageContext";

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(t.auth.logout, "Are you sure you want to logout?", [
      { text: t.common.cancel, style: "cancel" },
      { text: t.auth.logout, style: "destructive", onPress: async () => { await logout(); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settings.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
        <Text style={styles.sectionTitle}>{t.settings.account}</Text>
        <Card>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("EditProfile")}>
            <Ionicons name="person-outline" size={22} color={COLORS.text} /><Text style={styles.menuText}>{t.profile.editProfile}</Text><Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>{t.settings.changeLanguage}</Text>
        <Card>
          <TouchableOpacity style={styles.menuItem} onPress={() => setLanguage('en')}>
            <Ionicons name="language-outline" size={22} color={COLORS.text} />
            <Text style={styles.menuText}>English</Text>
            {language === 'en' && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => setLanguage('tn')}>
            <Ionicons name="language-outline" size={22} color={COLORS.text} />
            <Text style={styles.menuText}>Setswana</Text>
            {language === 'tn' && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>{t.settings.notifications}</Text>
        <Card>
          <View style={styles.toggleItem}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} /><Text style={styles.menuText}>Push Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: COLORS.primary }} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{t.settings.help}</Text>
        <Card>
          <TouchableOpacity style={styles.menuItem}><Ionicons name="help-circle-outline" size={22} color={COLORS.text} /><Text style={styles.menuText}>Help Center</Text><Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Ionicons name="document-text-outline" size={22} color={COLORS.text} /><Text style={styles.menuText}>Terms of Service</Text><Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} /></TouchableOpacity>
        </Card>

        <View style={styles.logoutSection}>
          <Button title={t.auth.logout} onPress={handleLogout} variant="outline" fullWidth style={{ borderColor: COLORS.error }} titleStyle={{ color: COLORS.error }} />
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.textSecondary, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md },
  menuText: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text, marginLeft: SPACING.md },
  toggleItem: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm, paddingRight: SPACING.sm },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 40 },
  logoutSection: { padding: SPACING.lg, marginTop: SPACING.lg },
  version: { textAlign: "center", fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xl },
});

export default SettingsScreen;
