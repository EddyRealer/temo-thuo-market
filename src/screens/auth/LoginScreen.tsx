// Login Screen - Temo Thuo Market
// Enhanced with phone/email tabs and role selector

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
import { loginWithEmail, loginWithPhone, sendPhoneOTP } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

type LoginMethod = 'email' | 'phone';
type UserRole = 'farmer' | 'buyer' | 'supplier';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login, loginWithPhone: authPhoneLogin } = useAuth();

  // Login method toggle
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Role selection (for display purposes on login screen)
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: 'farmer', label: 'Farmer', icon: 'leaf' },
    { value: 'buyer', label: 'Buyer', icon: 'cart' },
    { value: 'supplier', label: 'Supplier', icon: 'business' },
  ];

  const validateEmailLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhoneLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!showOtpInput && !password) {
      newErrors.password = 'Password is required';
    } else if (!showOtpInput && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async () => {
    if (!validateEmailLogin()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by auth state change
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!phone) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    setLoading(true);
    try {
      // Format phone number (add +267 for Botswana)
      const formattedPhone = phone.startsWith('+') ? phone : `+267${phone}`;
      const result = await sendPhoneOTP(formattedPhone);
      setConfirmationResult(result);
      setShowOtpInput(true);
      Alert.alert('OTP Sent', `Verification code sent to ${formattedPhone}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
      } else {
        // Fallback verification
        await loginWithPhone(phone, password);
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!validatePhoneLogin()) return;

    setLoading(true);
    try {
      if (showOtpInput) {
        await handleVerifyOTP();
      } else {
        await handleSendPhoneOTP();
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

        {/* Welcome Content */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to continue to Temo Thuo Market
          </Text>
        </View>

        {/* Role Selector */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleButton,
                  selectedRole === role.value && styles.roleButtonActive,
                ]}
                onPress={() => setSelectedRole(role.value)}
              >
                <Ionicons
                  name={role.icon as any}
                  size={20}
                  color={selectedRole === role.value ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === role.value && styles.roleButtonTextActive,
                  ]}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Login Method Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'email' && styles.tabActive]}
            onPress={() => {
              setLoginMethod('email');
              setShowOtpInput(false);
              setOtp('');
            }}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={loginMethod === 'email' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                loginMethod === 'email' && styles.tabTextActive,
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'phone' && styles.tabActive]}
            onPress={() => {
              setLoginMethod('phone');
              setShowOtpInput(false);
              setOtp('');
            }}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color={loginMethod === 'phone' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                loginMethod === 'phone' && styles.tabTextActive,
              ]}
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {loginMethod === 'email' ? (
            <>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                required
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                leftIcon="lock-closed-outline"
                secureTextEntry
                error={errors.password}
                required
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleEmailLogin}
                loading={loading}
                fullWidth
                size="large"
                style={styles.loginButton}
              />
            </>
          ) : (
            <>
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                leftIcon="call-outline"
                keyboardType="phone-pad"
                error={errors.phone}
                required
              />

              {!showOtpInput ? (
                <>
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    leftIcon="lock-closed-outline"
                    secureTextEntry
                    error={errors.password}
                    required
                  />

                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <Button
                    title="Send OTP"
                    onPress={handlePhoneLogin}
                    loading={loading}
                    fullWidth
                    size="large"
                    style={styles.loginButton}
                    variant="outline"
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Verification Code"
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter 6-digit OTP"
                    leftIcon="shield-check-outline"
                    keyboardType="number-pad"
                    maxLength={6}
                    error={errors.otp}
                    required
                  />

                  <View style={styles.otpInfo}>
                    <Text style={styles.otpInfoText}>
                      Enter the 6-digit code sent to your phone
                    </Text>
                    <TouchableOpacity onPress={() => handleSendPhoneOTP()}>
                      <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>
                  </View>

                  <Button
                    title="Verify & Sign In"
                    onPress={handlePhoneLogin}
                    loading={loading}
                    fullWidth
                    size="large"
                    style={styles.loginButton}
                  />

                  <Button
                    title="Back to Phone Input"
                    onPress={() => {
                      setShowOtpInput(false);
                      setOtp('');
                    }}
                    variant="ghost"
                    fullWidth
                    style={styles.backButton2}
                  />
                </>
              )}
            </>
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Alternative Login Options */}
        <View style={styles.alternatives}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'Google Sign In will be available soon');
            }}
          >
            <Ionicons name="logo-google" size={24} color={COLORS.text} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'Apple Sign In will be available soon');
            }}
          >
            <Ionicons name="logo-apple" size={24} color={COLORS.text} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
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
    paddingHorizontal: SPACING.lg,
  },
  header: {
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
  welcomeSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  roleSection: {
    marginBottom: SPACING.lg,
  },
  roleLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: COLORS.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  tabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: SPACING.sm,
  },
  backButton2: {
    marginTop: SPACING.md,
  },
  otpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  otpInfoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  resendText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  alternatives: {
    gap: SPACING.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  socialButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  registerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;