import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Avatar from "../../components/common/Avatar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const user = {
    name: "Mmakgono Morule",
    email: "mmakgono@farm.co.bw",
    role: "Farmer",
    farmName: "Morule Farm",
    location: "Mogoditshane, Gaborone",
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Avatar name={user.name} size="xlarge" />

          <Text style={styles.userName}>{user.name}</Text>

          <Text style={styles.userRole}>{user.role}</Text>

          <Text style={styles.userFarm}>{user.farmName}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: SPACING.md,
},
        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
            variant="outline"
            fullWidth
          />
        </View>

        <Text style={styles.sectionTitle}>My Content</Text>

        <Card>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MyProducts")}
          >
            <Ionicons
              name="storefront-outline"
              size={22}
              color={COLORS.primary}
            />

            <Text style={styles.menuText}>My Products</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MyPosts")}
          >
            <Ionicons
              name="document-text-outline"
              size={22}
              color={COLORS.primary}
            />

            <Text style={styles.menuText}>My Posts</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("SavedItems")}
          >
            <Ionicons
              name="bookmark-outline"
              size={22}
              color={COLORS.primary}
            />

            <Text style={styles.menuText}>Saved Items</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>Farm Details</Text>

        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farm Name</Text>
            <Text style={styles.infoValue}>{user.farmName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{user.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </Card>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
  },

  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },

  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: SPACING.md,
  },

  userRole: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },

  userFarm: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  statItem: {
    alignItems: "center",
  },

  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
  },

  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  actions: {
    padding: SPACING.lg,
  },

  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },

  menuText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },

  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },

    infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: "500",
  },
});

export default ProfileScreen;
  },
});
menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md },
                                                                                     ^
export default ProfileScreen;
