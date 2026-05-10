// Firestore Service - Database operations for Temo Thuo Market

import { 
  getFirebaseDB 
} from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentSnapshot,
  QueryConstraint,
  DocumentData,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { Crop, Livestock, Product, Post, Comment, Message, Conversation, Notification, Transaction } from '../types';

// Helper to convert Firestore timestamps
const convertTimestamps = (data: DocumentData): DocumentData => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// ============ CROP OPERATIONS ============

export const addCrop = async (userId: string, cropData: Omit<Crop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Crop> => {
  const db = getFirebaseDB();
  const cropsRef = collection(db, 'crops');
  
  const docRef = await addDoc(cropsRef, {
    ...cropData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return { id: docRef.id, ...cropData, userId } as Crop;
};

export const updateCrop = async (cropId: string, data: Partial<Crop>): Promise<void> => {
  const db = getFirebaseDB();
  await updateDoc(doc(db, 'crops', cropId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCrop = async (cropId: string): Promise<void> => {
  const db = getFirebaseDB();
  await deleteDoc(doc(db, 'crops', cropId));
};

export const getCrop = async (cropId: string): Promise<Crop | null> => {
  const db = getFirebaseDB();
  const cropDoc = await getDoc(doc(db, 'crops', cropId));
  
  if (cropDoc.exists()) {
    return { id: cropDoc.id, ...convertTimestamps(cropDoc.data()) } as Crop;
  }
  return null;
};

export const getUserCrops = async (userId: string): Promise<Crop[]> => {
  const db = getFirebaseDB();
  const q = query(collection(db, 'crops'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Crop));
};

export const subscribeToUserCrops = (userId: string, callback: (crops: Crop[]) => void): (() => void) => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'crops'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, snapshot => {
    const crops = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Crop));
    callback(crops);
  });
};

// ============ LIVESTOCK OPERATIONS ============

export const addLivestock = async (userId: string, livestockData: Omit<Livestock, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Livestock> => {
  const db = getFirebaseDB();
  const livestockRef = collection(db, 'livestock');
  
  const docRef = await addDoc(livestockRef, {
    ...livestockData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return { id: docRef.id, ...livestockData, userId } as Livestock;
};

export const updateLivestock = async (livestockId: string, data: Partial<Livestock>): Promise<void> => {
  const db = getFirebaseDB();
  await updateDoc(doc(db, 'livestock', livestockId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteLivestock = async (livestockId: string): Promise<void> => {
  const db = getFirebaseDB();
  await deleteDoc(doc(db, 'livestock', livestockId));
};

export const getLivestock = async (livestockId: string): Promise<Livestock | null> => {
  const db = getFirebaseDB();
  const livestockDoc = await getDoc(doc(db, 'livestock', livestockId));
  
  if (livestockDoc.exists()) {
    return { id: livestockDoc.id, ...convertTimestamps(livestockDoc.data()) } as Livestock;
  }
  return null;
};

export const getUserLivestock = async (userId: string): Promise<Livestock[]> => {
  const db = getFirebaseDB();
  const q = query(collection(db, 'livestock'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Livestock));
};

export const subscribeToUserLivestock = (userId: string, callback: (livestock: Livestock[]) => void): (() => void) => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'livestock'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, snapshot => {
    const livestock = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Livestock));
    callback(livestock);
  });
};

// ============ PRODUCT/MARKETPLACE OPERATIONS ============

export const addProduct = async (sellerId: string, sellerName: string, productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const db = getFirebaseDB();
  const productsRef = collection(db, 'products');
  
  const docRef = await addDoc(productsRef, {
    ...productData,
    sellerId,
    sellerName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return { id: docRef.id, ...productData, sellerId, sellerName } as Product;
};

export const updateProduct = async (productId: string, data: Partial<Product>): Promise<void> => {
  const db = getFirebaseDB();
  await updateDoc(doc(db, 'products', productId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const db = getFirebaseDB();
  await deleteDoc(doc(db, 'products', productId));
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  const db = getFirebaseDB();
  const productDoc = await getDoc(doc(db, 'products', productId));
  
  if (productDoc.exists()) {
    return { id: productDoc.id, ...convertTimestamps(productDoc.data()) } as Product;
  }
  return null;
};

export const getProducts = async (
  filters?: {
    category?: string;
    sellerId?: string;
    status?: string;
  },
  sortBy?: { field: string; direction: 'asc' | 'desc' }
): Promise<Product[]> => {
  const db = getFirebaseDB();
  const constraints: QueryConstraint[] = [];
  
  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.sellerId) {
    constraints.push(where('sellerId', '==', filters.sellerId));
  }
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  if (sortBy) {
    constraints.push(orderBy(sortBy.field, sortBy.direction));
  } else {
    constraints.push(orderBy('createdAt', 'desc'));
  }
  
  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Product));
};

export const searchProducts = async (searchTerm: string, category?: string): Promise<Product[]> => {
  const db = getFirebaseDB();
  // Note: For full-text search, consider using Algolia or Firestore's array-contains
  const snapshot = await getDocs(collection(db, 'products'));
  
  const products = snapshot.docs
    .map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Product))
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  if (category) {
    return products.filter(p => p.category === category);
  }
  
  return products;
};

export const subscribeToProducts = (
  callback: (products: Product[]) => void,
  category?: string
): (() => void) => {
  const db = getFirebaseDB();
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (category) {
    constraints.unshift(where('status', '==', 'available'));
    constraints.unshift(where('category', '==', category));
  }
  
  const q = query(collection(db, 'products'), ...constraints);
  
  return onSnapshot(q, snapshot => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Product));
    callback(products);
  });
};

// ============ POST/SOCIAL OPERATIONS ============

export const createPost = async (
  userId: string,
  userName: string,
  userPhoto: string | undefined,
  content: string,
  photos?: string[],
  videoURL?: string
): Promise<Post> => {
  const db = getFirebaseDB();
  const postsRef = collection(db, 'posts');
  
  const docRef = await addDoc(postsRef, {
    userId,
    userName,
    userPhoto,
    content,
    photos,
    videoURL,
    likes: [],
    commentsCount: 0,
    sharesCount: 0,
    isTrending: false,
    createdAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    userId,
    userName,
    userPhoto,
    content,
    photos,
    videoURL,
    likes: [],
    commentsCount: 0,
    sharesCount: 0,
    isTrending: false,
    createdAt: new Date(),
  };
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  const db = getFirebaseDB();
  const postRef = doc(db, 'posts', postId);
  const postDoc = await getDoc(postRef);
  
  if (postDoc.exists()) {
    const likes = postDoc.data().likes || [];
    if (!likes.includes(userId)) {
      await updateDoc(postRef, { likes: [...likes, userId] });
    }
  }
};

export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  const db = getFirebaseDB();
  const postRef = doc(db, 'posts', postId);
  const postDoc = await getDoc(postRef);
  
  if (postDoc.exists()) {
    const likes = postDoc.data().likes || [];
    await updateDoc(postRef, { likes: likes.filter((id: string) => id !== userId) });
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  const db = getFirebaseDB();
  await deleteDoc(doc(db, 'posts', postId));
};

export const getPosts = async (limitCount: number = 50): Promise<Post[]> => {
  const db = getFirebaseDB();
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Post));
};

export const getTrendingPosts = async (): Promise<Post[]> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'posts'),
    where('isTrending', '==', true),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Post));
};

export const subscribeToPosts = (callback: (posts: Post[]) => void): (() => void) => {
  const db = getFirebaseDB();
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100));
  
  return onSnapshot(q, snapshot => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Post));
    callback(posts);
  });
};

export const subscribeToUserPosts = (userId: string, callback: (posts: Post[]) => void): (() => void) => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'posts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, snapshot => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Post));
    callback(posts);
  });
};

// ============ COMMENT OPERATIONS ============

export const addComment = async (
  postId: string,
  userId: string,
  userName: string,
  userPhoto: string | undefined,
  content: string,
  parentId?: string
): Promise<Comment> => {
  const db = getFirebaseDB();
  const commentsRef = collection(db, 'comments');
  
  const docRef = await addDoc(commentsRef, {
    postId,
    userId,
    userName,
    userPhoto,
    content,
    parentId,
    likes: [],
    createdAt: serverTimestamp(),
  });
  
  // Update comment count on post
  const postRef = doc(db, 'posts', postId);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    await updateDoc(postRef, { commentsCount: (postDoc.data().commentsCount || 0) + 1 });
  }
  
  return {
    id: docRef.id,
    postId,
    userId,
    userName,
    userPhoto,
    content,
    parentId,
    likes: [],
    replies: [],
    createdAt: new Date(),
  };
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Comment));
};

export const subscribeToPostComments = (postId: string, callback: (comments: Comment[]) => void): (() => void) => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, snapshot => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Comment));
    callback(comments);
  });
};

// ============ MESSAGING OPERATIONS ============

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
  type: 'text' | 'image' | 'voice' = 'text',
  imageURL?: string,
  voiceURL?: string
): Promise<Message> => {
  const db = getFirebaseDB();
  const messagesRef = collection(db, 'messages');
  
  const docRef = await addDoc(messagesRef, {
    conversationId,
    senderId,
    content,
    type,
    imageURL,
    voiceURL,
    readBy: [senderId],
    createdAt: serverTimestamp(),
  });
  
  // Update conversation last message
  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, {
    lastMessage: { content, senderId },
    lastMessageTime: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    conversationId,
    senderId,
    content,
    type,
    imageURL,
    voiceURL,
    readBy: [senderId],
    createdAt: new Date(),
  };
};

export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Message));
};

export const subscribeToConversationMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Message));
    callback(messages);
  });
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Conversation));
};

export const createConversation = async (participants: string[]): Promise<Conversation> => {
  const db = getFirebaseDB();
  const conversationsRef = collection(db, 'conversations');
  
  const docRef = await addDoc(conversationsRef, {
    participants,
    lastMessageTime: serverTimestamp(),
    unreadCount: 0,
  });
  
  return {
    id: docRef.id,
    participants,
    lastMessageTime: new Date(),
    unreadCount: 0,
  };
};

export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId)
  );
  const snapshot = await getDocs(q);
  
  const batch = snapshot.docs.map(doc => {
    const data = doc.data();
    if (!data.readBy.includes(userId)) {
      return updateDoc(doc.ref, { readBy: [...data.readBy, userId] });
    }
    return null;
  }).filter(Boolean);
  
  await Promise.all(batch);
  
  // Reset unread count
  await updateDoc(doc(db, 'conversations', conversationId), { unreadCount: 0 });
};

// ============ NOTIFICATION OPERATIONS ============

export const createNotification = async (
  userId: string,
  type: Notification['type'],
  title: string,
  body: string,
  data?: any
): Promise<Notification> => {
  const db = getFirebaseDB();
  const notificationsRef = collection(db, 'notifications');
  
  const docRef = await addDoc(notificationsRef, {
    userId,
    type,
    title,
    body,
    data,
    read: false,
    createdAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    userId,
    type,
    title,
    body,
    data,
    read: false,
    createdAt: new Date(),
  };
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Notification));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const db = getFirebaseDB();
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  
  const batch = snapshot.docs.map(doc => updateDoc(doc.ref, { read: true }));
  await Promise.all(batch);
};

export const subscribeToUserNotifications = (userId: string, callback: (notifications: Notification[]) => void): (() => void) => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, snapshot => {
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Notification));
    callback(notifications);
  });
};

// ============ TRANSACTION OPERATIONS ============

export const addTransaction = async (
  userId: string,
  transactionData: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction> => {
  const db = getFirebaseDB();
  const transactionsRef = collection(db, 'transactions');
  
  const docRef = await addDoc(transactionsRef, {
    ...transactionData,
    userId,
    createdAt: serverTimestamp(),
  });
  
  return { id: docRef.id, ...transactionData } as Transaction;
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const db = getFirebaseDB();
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Transaction));
};