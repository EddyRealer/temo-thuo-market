// Payment Service - Payment operations for Temo Thuo Market

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
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { Transaction, Wallet, PaymentMethod } from '../types';

// ============ PAYMENT SERVICE ============

export const PaymentService = {
  // Get user wallet
  getWallet: async (userId: string): Promise<Wallet | null> => {
    const db = getFirebaseDB();
    const q = query(collection(db, 'wallets'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Wallet;
    }
    return null;
  },

  // Create wallet for user
  createWallet: async (userId: string, currency: string = 'BWP'): Promise<Wallet> => {
    const db = getFirebaseDB();
    const walletRef = await addDoc(collection(db, 'wallets'), {
      userId,
      balance: 0,
      currency,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      id: walletRef.id,
      userId,
      balance: 0,
      currency,
      transactions: [],
    };
  },

  // Add money to wallet (deposit)
  deposit: async (walletId: string, amount: number, description: string, paymentMethod: PaymentMethod): Promise<Transaction> => {
    const db = getFirebaseDB();
    
    // Create transaction record
    const txRef = await addDoc(collection(db, 'transactions'), {
      walletId,
      type: 'deposit',
      amount,
      description,
      paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Update wallet balance (in production, this would be in a transaction)
    const walletDoc = await getDoc(doc(db, 'wallets', walletId));
    if (walletDoc.exists()) {
      const currentBalance = walletDoc.data().balance || 0;
      await updateDoc(doc(db, 'wallets', walletId), {
        balance: currentBalance + amount,
        updatedAt: serverTimestamp(),
      });
    }

    // Update transaction status to completed
    await updateDoc(doc(db, 'transactions', txRef.id), {
      status: 'completed',
    });

    return {
      id: txRef.id,
      type: 'deposit',
      amount,
      currency: 'BWP',
      description,
      status: 'completed',
      createdAt: new Date(),
    };
  },

  // Withdraw from wallet
  withdraw: async (walletId: string, amount: number, description: string, paymentMethod: PaymentMethod): Promise<Transaction> => {
    const db = getFirebaseDB();
    
    // Check balance first
    const walletDoc = await getDoc(doc(db, 'wallets', walletId));
    if (walletDoc.exists()) {
      const currentBalance = walletDoc.data().balance || 0;
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }
    }

    // Create transaction record
    const txRef = await addDoc(collection(db, 'transactions'), {
      walletId,
      type: 'withdrawal',
      amount: -amount,
      description,
      paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Update wallet balance
    await updateDoc(doc(db, 'wallets', walletId), {
      balance: (walletDoc.data().balance || 0) - amount,
      updatedAt: serverTimestamp(),
    });

    // Update transaction status
    await updateDoc(doc(db, 'transactions', txRef.id), {
      status: 'completed',
    });

    return {
      id: txRef.id,
      type: 'withdrawal',
      amount: -amount,
      currency: 'BWP',
      description,
      status: 'completed',
      createdAt: new Date(),
    };
  },

  // Make payment
  makePayment: async (walletId: string, amount: number, description: string, recipientId?: string): Promise<Transaction> => {
    const db = getFirebaseDB();
    
    // Check balance
    const walletDoc = await getDoc(doc(db, 'wallets', walletId));
    if (walletDoc.exists()) {
      const currentBalance = walletDoc.data().balance || 0;
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }
    }

    // Create transaction
    const txRef = await addDoc(collection(db, 'transactions'), {
      walletId,
      type: 'payment',
      amount: -amount,
      description,
      recipientId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Update wallet balance
    await updateDoc(doc(db, 'wallets', walletId), {
      balance: (walletDoc.data().balance || 0) - amount,
      updatedAt: serverTimestamp(),
    });

    // Update transaction status
    await updateDoc(doc(db, 'transactions', txRef.id), {
      status: 'completed',
    });

    return {
      id: txRef.id,
      type: 'payment',
      amount: -amount,
      currency: 'BWP',
      description,
      status: 'completed',
      createdAt: new Date(),
    };
  },

  // Receive payment
  receivePayment: async (walletId: string, amount: number, description: string, senderId?: string): Promise<Transaction> => {
    const db = getFirebaseDB();
    
    // Create transaction
    const txRef = await addDoc(collection(db, 'transactions'), {
      walletId,
      type: 'received',
      amount,
      description,
      senderId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Update wallet balance
    const walletDoc = await getDoc(doc(db, 'wallets', walletId));
    await updateDoc(doc(db, 'wallets', walletId), {
      balance: (walletDoc.data().balance || 0) + amount,
      updatedAt: serverTimestamp(),
    });

    // Update transaction status
    await updateDoc(doc(db, 'transactions', txRef.id), {
      status: 'completed',
    });

    return {
      id: txRef.id,
      type: 'received',
      amount,
      currency: 'BWP',
      description,
      status: 'completed',
      createdAt: new Date(),
    };
  },

  // Get transaction history
  getTransactions: async (walletId: string, limitCount: number = 50): Promise<Transaction[]> => {
    const db = getFirebaseDB();
    const q = query(
      collection(db, 'transactions'),
      where('walletId', '==', walletId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const transactions: Transaction[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        type: data.type,
        amount: data.amount,
        currency: data.currency || 'BWP',
        description: data.description,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    
    return transactions;
  },

  // Subscribe to transaction updates (real-time)
  subscribeToTransactions: (walletId: string, callback: (transactions: Transaction[]) => void): (() => void) => {
    const db = getFirebaseDB();
    const q = query(
      collection(db, 'transactions'),
      where('walletId', '==', walletId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactions: Transaction[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: data.type,
          amount: data.amount,
          currency: data.currency || 'BWP',
          description: data.description,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      callback(transactions);
    });

    return unsubscribe;
  },

  // Link payment method
  linkPaymentMethod: async (userId: string, method: PaymentMethod): Promise<void> => {
    const db = getFirebaseDB();
    await addDoc(collection(db, 'paymentMethods'), {
      userId,
      type: method.type,
      provider: method.provider,
      last4: method.last4,
      isDefault: method.isDefault || false,
      status: 'active',
      createdAt: serverTimestamp(),
    });
  },

  // Get payment methods
  getPaymentMethods: async (userId: string): Promise<PaymentMethod[]> => {
    const db = getFirebaseDB();
    const q = query(
      collection(db, 'paymentMethods'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    
    const methods: PaymentMethod[] = [];
    snapshot.forEach(doc => {
      methods.push({
        id: doc.id,
        type: doc.data().type,
        provider: doc.data().provider,
        last4: doc.data().last4,
        isDefault: doc.data().isDefault,
      });
    });
    
    return methods;
  },

  // Remove payment method
  removePaymentMethod: async (methodId: string): Promise<void> => {
    const db = getFirebaseDB();
    await updateDoc(doc(db, 'paymentMethods', methodId), {
      status: 'removed',
      removedAt: serverTimestamp(),
    });
  },
};

// ============ PAYMENT INTEGRATION PLACEHOLDERS ============

export const OrangeMoneyIntegration = {
  // Initiate Orange Money payment
  initiatePayment: async (amount: number, phone: string): Promise<{ transactionId: string; status: string }> => {
    // In production, this would call Orange Money API
    // For now, return mock response
    return {
      transactionId: `OM_${Date.now()}`,
      status: 'pending',
    };
  },

  // Check payment status
  checkPaymentStatus: async (transactionId: string): Promise<{ status: string; message: string }> => {
    // In production, this would check Orange Money API
    return {
      status: 'completed',
      message: 'Payment successful',
    };
  },

  // Verify phone number for payment
  verifyPhone: async (phone: string): Promise<boolean> => {
    // In production, this would verify with Orange Money
    return phone.startsWith('+267') || phone.startsWith('07');
  },
};

export const CardPaymentIntegration = {
  // Process card payment (Visa/Mastercard)
  processPayment: async (cardDetails: {
    number: string;
    expMonth: string;
    expYear: string;
    cvv: string;
  }, amount: number): Promise<{ transactionId: string; status: string }> => {
    // In production, this would integrate with payment gateway (Stripe, etc.)
    // For now, return mock response
    return {
      transactionId: `CARD_${Date.now()}`,
      status: 'pending',
    };
  },

  // Validate card
  validateCard: async (cardNumber: string): Promise<{ valid: boolean; type: 'visa' | 'mastercard' | 'unknown' }> => {
    // Basic card validation
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return { valid: true, type: 'visa' };
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return { valid: true, type: 'mastercard' };
    }
    
    return { valid: false, type: 'unknown' };
  },

  // Tokenize card for secure storage
  tokenizeCard: async (cardDetails: {
    number: string;
    expMonth: string;
    expYear: string;
  }): Promise<string> => {
    // In production, this would tokenize with payment provider
    return `tok_${Date.now()}`;
  },
};

export default PaymentService;