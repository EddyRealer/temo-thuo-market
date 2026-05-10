// Post Detail Screen - Temo Thuo Market
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants/theme";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../contexts/AuthContext";
import { getPosts, subscribeToPostComments, addComment, likePost, unlikePost } from "../../services/firestoreService";
import { Post, Comment } from "../../types";

interface PostDetailScreenProps { navigation: any; route: any; }

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ navigation, route }) => {
  const { postId, focusComment } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
    const unsubscribe = subscribeToPostComments(postId, (fetchedComments) => {
      setComments(fetchedComments);
    });
    return () => unsubscribe();
  }, [postId]);

  const loadPost = async () => {
    try {
      const allPosts = await getPosts();
      const foundPost = allPosts.find(p => p.id === postId);
      if (foundPost) setPost(foundPost);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;
    const isLiked = post.likes.includes(user.id);
    try {
      if (isLiked) {
        await unlikePost(post.id, user.id);
        setPost({ ...post, likes: post.likes.filter(id => id !== user.id) });
      } else {
        await likePost(post.id, user.id);
        setPost({ ...post, likes: [...post.likes, user.id] });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(postId, user.id, user.displayName, user.photoURL, commentText.trim());
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centerContainer}>
        <Text>Post not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const isLiked = user ? post.likes.includes(user.id) : false;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} /></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Avatar uri={post.userPhoto} name={post.userName} size="medium" />
            <View style={styles.postHeaderInfo}>
              <Text style={styles.userName}>{post.userName}</Text>
              <Text style={styles.postTime}>
                {post.createdAt instanceof Date ? post.createdAt.toLocaleDateString() : "Recently"}
              </Text>
            </View>
          </View>
          <Text style={styles.postText}>{post.content}</Text>
          {post.photos && post.photos.length > 0 && (
            <View style={styles.imagePlaceholder}><Ionicons name="image" size={60} color={COLORS.textLight} /></View>
          )}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={isLiked ? COLORS.error : COLORS.textSecondary} 
              />
              <Text style={styles.actionText}>{post.likes.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={22} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>{post.commentsCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Avatar uri={comment.userPhoto} name={comment.userName} size="small" />
              <View style={styles.commentBubble}>
                <Text style={styles.commentUserName}>{comment.userName}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.commentInputRow}>
            <Input 
              placeholder="Write a comment..." 
              value={commentText}
              onChangeText={setCommentText}
              style={styles.flex1}
              autoFocus={focusComment}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]} 
              onPress={handleAddComment}
              disabled={!commentText.trim() || submitting}
            >
              {submitting ? <ActivityIndicator size="small" color={COLORS.white} /> : <Ionicons name="send" size={20} color={COLORS.white} />}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  postContent: { padding: SPACING.lg },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.md },
  postHeaderInfo: { marginLeft: SPACING.sm },
  userName: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text },
  postTime: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  postText: { fontSize: FONT_SIZES.md, color: COLORS.text, lineHeight: 22 },
  imagePlaceholder: { height: 200, backgroundColor: COLORS.surfaceSecondary, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md, justifyContent: "center", alignItems: "center" },
  actions: { flexDirection: "row", marginTop: SPACING.lg, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: SPACING.xl },
  actionText: { marginLeft: SPACING.xs, fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  commentsSection: { padding: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  commentsTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text, marginBottom: SPACING.md },
  commentItem: { flexDirection: "row", marginBottom: SPACING.md },
  commentBubble: { flex: 1, marginLeft: SPACING.sm, backgroundColor: COLORS.surfaceSecondary, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md },
  commentUserName: { fontSize: FONT_SIZES.sm, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  commentText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
  commentInputRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.md },
  flex1: { flex: 1 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginLeft: SPACING.sm },
  sendButtonDisabled: { backgroundColor: COLORS.textLight },
});

export default PostDetailScreen;
