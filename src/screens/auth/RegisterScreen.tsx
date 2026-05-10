// Register Screen - Temo Thuo Market

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
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, USER_ROLES } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { registerWithEmail } from '../../services/authService';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as const,
    farmName: '',
    farmLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName) {
      newErrors.displayName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length < 8) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.farmName && formData.role === 'farmer') {
      newErrors.farmName = 'Farm name is required for farmers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Registration logic here
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Welcome Content */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Join Temo Thuo</Text>
          <Text style={styles.welcomeSubtitle}>
            Create an account to start buying and selling
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleOptions}>
              {USER_ROLES.map(role => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleOption,
                    formData.role === role.id && styles.roleOptionSelected,
                  ]}
                  onPress={() => updateField('role', role.id)}
                >
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <Text
                    style={[
                      styles.roleText,
                      formData.role === role.id && styles.roleTextSelected,
                    ]}
                  >
                    {role.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Full Name"
            value={formData.displayName}
            onChangeText={v => updateField('displayName', v)}
            placeholder="Enter your full name"
            leftIcon="person-outline"
            error={errors.displayName}
            required
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={v => updateField('email', v)}
            placeholder="Enter your email"
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={v => updateField('phoneNumber', v)}
            placeholder="+267 XX XXX XXX"
            leftIcon="call-outline"
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            required
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={v => updateField('password', v)}
            placeholder="Create a password"
            leftIcon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={v => updateField('confirmPassword', v)}
            placeholder="Confirm your password"
            leftIcon="lock-closed-outline"
            secureTextEntry
            error={errors.confirmPassword}
            required
          />

          {formData.role === 'farmer' && (
            <>
              <Input
                label="Farm Name"
                value={formData.farmName}
                onChangeText={v => updateField('farmName', v)}
                placeholder="Enter your farm name"
                leftIcon="leaf-outline"
                error={errors.farmName}
              />

              <Input
                label="Farm Location"
                value={formData.farmLocation}
                onChangeText={v => updateField('farmLocation', v)}
                placeholder="Enter your farm location"
                leftIcon="location-outline"
              />
            </>
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            size="large"
            style={styles.registerButton}
          />
        </View>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  welcomeSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  roleSection: {
    marginBottom: SPACING.lg,
  },
  roleLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleOptionSelected: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  roleIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  roleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  roleTextSelected: {
    color: COLORS.primary,
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;