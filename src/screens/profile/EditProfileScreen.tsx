// Edit Profile Screen - Temo Thuo Market
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

interface EditProfileScreenProps { navigation: any; }

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({ displayName: "Mmakgono Morule", email: "mmakgono@farm.co.bw", phone: "+267 71 234 567", farmName: "Morule Farm", location: "Mogoditshane, Gaborone", bio: "" });
  
  const handleSave = () => { Alert.alert("Success", "Profile updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }]); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Button title="Save" onPress={handleSave} size="small" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Avatar name={formData.displayName} size="xlarge" />
          <TouchableOpacity style={styles.changePhoto}><Text style={styles.changePhotoText}>Change Photo</Text></TouchableOpacity>
        </View>
        <View style={styles.form}>
          <Input label="Full Name" value={formData.displayName} onChangeText={(v) => setFormData({ ...formData, displayName: v })} leftIcon="person-outline" />
          <Input label="Email" value={formData.email} onChangeText={(v) => setFormData({ ...formData, email: v })} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
          <Input label="Phone" value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: v })} leftIcon="call-outline" keyboardType="phone-pad" />
          <Input label="Farm Name" value={formData.farmName} onChangeText={(v) => setFormData({ ...formData, farmName: v })} leftIcon="leaf-outline" />
          <Input label="Location" value={formData.location} onChangeText={(v) => setFormData({ ...formData, location: v })} leftIcon="location-outline" />
          <Input label="Bio" value={formData.bio} onChangeText={(v) => setFormData({ ...formData, bio: v })} placeholder="Tell us about yourself..." multiline numberOfLines={3} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  avatarSection: { alignItems: "center", paddingVertical: SPACING.xl },
  changePhoto: { marginTop: SPACING.md },
  changePhotoText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: "500" },
  form: { padding: SPACING.lg },
});

export default EditProfileScreen;
