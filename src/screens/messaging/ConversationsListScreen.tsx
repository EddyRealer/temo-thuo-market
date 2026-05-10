// Conversations List Screen - Temo Thuo Market
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/theme";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";
import { getUserConversations } from "../../services/firestoreService";
import { useAuth } from "../../contexts/AuthContext";
import { Conversation } from "../../types";

interface ConversationsListScreenProps { navigation: any; }

const ConversationsListScreen: React.FC<ConversationsListScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      const data = await getUserConversations(user!.id);
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    // Participant name should be fetched based on the other participant
    const otherParticipantId = item.participants.find(p => p !== user?.id);
    const participantName = "Farmer / Buyer"; // In real app, fetch name from user doc
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem} 
        onPress={() => navigation.navigate("Chat", { 
          conversationId: item.id, 
          participantName,
          recipientId: otherParticipantId
        })}
      >
        <Avatar name={participantName} size="large" showOnlineIndicator />
        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, item.unreadCount > 0 && styles.unread]}>{participantName}</Text>
            <Text style={styles.conversationTime}>
              {item.lastMessageTime instanceof Date ? item.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
            </Text>
          </View>
          <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.unread]} numberOfLines={1}>
            {item.lastMessage?.content || "No messages yet"}
          </Text>
        </View>
        {item.unreadCount > 0 && <Badge text={item.unreadCount.toString()} variant="error" size="small" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity><Ionicons name="search" size={24} color={COLORS.text} /></TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList 
          data={conversations} 
          keyExtractor={item => item.id} 
          contentContainerStyle={styles.list} 
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No conversations yet. Connect with farmers and buyers on the marketplace!</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.xxl, fontWeight: "bold", color: COLORS.text },
  list: { paddingHorizontal: SPACING.lg },
  conversationItem: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  conversationInfo: { flex: 1, marginLeft: SPACING.md },
  conversationHeader: { flexDirection: "row", justifyContent: "space-between" },
  conversationName: { fontSize: FONT_SIZES.md, fontWeight: "500", color: COLORS.text },
  conversationTime: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  lastMessage: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  unread: { fontWeight: "700", color: COLORS.text },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: "center" },
});

export default ConversationsListScreen;
