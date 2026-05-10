// Forgot Password Screen - Temo Thuo Market
// Enhanced with phone/email OTP verification flow

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { resetPassword, sendPhoneOTPForPasswordReset, verifyOTPAndResetPassword, sendEmailOTP, verifyEmailOTP } from '../../services/authService';

type ResetMethod = 'email' | 'phone';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Reset method toggle
  const [resetMethod, setResetMethod] = useState<ResetMethod>('email');

  // Email flow
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailStep, setEmailStep] = useState<'email' | 'otp' | 'password'>('email');

  // Phone flow
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate email format
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setErrors({ email: 'Email is required' });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setErrors({ email: 'Please enter a valid email' });
      return false;
    }
    setErrors({});
    return true;
  };

  // Validate phone format
  const validatePhone = (value: string): boolean => {
    if (!value) {
      setErrors({ phone: 'Phone number is required' });
      return false;
    } else if (value.length < 8) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return false;
    }
    setErrors({});
    return true;
  };

  // Validate password
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setErrors({ password: 'Password is required' });
      return false;
    } else if (value.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return false;
    }
    return true;
  };

  // ============ EMAIL RESET FLOW ============

  const handleSendEmailOTP = async () => {
    if (!validateEmail(email)) return;

    setLoading(true);
    try {
      await sendEmailOTP(email);
      setEmailStep('otp');
      Alert.alert('OTP Sent', `Verification code sent to ${email}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp || emailOtp.length < 6) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmailOTP(email, emailOtp);
      if (result.verified) {
        setEmailStep('password');
      } else {
        setErrors({ otp: result.error || 'Invalid OTP' });
      }
    } catch (err: any) {
      setErrors({ otp: err.message || 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithEmail = async () => {
    if (!validatePassword(newPassword)) return;
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // ============ PHONE RESET FLOW ============

  const handleSendPhoneOTP = async () => {
    if (!validatePhone(phone)) return;

    setLoading(true);
    try {
      const result = await sendPhoneOTPForPasswordReset(phone);
      setConfirmationResult(result);
      setPhoneStep('otp');
      Alert.alert('OTP Sent', `Verification code sent to ${phone}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp || phoneOtp.length < 6) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(phoneOtp);
        setPhoneStep('password');
      } else {
        setErrors({ otp: 'Session expired. Please request a new code.' });
      }
    } catch (err: any) {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithPhone = async () => {
    if (!validatePassword(newPassword)) return;
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      if (confirmationResult) {
        await verifyOTPAndResetPassword(confirmationResult, phoneOtp, newPassword);
        Alert.alert('Success', 'Password reset successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // ============ RENDER EMAIL SUCCESS ============
  if (emailStep === 'password' && resetMethod === 'email') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="key-outline" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Set New Password</Text>
          <Text style={styles.successMessage}>
            Enter your new password below
          </Text>

          <View style={styles.form}>
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.confirmPassword}
              required
            />

            <Button
              title="Reset Password"
              onPress={handleResetWithEmail}
              loading={loading}
              fullWidth
              size="large"
              style={styles.resetButton}
            />
          </View>
        </View>
      </View>
    );
  }

  // ============ RENDER PHONE SUCCESS ============
  if (phoneStep === 'password' && resetMethod === 'phone') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="key-outline" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Set New Password</Text>
          <Text style={styles.successMessage}>
            Enter your new password below
          </Text>

          <View style={styles.form}>
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.confirmPassword}
              required
            />

            <Button
              title="Reset Password"
              onPress={handleResetWithPhone}
              loading={loading}
              fullWidth
              size="large"
              style={styles.resetButton}
            />
          </View>
        </View>
      </View>
    );
  }

  // ============ MAIN RENDER ============
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.lg }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="key-outline" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.message}>
            Choose how you want to reset your password
          </Text>

          {/* Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodTab, resetMethod === 'email' && styles.methodTabActive]}
              onPress={() => {
                setResetMethod('email');
                setPhoneStep('phone');
                setPhoneOtp('');
              }}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={resetMethod === 'email' ? COLORS.white : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.methodTabText,
                  resetMethod === 'email' && styles.methodTabTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodTab, resetMethod === 'phone' && styles.methodTabActive]}
              onPress={() => {
                setResetMethod('phone');
                setEmailStep('email');
                setEmailOtp('');
              }}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={resetMethod === 'phone' ? COLORS.white : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.methodTabText,
                  resetMethod === 'phone' && styles.methodTabTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email Reset Form */}
          {resetMethod === 'email' && emailStep === 'email' && (
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({});
                }}
                placeholder="Enter your email"
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                required
              />

              <Button
                title="Send Reset Link"
                onPress={handleSendEmailOTP}
                loading={loading}
                fullWidth
                size="large"
                style={styles.sendButton}
              />
            </View>
          )}

          {resetMethod === 'email' && emailStep === 'otp' && (
            <View style={styles.form}>
              <Text style={styles.stepTitle}>Enter Verification Code</Text>
              <Text style={styles.stepDescription}>
                We've sent a 6-digit code to {email}
              </Text>

              <Input
                label="Verification Code"
                value={emailOtp}
                onChangeText={(text) => {
                  setEmailOtp(text);
                  setErrors({});
                }}
                placeholder="Enter 6-digit code"
                leftIcon="shield-check-outline"
                keyboardType="number-pad"
                maxLength={6}
                error={errors.otp}
                required
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Verify"
                  onPress={handleVerifyEmailOTP}
                  loading={loading}
                  fullWidth
                  style={styles.verifyButton}
                />
              </View>

              <TouchableOpacity
                style={styles.resendLink}
                onPress={handleSendEmailOTP}
              >
                <Text style={styles.resendText}>Didn't receive code? Resend</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Phone Reset Form */}
          {resetMethod === 'phone' && phoneStep === 'phone' && (
            <View style={styles.form}>
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setErrors({});
                }}
                placeholder="Enter your phone number"
                leftIcon="call-outline"
                keyboardType="phone-pad"
                error={errors.phone}
                required
              />

              <Button
                title="Send OTP"
                onPress={handleSendPhoneOTP}
                loading={loading}
                fullWidth
                size="large"
                style={styles.sendButton}
              />
            </View>
          )}

          {resetMethod === 'phone' && phoneStep === 'otp' && (
            <View style={styles.form}>
              <Text style={styles.stepTitle}>Enter Verification Code</Text>
              <Text style={styles.stepDescription}>
                We've sent a 6-digit code to {phone}
              </Text>

              <Input
                label="Verification Code"
                value={phoneOtp}
                onChangeText={(text) => {
                  setPhoneOtp(text);
                  setErrors({});
                }}
                placeholder="Enter 6-digit code"
                leftIcon="shield-check-outline"
                keyboardType="number-pad"
                maxLength={6}
                error={errors.otp}
                required
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Verify"
                  onPress={handleVerifyPhoneOTP}
                  loading={loading}
                  fullWidth
                  style={styles.verifyButton}
                />
              </View>

              <TouchableOpacity
                style={styles.resendLink}
                onPress={handleSendPhoneOTP}
              >
                <Text style={styles.resendText}>Didn't receive code? Resend</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="arrow-back-outline" size={18} color={COLORS.primary} />
            <Text style={styles.backToLoginText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  methodTabActive: {
    backgroundColor: COLORS.primary,
  },
  methodTabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  methodTabTextActive: {
    color: COLORS.white,
  },
  form: {
    width: '100%',
  },
  sendButton: {
    marginTop: SPACING.md,
  },
  stepTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  verifyButton: {
    flex: 1,
  },
  resendLink: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
  },
  resendText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.success + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  resetButton: {
    marginTop: SPACING.lg,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  backToLoginText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
});

export default ForgotPasswordScreen;