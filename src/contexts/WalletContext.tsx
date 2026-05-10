// Wallet Context - Global wallet state management

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { PaymentService, OrangeMoneyIntegration, CardPaymentIntegration } from '../services/paymentService';
import { Wallet, Transaction, PaymentMethod, PaymentRequest, PaymentResult } from '../types';

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  balance: number;
  // Wallet operations
  initializeWallet: () => Promise<void>;
  deposit: (amount: number, description: string, method: PaymentMethod) => Promise<Transaction>;
  withdraw: (amount: number, description: string, method: PaymentMethod) => Promise<Transaction>;
  makePayment: (amount: number, description: string, recipientId?: string) => Promise<Transaction>;
  receivePayment: (amount: number, description: string, senderId?: string) => Promise<Transaction>;
  // Payment methods
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
  // Payment processing
  processPayment: (request: PaymentRequest) => Promise<PaymentResult>;
  // Real-time updates
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const balance = wallet?.balance || 0;

  // Initialize wallet on mount
  useEffect(() => {
    if (user) {
      initializeWallet();
    }
  }, [user?.id]);

  // Subscribe to real-time transaction updates
  useEffect(() => {
    if (wallet?.id) {
      const unsubscribe = PaymentService.subscribeToTransactions(wallet.id, (newTransactions) => {
        setTransactions(newTransactions);
      });
      return unsubscribe;
    }
  }, [wallet?.id]);

  const initializeWallet = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get existing wallet
      let userWallet = await PaymentService.getWallet(user.id);
      
      // Create new wallet if doesn't exist
      if (!userWallet) {
        userWallet = await PaymentService.createWallet(user.id, 'BWP');
      }
      
      setWallet(userWallet);
      
      // Load transactions
      const txHistory = await PaymentService.getTransactions(userWallet.id);
      setTransactions(txHistory);
      
      // Load payment methods
      const methods = await PaymentService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize wallet');
    } finally {
      setLoading(false);
    }
  };

  const deposit = async (amount: number, description: string, method: PaymentMethod): Promise<Transaction> => {
    if (!wallet?.id) throw new Error('Wallet not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      // Process based on payment method type
      if (method.provider === 'orange_money') {
        const result = await OrangeMoneyIntegration.initiatePayment(amount, method.phoneNumber || '');
        if (result.status !== 'completed') {
          throw new Error('Orange Money payment not completed');
        }
      } else if (method.type === 'card') {
        const result = await CardPaymentIntegration.processPayment({
          number: method.last4 || '', // In production, would use tokenized card
          expMonth: '',
          expYear: '',
          cvv: '',
        }, amount);
        if (result.status !== 'completed') {
          throw new Error('Card payment not completed');
        }
      }
      
      // Create deposit transaction
      const transaction = await PaymentService.deposit(wallet.id, amount, description, method);
      setTransactions(prev => [transaction, ...prev]);
      
      // Update wallet balance locally
      setWallet(prev => prev ? { ...prev, balance: prev.balance + amount } : prev);
      
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: number, description: string, method: PaymentMethod): Promise<Transaction> => {
    if (!wallet?.id) throw new Error('Wallet not initialized');
    
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const transaction = await PaymentService.withdraw(wallet.id, amount, description, method);
      setTransactions(prev => [transaction, ...prev]);
      
      // Update wallet balance locally
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amount } : prev);
      
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (amount: number, description: string, recipientId?: string): Promise<Transaction> => {
    if (!wallet?.id) throw new Error('Wallet not initialized');
    
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const transaction = await PaymentService.makePayment(wallet.id, amount, description, recipientId);
      setTransactions(prev => [transaction, ...prev]);
      
      // Update wallet balance locally
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amount } : prev);
      
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const receivePayment = async (amount: number, description: string, senderId?: string): Promise<Transaction> => {
    if (!wallet?.id) throw new Error('Wallet not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const transaction = await PaymentService.receivePayment(wallet.id, amount, description, senderId);
      setTransactions(prev => [transaction, ...prev]);
      
      // Update wallet balance locally
      setWallet(prev => prev ? { ...prev, balance: prev.balance + amount } : prev);
      
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Receiving payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (method: PaymentMethod): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      await PaymentService.linkPaymentMethod(user.id, method);
      
      // Reload payment methods
      const methods = await PaymentService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePaymentMethod = async (methodId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await PaymentService.removePaymentMethod(methodId);
      
      // Update local state
      setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove payment method');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (methodId: string): Promise<void> => {
    // In production, would update in Firestore
    setPaymentMethods(prev => 
      prev.map(m => ({ ...m, isDefault: m.id === methodId }))
    );
  };

  const processPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const { amount, paymentMethod, description } = request;
      
      // Check wallet balance for wallet payments
      if (paymentMethod.type === 'wallet' || paymentMethod.provider === 'wallet') {
        if (balance < amount) {
          return {
            success: false,
            message: 'Insufficient wallet balance',
            error: 'INSUFFICIENT_BALANCE',
          };
        }
        
        const transaction = await makePayment(amount, description, request.recipientId);
        return {
          success: true,
          transactionId: transaction.id,
          message: 'Payment successful',
        };
      }
      
      // Process Orange Money
      if (paymentMethod.provider === 'orange_money') {
        const result = await OrangeMoneyIntegration.initiatePayment(
          amount,
          paymentMethod.phoneNumber || ''
        );
        
        if (result.status === 'completed') {
          return {
            success: true,
            transactionId: result.transactionId,
            message: 'Orange Money payment successful',
          };
        } else {
          return {
            success: false,
            transactionId: result.transactionId,
            message: 'Orange Money payment pending',
            error: 'PAYMENT_PENDING',
          };
        }
      }
      
      // Process card payment
      if (paymentMethod.type === 'card') {
        const result = await CardPaymentIntegration.processPayment({
          number: '', // Would be tokenized
          expMonth: '',
          expYear: '',
          cvv: '',
        }, amount);
        
        if (result.status === 'completed') {
          return {
            success: true,
            transactionId: result.transactionId,
            message: 'Card payment successful',
          };
        } else {
          return {
            success: false,
            transactionId: result.transactionId,
            message: 'Card payment pending',
            error: 'PAYMENT_PENDING',
          };
        }
      }
      
      return {
        success: false,
        message: 'Unsupported payment method',
        error: 'UNSUPPORTED_METHOD',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Payment failed',
        error: 'PAYMENT_ERROR',
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async (): Promise<void> => {
    if (!wallet?.id) return;
    
    try {
      setLoading(true);
      const txHistory = await PaymentService.getTransactions(wallet.id);
      setTransactions(txHistory);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        paymentMethods,
        loading,
        error,
        balance,
        initializeWallet,
        deposit,
        withdraw,
        makePayment,
        receivePayment,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        processPayment,
        refreshTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};