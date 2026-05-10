// Authentication Service for Temo Thuo Market
// Comprehensive Firebase Auth operations with phone/email OTP support

import {
  getFirebaseAuth,
  getFirebaseDB
} from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  ConfirmationResult,
  ApplicationVerifier,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  updatePhoneNumber,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { User, LoginCredentials, RegisterData, UserRole } from '../types';

// ============ ERROR MAPPING ============
const AUTH_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-phone-number': 'Please enter a valid phone number',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/code-expired': 'The verification code has expired. Please request a new one',
  'auth/invalid-verification-code': 'Invalid verification code. Please try again',
  'auth/credential-already-in-use': 'This credential is already linked to another account',
  'auth/user-disabled': 'This account has been disabled',
};

export const getAuthErrorMessage = (code: string): string => {
  return AUTH_ERRORS[code] || 'An error occurred. Please try again';
};

// ============ EMAIL AUTHENTICATION ============

// Register with email and password
export const registerWithEmail = async (data: RegisterData): Promise<User> => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDB();

  const { user: firebaseUser } = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  const userData: User = {
    id: firebaseUser.uid,
    email: data.email,
    phoneNumber: data.phoneNumber,
    displayName: data.displayName,
    role: data.role,
    farmName: data.farmName,
    farmLocation: data.farmLocation,
    createdAt: new Date(),
    updatedAt: new Date(),
    followersCount: 0,
    followingCount: 0,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);

  return userData;
};

// Login with email and password
export const loginWithEmail = async (credentials: LoginCredentials): Promise<User> => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDB();

  const { user: firebaseUser } = await signInWithEmailAndPassword(
    auth,
    credentials.email!,
    credentials.password
  );

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }

  return { id: userDoc.id, ...userDoc.data() } as User;
};

// Login with phone and password (when user already has phone-linked account)
export const loginWithPhone = async (phone: string, password: string): Promise<User> => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDB();

  // Find user by phone number
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('phoneNumber', '==', phone));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('No account found with this phone number');
  }

  // For phone login, we need the email to sign in
  // This is a simplified flow - in production, would use phone auth
  const userData = snapshot.docs[0].data();

  if (!userData.email) {
    throw new Error('Please use OTP to sign in with this phone number');
  }

  const { user: firebaseUser } = await signInWithEmailAndPassword(
    auth,
    userData.email,
    password
  );

  return { id: firebaseUser.uid, ...userData } as User;
};

// ============ PHONE AUTHENTICATION ============

// Initialize reCAPTCHA verifier for phone auth
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const getRecaptchaVerifier = (container: HTMLElement | string): RecaptchaVerifier => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), container, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, can proceed with phone auth
      },
      'expired-callback': () => {
        // reCAPTCHA expired, need to reload
        recaptchaVerifier = null;
      },
    });
  }
  return recaptchaVerifier;
};

// Send phone OTP for verification (signup or login)
export const sendPhoneOTP = async (
  phoneNumber: string,
  verifier?: ApplicationVerifier
): Promise<ConfirmationResult> => {
  const auth = getFirebaseAuth();

  // Format phone number for Botswana (+267)
  const formattedPhone = formatPhoneNumber(phoneNumber);

  const appVerifier = verifier || getRecaptchaVerifier('recaptcha-container');

  const confirmation = await PhoneAuthProvider.prototype.verifyPhoneNumber(
    formattedPhone,
    appVerifier
  );

  return confirmation as unknown as ConfirmationResult;
};

// Verify phone OTP
export const verifyPhoneOTP = async (
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<User> => {
  const db = getFirebaseDB();

  const { user: firebaseUser } = await confirmationResult.confirm(otp);

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  // Create new user if doesn't exist (first time phone login)
  const userData: User = {
    id: firebaseUser.uid,
    email: '',
    phoneNumber: firebaseUser.phoneNumber || '',
    displayName: '',
    role: 'farmer',
    createdAt: new Date(),
    updatedAt: new Date(),
    followersCount: 0,
    followingCount: 0,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);

  return userData;
};

// Send OTP for password reset (phone-based reset)
export const sendPhoneOTPForPasswordReset = async (
  phoneNumber: string
): Promise<ConfirmationResult> => {
  const auth = getFirebaseAuth();
  const formattedPhone = formatPhoneNumber(phoneNumber);

  const appVerifier = getRecaptchaVerifier('recaptcha-container');

  const confirmation = await PhoneAuthProvider.prototype.verifyPhoneNumber(
    formattedPhone,
    appVerifier
  );

  return confirmation as unknown as ConfirmationResult;
};

// Verify OTP and reset password
export const verifyOTPAndResetPassword = async (
  confirmationResult: ConfirmationResult,
  otp: string,
  newPassword: string
): Promise<void> => {
  const { user: firebaseUser } = await confirmationResult.confirm(otp);

  // Update password
  await updatePassword(firebaseUser, newPassword);
};

// ============ EMAIL OTP AUTHENTICATION ============

// Send email OTP for verification
export const sendEmailOTP = async (email: string): Promise<string> => {
  // In production, this would use Firebase Cloud Functions to send email
  // For now, return a mock OTP code
  const db = getFirebaseDB();

  // Check if email exists
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error('Email already registered');
  }

  // Generate mock OTP (in production, this would be sent via email)
  const otp = generateOTP();

  // Store OTP in Firestore (with expiration)
  await setDoc(doc(db, 'emailOtps', email), {
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    createdAt: serverTimestamp(),
  });

  // In production, send email via Cloud Function
  console.log(`OTP for ${email}: ${otp}`);

  return otp;
};

// Verify email OTP
export const verifyEmailOTP = async (
  email: string,
  otp: string
): Promise<{ verified: boolean; error?: string }> => {
  const db = getFirebaseDB();
  const otpDoc = await getDoc(doc(db, 'emailOtps', email));

  if (!otpDoc.exists()) {
    return { verified: false, error: 'OTP not found. Please request a new one.' };
  }

  const otpData = otpDoc.data();

  // Check expiration
  if (otpData.expiresAt.toDate() < new Date()) {
    return { verified: false, error: 'OTP has expired. Please request a new one.' };
  }

  // Check OTP match
  if (otpData.otp !== otp) {
    return { verified: false, error: 'Invalid OTP. Please try again.' };
  }

  // Delete used OTP
  await deleteDoc(doc(db, 'emailOtps', email));

  return { verified: true };
};

// ============ PASSWORD RESET ============

// Reset password via email
export const resetPassword = async (email: string): Promise<void> => {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
};

// ============ SESSION MANAGEMENT ============

// Re-authenticate user (required before sensitive operations)
export const reauthenticateUser = async (user: any, password: string): Promise<void> => {
  const auth = getFirebaseAuth();
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
};

// ============ USER PROFILE OPERATIONS ============

// Create user with role
export const createUserWithRole = async (
  firebaseUser: any,
  data: {
    displayName: string;
    role: UserRole;
    phoneNumber?: string;
    farmName?: string;
    farmLocation?: string;
  }
): Promise<User> => {
  const db = getFirebaseDB();

  const userData: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    phoneNumber: data.phoneNumber || firebaseUser.phoneNumber || '',
    displayName: data.displayName,
    role: data.role,
    farmName: data.farmName,
    farmLocation: data.farmLocation,
    createdAt: new Date(),
    updatedAt: new Date(),
    followersCount: 0,
    followingCount: 0,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);

  return userData;
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  const db = getFirebaseDB();
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: new Date(),
  });
};

// Get user data
export const getUserData = async (userId: string): Promise<User | null> => {
  const db = getFirebaseDB();
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  return null;
};

// Check if email exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  // This would require Firebase Auth REST API or a callable function
  // For now, check in Firestore
  const db = getFirebaseDB();
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// ============ ONLINE STATUS ============

// Set user online status
export const setUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  const db = getFirebaseDB();
  await updateDoc(doc(db, 'users', userId), {
    isOnline,
    lastSeen: new Date(),
  });
};

// ============ USER DELETION ============

// Delete user account
export const deleteUserAccount = async (userId: string): Promise<void> => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDB();

  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }

  // Also delete user document from Firestore
  await deleteDoc(doc(db, 'users', userId));
};

// ============ HELPERS ============

// Format phone number for Botswana
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If starts with +267, keep it
  if (phone.startsWith('+267')) {
    return phone;
  }

  // If starts with 0, replace with +267
  if (digits.startsWith('0')) {
    return `+267${digits.substring(1)}`;
  }

  // If it's 7 digits, add +267
  if (digits.length === 7) {
    return `+267${digits}`;
  }

  // Otherwise just add + if not present
  return phone.startsWith('+') ? phone : `+${digits}`;
};

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============ AUTH STATE HELPERS ============

// Get current authenticated user
export const getCurrentUser = () => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const auth = getFirebaseAuth();
  return !!auth.currentUser;
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  await signOut(auth);
};

// Link phone number to existing account
export const linkPhoneNumber = async (
  user: any,
  phoneNumber: string,
  verifier: ApplicationVerifier
): Promise<ConfirmationResult> => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const confirmation = await linkWithPhoneNumber(user, formattedPhone, verifier);
  return confirmation;
};

// Update user email
export const updateUserEmail = async (user: any, newEmail: string): Promise<void> => {
  await updateEmail(user, newEmail);
};

// Update user password
export const updateUserPassword = async (user: any, newPassword: string): Promise<void> => {
  await updatePassword(user, newPassword);
};

// ============ EXPORT DEFAULT ============
export default {
  registerWithEmail,
  loginWithEmail,
  loginWithPhone,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  verifyEmailOTP,
  resetPassword,
  sendPhoneOTPForPasswordReset,
  verifyOTPAndResetPassword,
  createUserWithRole,
  updateUserProfile,
  getUserData,
  checkEmailExists,
  setUserOnlineStatus,
  deleteUserAccount,
  signOutUser,
  getCurrentUser,
  isAuthenticated,
  linkPhoneNumber,
  updateUserEmail,
  updateUserPassword,
  getRecaptchaVerifier,
  getAuthErrorMessage,
};