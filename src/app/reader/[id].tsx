import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { getBookById } from '@/data/mock-data';
import { useTheme } from '@/hooks/use-theme';

type ReaderTheme = 'light' | 'sepia' | 'dark';

const READER_THEMES: Record<ReaderTheme, { bg: string; text: string; secondary: string }> = {
  light: { bg: '#fcf9f8', text: '#1c1b1b', secondary: '#4a4453' },
  sepia: { bg: '#f4ecd8', text: '#5b4636', secondary: '#8c7662' },
  dark: { bg: '#131313', text: '#e5e2e1', secondary: '#cac4d4' },
};

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBookById(id ?? 'detail-1');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(20);

  const colors = READER_THEMES[readerTheme];
  const paragraphs = book.content ?? [
    'Ánh trăng tan loãng trên những tán thông già, đổ xuống mặt đường mòn một thứ ánh sáng bàng bạc, hư ảo.',
    'Minh tựa lưng vào vách gỗ, hơi ấm từ tách trà gừng trong tay không đủ để xua đi cái lạnh đang len lỏi vào tận xương tủy.',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: `${colors.bg}B3`,
          },
        ]}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color={theme.primary} />
        </Pressable>
        <View style={styles.headerText}>
          <ThemedText style={[styles.chapterTitle, { color: colors.text }]}>
            Chương 12: Đêm trắng trên cao nguyên
          </ThemedText>
          <ThemedText style={[styles.chapterMeta, { color: colors.secondary }]}>
            Thư quán • {book.title}
          </ThemedText>
        </View>
        <Pressable onPress={() => setShowSettings(!showSettings)} style={styles.headerBtn}>
          <MaterialIcons name="settings" size={22} color={colors.secondary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.marginMobile,
          paddingTop: 120,
          paddingBottom: insets.bottom + 120,
          maxWidth: 640,
          alignSelf: 'center',
          width: '100%',
        }}>
        {paragraphs.map((paragraph, index) => (
          <View key={index} style={styles.paragraphWrap}>
            <ThemedText
              style={[
                styles.paragraph,
                {
                  color: colors.text,
                  fontSize,
                  lineHeight: fontSize * 1.6,
                  fontFamily: 'serif',
                },
              ]}>
              {paragraph}
            </ThemedText>
            {index % 2 === 0 && (
              <View style={styles.commentBadge}>
                <MaterialIcons name="forum" size={16} color={theme.primary} />
                <ThemedText style={[styles.commentCount, { color: theme.primary }]}>
                  {index === 0 ? 12 : 5}
                </ThemedText>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {showSettings && (
        <View
          style={[
            styles.settingsPanel,
            {
              bottom: insets.bottom + 80,
              backgroundColor: theme.surfaceContainer,
              borderColor: `${theme.outlineVariant}4D`,
            },
          ]}>
          <ThemedText style={styles.settingsTitle}>Giao diện đọc</ThemedText>
          <View style={styles.themeRow}>
            {(['light', 'sepia', 'dark'] as ReaderTheme[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setReaderTheme(t)}
                style={[
                  styles.themeBtn,
                  { backgroundColor: READER_THEMES[t].bg, borderColor: readerTheme === t ? theme.primary : theme.outlineVariant },
                  readerTheme === t && { borderWidth: 2 },
                ]}
              />
            ))}
          </View>
          <View style={styles.fontRow}>
            <Pressable onPress={() => setFontSize((s) => Math.max(16, s - 2))}>
              <MaterialIcons name="text-decrease" size={24} color={theme.text} />
            </Pressable>
            <ThemedText style={styles.fontLabel}>{fontSize}px</ThemedText>
            <Pressable onPress={() => setFontSize((s) => Math.min(28, s + 2))}>
              <MaterialIcons name="text-increase" size={24} color={theme.text} />
            </Pressable>
          </View>
        </View>
      )}

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: `${colors.bg}B3`,
          },
        ]}>
        <Pressable style={styles.footerBtn}>
          <MaterialIcons name="chevron-left" size={28} color={colors.secondary} />
        </Pressable>
        <ThemedText style={[styles.pageInfo, { color: colors.secondary }]}>Trang 42 / 128</ThemedText>
        <Pressable style={styles.footerBtn}>
          <MaterialIcons name="chevron-right" size={28} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: 8,
    gap: 8,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  chapterTitle: { fontSize: 13, fontWeight: '700' },
  chapterMeta: { fontSize: 11, marginTop: 2 },
  paragraphWrap: { marginBottom: Spacing.stackLg, position: 'relative' },
  paragraph: { textAlign: 'justify' },
  commentBadge: {
    position: 'absolute',
    right: -8,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    opacity: 0.7,
  },
  commentCount: { fontSize: 11 },
  settingsPanel: {
    position: 'absolute',
    left: Spacing.marginMobile,
    right: Spacing.marginMobile,
    padding: Spacing.three,
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  settingsTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  themeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  themeBtn: { width: 40, height: 40, borderRadius: Radius.full, borderWidth: 1 },
  fontRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  fontLabel: { fontSize: 14, fontWeight: '600' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: 12,
  },
  footerBtn: { padding: 8 },
  pageInfo: { fontSize: 13 },
});
