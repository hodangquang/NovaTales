import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, useColorScheme, ToastAndroid, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

type AuthStep = 'LOGIN' | 'REGISTER' | 'FORGOT' | 'OTP';

export default function LoginScreen() {
  const { login } = useApp();
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<'READER' | 'WRITER' | 'ADMIN'>('READER');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Forgot Password & OTP
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(119);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (step === 'OTP' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Thông báo', message);
    }
  };

  const handleAutofill = () => {
    setErrorMessage(null);
    if (selectedRole === 'ADMIN') {
      setLoginEmail('admin@novatales.com');
      setLoginPassword('novatales2026');
      setForgotEmail('admin@novatales.com');
    } else if (selectedRole === 'WRITER') {
      setLoginEmail('writer@novatales.com');
      setLoginPassword('author2026');
      setForgotEmail('writer@novatales.com');
    } else {
      setLoginEmail('docgianova@gmail.com');
      setLoginPassword('123456');
      setForgotEmail('docgianova@gmail.com');
    }
  };

  const handleLoginSubmit = () => {
    setErrorMessage(null);
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin đăng nhập.');
      return;
    }
    const success = login(loginEmail, selectedRole);
    if (success) {
      showToast('Đăng nhập thành công!');
      if (selectedRole === 'ADMIN') {
        router.replace('/admin' as any);
      } else if (selectedRole === 'WRITER') {
        router.replace('/studio' as any);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setErrorMessage('Tài khoản này đã bị khóa hoặc không hợp lệ.');
    }
  };

  const handleRegisterSubmit = () => {
    setErrorMessage(null);
    if (!regUsername || !regEmail || !regPassword || !regConfirmPassword) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin đăng ký.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    if (!termsAgreed) {
      setErrorMessage('Bạn phải đồng ý với điều khoản dịch vụ.');
      return;
    }
    // Simulate sending OTP
    setForgotEmail(regEmail);
    setStep('OTP');
    setOtpTimer(119);
    showToast('Mã OTP đã được gửi đến email của bạn.');
  };

  const handleForgotSubmit = () => {
    setErrorMessage(null);
    if (!forgotEmail) {
      setErrorMessage('Vui lòng điền địa chỉ email.');
      return;
    }
    setStep('OTP');
    setOtpTimer(119);
    showToast('Mã OTP khôi phục đã được gửi đến email.');
  };

  const handleOtpVerify = () => {
    setErrorMessage(null);
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }
    showToast('Xác thực thành công!');
    // If it was register/forgot path, log in dynamically
    const targetEmail = forgotEmail || regEmail || 'docgianova@gmail.com';
    login(targetEmail, selectedRole);
    if (selectedRole === 'ADMIN') {
      router.replace('/admin' as any);
    } else if (selectedRole === 'WRITER') {
      router.replace('/studio' as any);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleResendOtp = () => {
    if (otpTimer === 0) {
      setOtpTimer(119);
      showToast('Đã gửi lại mã OTP mới.');
    }
  };

  const updateOtpDigit = (val: string, index: number) => {
    const cleanVal = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.brandText, { color: colors.primary }]}>NovaTales</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {selectedRole === 'ADMIN' ? 'Hệ thống Quản trị' : selectedRole === 'WRITER' ? 'Hệ thống Sáng tác' : 'Premium Literary Sanctuary'}
            </Text>
          </View>

          {/* Role selector segmented control */}
          {step === 'LOGIN' && (
            <View style={[styles.roleSelector, { backgroundColor: colors.surfaceContainer }]}>
              {(['READER', 'WRITER', 'ADMIN'] as const).map(role => (
                <Pressable
                  key={role}
                  onPress={() => setSelectedRole(role)}
                  style={[
                    styles.roleBtn,
                    selectedRole === role && [styles.roleBtnActive, { backgroundColor: colors.surfaceContainerLowest }]
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      { color: selectedRole === role ? colors.primary : colors.textSecondary }
                    ]}
                  >
                    {role === 'READER' ? 'Độc Giả' : role === 'WRITER' ? 'Tác Giả' : 'Admin'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Main Card Holder */}
          <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
            
            {/* 1. LOGIN SCREEN */}
            {step === 'LOGIN' && (
              <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Đăng nhập</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>EMAIL</Text>
                  <View style={[styles.inputWrapper, { borderColor: colors.outlineVariant }]}>
                    <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder={selectedRole === 'ADMIN' ? 'admin@novatales.com' : selectedRole === 'WRITER' ? 'writer@novatales.com' : 'docgianova@gmail.com'}
                      placeholderTextColor={colors.outline}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={loginEmail}
                      onChangeText={setLoginEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>MẬT KHẨU</Text>
                  <View style={[styles.inputWrapper, { borderColor: colors.outlineVariant }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="••••••••"
                      placeholderTextColor={colors.outline}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                    />
                    <Pressable onPress={() => setPasswordVisible(prev => !prev)}>
                      <Ionicons
                        name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={colors.textSecondary}
                      />
                    </Pressable>
                  </View>
                </View>

                {errorMessage && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
                )}

                <View style={styles.rowBetween}>
                  <Pressable style={styles.rowCenter} onPress={() => setRememberMe(!rememberMe)}>
                    <Ionicons
                      name={rememberMe ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.rememberText, { color: colors.textSecondary }]}>Ghi nhớ</Text>
                  </Pressable>
                  <Pressable onPress={() => setStep('FORGOT')}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>Quên mật khẩu?</Text>
                  </Pressable>
                </View>

                {/* Autofill helper */}
                <Pressable style={styles.autofillBtn} onPress={handleAutofill}>
                  <Text style={[styles.autofillText, { color: colors.primary }]}>
                    Tự động nhập tài khoản mẫu
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleLoginSubmit}
                >
                  <Text style={styles.submitButtonText}>Đăng nhập</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
                </Pressable>
              </View>
            )}

            {/* 2. REGISTER SCREEN */}
            {step === 'REGISTER' && (
              <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Đăng ký độc giả</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>TÊN NGƯỜI DÙNG</Text>
                  <TextInput
                    style={[styles.singleInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                    placeholder="Minh Phạm"
                    placeholderTextColor={colors.outline}
                    value={regUsername}
                    onChangeText={setRegUsername}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>EMAIL</Text>
                  <TextInput
                    style={[styles.singleInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                    placeholder="example@gmail.com"
                    placeholderTextColor={colors.outline}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={regEmail}
                    onChangeText={setRegEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>MẬT KHẨU</Text>
                  <TextInput
                    style={[styles.singleInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.outline}
                    secureTextEntry
                    autoCapitalize="none"
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>XÁC NHẬN MẬT KHẨU</Text>
                  <TextInput
                    style={[styles.singleInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.outline}
                    secureTextEntry
                    autoCapitalize="none"
                    value={regConfirmPassword}
                    onChangeText={setRegConfirmPassword}
                  />
                </View>

                {errorMessage && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
                )}

                <Pressable style={styles.rowCenter} onPress={() => setTermsAgreed(!termsAgreed)}>
                  <Ionicons
                    name={termsAgreed ? 'checkbox' : 'square-outline'}
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                    Tôi đồng ý với Điều khoản và Chính sách của NovaTales.
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleRegisterSubmit}
                >
                  <Text style={styles.submitButtonText}>Đăng ký</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
                </Pressable>
              </View>
            )}

            {/* 3. FORGOT PASSWORD */}
            {step === 'FORGOT' && (
              <View>
                <View style={styles.rowCenter}>
                  <Pressable onPress={() => setStep('LOGIN')} style={{ marginRight: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                  </Pressable>
                  <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 0 }]}>Quên mật khẩu</Text>
                </View>
                <Text style={[styles.descText, { color: colors.textSecondary }]}>
                  Nhập email đã đăng ký để khôi phục mật khẩu. Chúng tôi sẽ gửi mã xác nhận OTP cho bạn.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>EMAIL</Text>
                  <TextInput
                    style={[styles.singleInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                    placeholder="docgianova@gmail.com"
                    placeholderTextColor={colors.outline}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                  />
                </View>

                {errorMessage && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
                )}

                <Pressable
                  style={[styles.submitButton, { backgroundColor: colors.primary, marginTop: Spacing.four }]}
                  onPress={handleForgotSubmit}
                >
                  <Text style={styles.submitButtonText}>Tiếp tục</Text>
                </Pressable>
              </View>
            )}

            {/* 4. OTP VERIFICATION */}
            {step === 'OTP' && (
              <View>
                <View style={styles.rowCenter}>
                  <Pressable onPress={() => setStep('LOGIN')} style={{ marginRight: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                  </Pressable>
                  <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 0 }]}>Mã xác thực</Text>
                </View>
                <Text style={[styles.descText, { color: colors.textSecondary }]}>
                  Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn. Vui lòng nhập mã để tiếp tục.
                </Text>

                {/* OTP Digits input row */}
                <View style={styles.otpRow}>
                  {otpDigits.map((digit, i) => (
                    <TextInput
                      key={i}
                      style={[styles.otpBox, { color: colors.text, borderColor: colors.outlineVariant }]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(val) => updateOtpDigit(val, i)}
                    />
                  ))}
                </View>

                {errorMessage && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
                )}

                <Pressable onPress={handleResendOtp} disabled={otpTimer > 0} style={{ alignSelf: 'center', marginTop: Spacing.three }}>
                  <Text
                    style={[
                      styles.resendText,
                      { color: otpTimer > 0 ? colors.textSecondary : colors.primary }
                    ]}
                  >
                    {otpTimer > 0 ? `Gửi lại sau ${formatTimer(otpTimer)}` : 'Gửi lại mã OTP'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.submitButton, { backgroundColor: colors.primary, marginTop: Spacing.four }]}
                  onPress={handleOtpVerify}
                >
                  <Text style={styles.submitButtonText}>Xác nhận</Text>
                </Pressable>
              </View>
            )}

          </View>

          {/* Social Auth Footer */}
          {step === 'LOGIN' && (
            <View style={styles.socialFooter}>
              <Text style={[styles.socialText, { color: colors.outline }]}>Hoặc tiếp tục với</Text>
              <View style={styles.socialRow}>
                {['logo-google', 'logo-facebook', 'logo-apple'].map((iconName, index) => (
                  <Pressable
                    key={index}
                    style={[styles.socialIconBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
                    onPress={() => {
                      setLoginEmail('docgianova@gmail.com');
                      setLoginPassword('123456');
                      login('docgianova@gmail.com', 'READER');
                      showToast('Đăng nhập nhanh với tài khoản mặc định!');
                      router.replace('/(tabs)');
                    }}
                  >
                    <Ionicons name={iconName as any} size={24} color={colors.primary} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Bottom link toggle */}
          {step === 'LOGIN' ? (
            <View style={styles.toggleAuthRow}>
              <Text style={{ color: colors.textSecondary }}>Chưa có tài khoản? </Text>
              <Pressable onPress={() => setStep('REGISTER')}>
                <Text style={[styles.toggleAuthLink, { color: colors.primary }]}>Đăng ký</Text>
              </Pressable>
            </View>
          ) : step === 'REGISTER' ? (
            <View style={styles.toggleAuthRow}>
              <Text style={{ color: colors.textSecondary }}>Đã có tài khoản? </Text>
              <Pressable onPress={() => setStep('LOGIN')}>
                <Text style={[styles.toggleAuthLink, { color: colors.primary }]}>Đăng nhập</Text>
              </Pressable>
            </View>
          ) : null}

          {/* Shield Secure Baseline */}
          <View style={styles.secureBadge}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.outline} />
            <Text style={[styles.secureText, { color: colors.outline }]}>Kết nối được mã hóa an toàn SSL</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  brandText: {
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  subtitle: {
    fontSize: 13,
    marginTop: Spacing.half,
  },
  roleSelector: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.half,
    marginBottom: Spacing.four,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  roleBtnActive: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  roleText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: Spacing.four,
  },
  descText: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  inputGroup: {
    marginBottom: Spacing.three,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    height: 48,
    paddingHorizontal: Spacing.two,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  singleInput: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    height: 48,
    paddingHorizontal: Spacing.two,
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 13,
    marginLeft: Spacing.one,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  autofillBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
    marginTop: Spacing.two,
  },
  autofillText: {
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  submitButton: {
    height: 50,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: Spacing.one,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: Spacing.two,
    flex: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.four,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  socialFooter: {
    alignItems: 'center',
    marginTop: Spacing.stackLg,
  },
  socialText: {
    fontSize: 12,
    marginBottom: Spacing.two,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  socialIconBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.stackLg,
  },
  toggleAuthLink: {
    fontWeight: 'bold',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    marginTop: Spacing.stackLg,
  },
  secureText: {
    fontSize: 11,
  },
});
