import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Fonts } from '@/constants/theme';

const SLIDES = [
  {
    step: 1,
    title: 'Khám phá câu chuyện hay',
    desc: 'Hệ thống thông tin phong phú mở ra những thế giới tác phẩm kỳ vĩ sáng tạo phù hợp nhất với sở thích văn học đặc trưng của riêng bạn.',
    artIcon: 'book-outline',
    artDesc: 'Quyển sách lung linh rực rỡ tỏa ánh kim huyền bí.'
  },
  {
    step: 2,
    title: 'Tương tác với tác giả',
    desc: 'Tham gia cộng đồng yêu văn học sôi động thảo luận trực tiếp cùng các nhà văn sáng tác xuất sắc và độc giả đồng điệu tâm hồn.',
    artIcon: 'people-outline',
    artDesc: 'Các vòng tròn kết nối liên kết hàng nghìn độc giả.'
  },
  {
    step: 3,
    title: 'Đọc mọi lúc mọi nơi',
    desc: 'Tải xuống những bộ truyện nổi bật trọn vẹn và hòa mình trải nghiệm bất cứ lúc nào ngay cả khi thiết bị ngắt kết nối mạng ổn định.',
    artIcon: 'download-outline',
    artDesc: 'Thưởng trà yên ả bên trang sách ngạt ngào hương chữ.'
  }
];

export default function OnboardingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const handleNext = () => {
    if (activeStep < SLIDES.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const currentSlide = SLIDES[activeStep];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.brandText, { color: colors.primary }]}>NovaTales</Text>
        <Pressable onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Bỏ qua</Text>
        </Pressable>
      </View>

      {/* Slide Content */}
      <View style={styles.slideContainer}>
        {/* Mock Mockup Card */}
        <View style={[styles.artCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
          <Ionicons name={currentSlide.artIcon as any} size={72} color={colors.primary} />
          <Text style={[styles.artText, { color: colors.textSecondary }]}>
            {currentSlide.artDesc}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{currentSlide.title}</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>{currentSlide.desc}</Text>
      </View>

      {/* Footer Controls */}
      <View style={styles.footer}>
        {/* Indicator Dots */}
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeStep ? colors.primary : colors.outlineVariant,
                  width: index === activeStep ? 24 : 8
                }
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {activeStep > 0 ? (
            <Pressable
              style={[styles.backButton, { borderColor: colors.primary }]}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={18} color={colors.primary} />
              <Text style={[styles.backButtonText, { color: colors.primary }]}>Quay lại</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          <Pressable
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {activeStep === SLIDES.length - 1 ? 'Bắt đầu ngay' : 'Tiếp tục'}
            </Text>
            {activeStep < SLIDES.length - 1 && (
              <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  brandText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  artCard: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    marginBottom: Spacing.stackLg,
  },
  artText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.three,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  desc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.one,
  },
  footer: {
    paddingBottom: Spacing.five,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.stackLg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.three,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
