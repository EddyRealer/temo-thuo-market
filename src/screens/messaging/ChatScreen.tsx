// Chat Screen - Temo Thuo Market
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants/theme";
import Avatar from "../../components/common/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { subscribeToConversationMessages, sendMessage as sendMessageService, markMessagesAsRead } from "../../services/firestoreService";
import { Message } from "../../types";

interface ChatScreenProps { navigation: any; route: any; }

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { participantName, conversationId, recipientId } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToConversationMessages(conversationId, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
      if (user) {
        markMessagesAsRead(conversationId, user.id);
      }
    });

    return () => unsubscribe();
  }, [conversationId, user]);

  const handleSend = async () => {
    if (!message.trim() || !user || !conversationId) return;
    
    const content = message.trim();
    setMessage("");
    
    try {
      await sendMessageService(conversationId, user.id, content);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSent = item.senderId === user?.id;
    
    return (
      <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={[styles.messageText, isSent && styles.sentText]}>{item.content}</Text>
        <Text style={[styles.messageTime, isSent && styles.sentTime]}>
          {item.createdAt instanceof Date ? item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Sent"}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top }]} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Avatar name={participantName} size="small" />
        </View>
        <Text style={styles.headerTitle}>{participantName}</Text>
        <TouchableOpacity><Ionicons name="call" size={22} color={COLORS.text} /></TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList 
          ref={flatListRef} 
          data={messages} 
          keyExtractor={item => item.id} 
          contentContainerStyle={styles.messagesList} 
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}
      
      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}>
        <TouchableOpacity style={styles.attachButton}><Ionicons name="image" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
        <TextInput 
          style={styles.textInput} 
          value={message} 
          onChangeText={setMessage} 
          placeholder="Type a message..." 
          placeholderTextColor={COLORS.textLight}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatarContainer: { marginLeft: SPACING.sm },
  headerTitle: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text, marginLeft: SPACING.sm },
  messagesList: { padding: SPACING.lg },
  messageBubble: { maxWidth: "80%", padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm },
  sentBubble: { alignSelf: "flex-end", backgroundColor: COLORS.primary },
  receivedBubble: { alignSelf: "flex-start", backgroundColor: COLORS.surface },
  messageText: { fontSize: FONT_SIZES.md, color: COLORS.text },
  sentText: { color: COLORS.white },
  messageTime: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: SPACING.xs, alignSelf: "flex-end" },
  sentTime: { color: COLORS.white },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  attachButton: { padding: SPACING.xs },
  textInput: { flex: 1, backgroundColor: COLORS.surfaceSecondary, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginHorizontal: SPACING.sm, fontSize: FONT_SIZES.md, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  sendButtonDisabled: { backgroundColor: COLORS.textLight },
});

export default ChatScreen;
