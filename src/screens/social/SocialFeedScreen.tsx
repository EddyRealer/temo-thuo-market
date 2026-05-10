// Social Feed Screen - Temo Thuo Market
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import { subscribeToPosts, likePost, unlikePost } from "../../services/firestoreService";
import { useAuth } from "../../contexts/AuthContext";
import { Post } from "../../types";

interface SocialFeedScreenProps { navigation: any; }

const SocialFeedScreen: React.FC<SocialFeedScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (post: Post) => {
    if (!user) return;
    const isLiked = post.likes.includes(user.id);
    try {
      if (isLiked) {
        await unlikePost(post.id, user.id);
      } else {
        await likePost(post.id, user.id);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const isLiked = user ? item.likes.includes(user.id) : false;
    
    return (
      <Card style={styles.postCard} onPress={() => navigation.navigate("PostDetail", { postId: item.id })}>
        <View style={styles.postHeader}>
          <Avatar uri={item.userPhoto} name={item.userName} size="medium" />
          <View style={styles.postHeaderInfo}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.postTime}>
              {item.createdAt instanceof Date ? item.createdAt.toLocaleDateString() : "Just now"}
            </Text>
          </View>
        </View>
        <Text style={styles.postContent}>{item.content}</Text>
        
        {item.photos && item.photos.length > 0 && (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
          </View>
        )}

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item)}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={22} 
              color={isLiked ? COLORS.error : COLORS.textSecondary} 
            />
            <Text style={styles.actionText}>{item.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate("PostDetail", { postId: item.id, focusComment: true })}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>{item.commentsCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Weather")}>
          <Ionicons name="sunny-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList 
          data={posts} 
          keyExtractor={item => item.id} 
          contentContainerStyle={styles.feedList} 
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet. Be the first to share something!</Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreatePost")}>
        <Ionicons name="create" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.xxl, fontWeight: "bold", color: COLORS.text },
  feedList: { padding: SPACING.lg },
  postCard: { marginBottom: SPACING.md },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.md },
  postHeaderInfo: { marginLeft: SPACING.sm },
  userName: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text },
  postTime: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  postContent: { fontSize: FONT_SIZES.md, color: COLORS.text, lineHeight: 22, marginBottom: SPACING.md },
  imagePlaceholder: { height: 200, backgroundColor: COLORS.surfaceSecondary, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md, justifyContent: "center", alignItems: "center" },
  postActions: { flexDirection: "row", borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: SPACING.lg },
  actionText: { marginLeft: SPACING.xs, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  fab: { position: "absolute", bottom: SPACING.lg, right: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", elevation: 4 },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: "center" },
});

export default SocialFeedScreen;
