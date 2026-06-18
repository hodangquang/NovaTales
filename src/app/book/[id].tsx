import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { getBookById } from '@/data/mock-data';
import { useTheme } from '@/hooks/use-theme';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBookById(id ?? 'detail-1');
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={[styles.heroBg, { backgroundColor: `${theme.primary}0D` }]}>
          <View style={[styles.nav, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => router.back()} style={[styles.navBtn, { backgroundColor: `${theme.surface}80` }]}>
              <MaterialIcons name="arrow-back" size={22} color={theme.text} />
            </Pressable>
            <View style={styles.navActions}>
              <Pressable style={[styles.navBtn, { backgroundColor: `${theme.surface}80` }]}>
                <MaterialIcons name="share" size={22} color={theme.text} />
              </Pressable>
              <Pressable style={[styles.navBtn, { backgroundColor: `${theme.surface}80` }]}>
                <MaterialIcons name="more-vert" size={22} color={theme.text} />
              </Pressable>
            </View>
          </View>
          <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
          <ThemedText style={[styles.title, { fontFamily: 'serif' }]}>{book.title}</ThemedText>
          <ThemedText style={[styles.author, { color: theme.primary }]}>{book.author}</ThemedText>
          <View style={styles.statsRow}>
            {book.rating != null && (
              <ThemedText themeColor="textSecondary" style={styles.stat}>
                ★ {book.rating} (2.4k)
              </ThemedText>
            )}
            {book.reads != null && (
              <ThemedText themeColor="textSecondary" style={styles.stat}>
                {book.reads.toLocaleString('vi-VN')} lượt đọc
              </ThemedText>
            )}
          </View>
          <View style={styles.tags}>
            {book.genres?.map((genre) => (
              <View key={genre} style={[styles.tag, { backgroundColor: theme.primaryFixed }]}>
                <ThemedText style={[styles.tagText, { color: theme.onPrimaryFixed ?? theme.primary }]}>
                  {genre}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push(`/reader/${book.id}`)}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
              <MaterialIcons name="menu-book" size={20} color="#fff" />
              <ThemedText style={styles.primaryBtnText}>Đọc ngay</ThemedText>
            </Pressable>
            <Pressable style={[styles.secondaryBtn, { backgroundColor: theme.secondaryContainer }]}>
              <MaterialIcons name="bookmark-add" size={20} color={theme.secondary} />
              <ThemedText style={styles.secondaryBtnText}>Lưu thư viện</ThemedText>
            </Pressable>
          </View>

          <ThemedText style={styles.sectionTitle}>Tóm tắt nội dung</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.synopsis}>
            {book.synopsis ??
              'Một hành trình đầy mê hoặc qua những vùng đất chưa từng được biết đến của tâm hồn.'}
          </ThemedText>

          <View style={[styles.tocCard, { backgroundColor: theme.surfaceContainerLow }]}>
            <View style={styles.tocHeader}>
              <ThemedText style={styles.sectionTitle}>Mục lục</ThemedText>
              <ThemedText style={[styles.chapterCount, { color: theme.primary }]}>
                {book.chapterCount ?? 68} Chương
              </ThemedText>
            </View>
            {(book.chapters ?? [
              { number: 1, title: 'Tiếng gọi từ phương Bắc' },
              { number: 2, title: 'Ký ức nhạt nhòa' },
              { number: 3, title: 'Cánh cửa bí mật' },
            ]).map((chapter) => (
              <Pressable
                key={chapter.number}
                onPress={() => router.push(`/reader/${book.id}`)}
                style={[styles.chapterRow, { borderBottomColor: `${theme.outlineVariant}1A` }]}>
                <ThemedText themeColor="textSecondary" style={styles.chapterNum}>
                  {String(chapter.number).padStart(2, '0')}
                </ThemedText>
                <ThemedText style={styles.chapterTitle}>{chapter.title}</ThemedText>
                <MaterialIcons name="chevron-right" size={20} color={theme.outline} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: `${theme.surface}B3`,
            borderTopColor: `${theme.outlineVariant}33`,
          },
        ]}>
        <Pressable
          onPress={() => router.push(`/reader/${book.id}`)}
          style={[styles.continueBtn, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.continueBtnText}>Tiếp tục đọc Chương 4</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBg: { alignItems: 'center', paddingBottom: Spacing.stackLg },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.three,
  },
  navActions: { flexDirection: 'row', gap: 8 },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: { width: 180, aspectRatio: 2 / 3, borderRadius: Radius.md, marginBottom: Spacing.three },
  title: { fontSize: 28, fontWeight: '600', textAlign: 'center', paddingHorizontal: Spacing.marginMobile },
  author: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  stat: { fontSize: 13 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: 'center', paddingHorizontal: Spacing.marginMobile },
  tag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  tagText: { fontSize: 12, fontWeight: '500' },
  content: { paddingHorizontal: Spacing.marginMobile },
  actions: { flexDirection: 'row', gap: 12, marginBottom: Spacing.stackLg },
  primaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  secondaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  synopsis: { fontSize: 15, lineHeight: 24, marginBottom: Spacing.stackLg },
  tocCard: { borderRadius: Radius.xl, padding: Spacing.three, marginBottom: Spacing.stackLg },
  tocHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  chapterCount: { fontSize: 13 },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  chapterNum: { fontSize: 13, width: 24 },
  chapterTitle: { flex: 1, fontSize: 15 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  continueBtn: {
    height: 48,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
