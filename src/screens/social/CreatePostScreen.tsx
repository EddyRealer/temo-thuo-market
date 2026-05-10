// Create Post Screen - Temo Thuo Market
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants/theme";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../contexts/AuthContext";
import { createPost } from "../../services/firestoreService";

interface CreatePostScreenProps { navigation: any; }

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!user) return;
    if (!content.trim()) {
      Alert.alert("Error", "Please write something");
      return;
    }

    setLoading(true);
    try {
      await createPost(
        user.id,
        user.displayName,
        user.photoURL,
        content.trim(),
        [], // photos
        undefined // videoURL
      );
      
      Alert.alert("Success", "Post created successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <Button 
          title={loading ? "Post..." : "Post"} 
          onPress={handlePost} 
          size="small" 
          disabled={loading}
        />
      </View>
      <View style={styles.content}>
        <Input 
          placeholder="What's happening on your farm?" 
          value={content} 
          onChangeText={setContent} 
          multiline 
          numberOfLines={10} 
          style={styles.textInput} 
          autoFocus
        />
        <View style={styles.mediaActions}>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="image" size={24} color={COLORS.primary} />
            <Text style={styles.mediaText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="videocam" size={24} color={COLORS.primary} />
            <Text style={styles.mediaText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="location" size={24} color={COLORS.primary} />
            <Text style={styles.mediaText}>Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  content: { flex: 1, padding: SPACING.lg },
  textInput: { flex: 1, textAlignVertical: "top" },
  mediaActions: { flexDirection: "row", justifyContent: "space-around", paddingVertical: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  mediaButton: { alignItems: "center" },
  mediaText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
});

export default CreatePostScreen;
