import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '@/components/layout/top-app-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DRAFTS = [
  { id: 'd1', title: 'Hơi Thở Mùa Thu', chapters: 8, updated: '2 giờ trước' },
  { id: 'd2', title: 'Lời Thì Thầm', chapters: 3, updated: 'Hôm qua' },
];

export default function WriterStudioScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <TopAppBar showBack onBack={() => router.back()} title="Studio viết" showSearch={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={styles.header}>
          <ThemedText style={[styles.pageTitle, { color: theme.primary, fontFamily: 'serif' }]}>
            Không gian sáng tác
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Dành cho tác giả và biên tập viên — từ novatales (2) & (3)
          </ThemedText>
        </View>

        <Pressable style={[styles.newDraftBtn, { backgroundColor: theme.primary }]}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <ThemedText style={styles.newDraftText}>Tạo tác phẩm mới</ThemedText>
        </Pressable>

        <ThemedText style={styles.sectionTitle}>Bản nháp đang viết</ThemedText>
        {DRAFTS.map((draft) => (
          <Pressable
            key={draft.id}
            style={[
              styles.draftCard,
              {
                backgroundColor: theme.surfaceContainerLow,
                borderColor: `${theme.outlineVariant}33`,
              },
            ]}>
            <View style={[styles.draftIcon, { backgroundColor: theme.primaryFixed }]}>
              <MaterialIcons name="description" size={22} color={theme.primary} />
            </View>
            <View style={styles.draftContent}>
              <ThemedText style={styles.draftTitle}>{draft.title}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.draftMeta}>
                {draft.chapters} chương • Cập nhật {draft.updated}
              </ThemedText>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        ))}

        <View style={[styles.editorPreview, { backgroundColor: theme.surfaceContainerLowest, borderColor: `${theme.outlineVariant}33` }]}>
          <ThemedText style={styles.editorLabel}>Soạn nhanh</ThemedText>
          <TextInput
            placeholder="Bắt đầu viết chương mới..."
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[
              styles.editorInput,
              {
                color: theme.text,
                borderColor: `${theme.outlineVariant}4D`,
                fontFamily: 'serif',
              },
            ]}
          />
          <Pressable style={[styles.publishBtn, { backgroundColor: theme.secondaryContainer }]}>
            <ThemedText style={styles.publishText}>Lưu bản nháp</ThemedText>
          </Pressable>
        </View>

        <View style={[styles.moderatorCard, { backgroundColor: `${theme.tertiaryFixed}80` }]}>
          <MaterialIcons name="shield" size={22} color={theme.tertiary} />
          <View style={styles.moderatorContent}>
            <ThemedText style={[styles.moderatorTitle, { color: theme.tertiary }]}>
              Khu vực kiểm duyệt
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.moderatorDesc}>
              3 bài đang chờ duyệt • 1 báo cáo mới
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: Spacing.three,
    marginBottom: Spacing.stackLg,
  },
  pageTitle: { fontSize: 26, fontWeight: '600' },
  subtitle: { fontSize: 13, marginTop: 6, lineHeight: 20 },
  newDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.marginMobile,
    paddingVertical: 14,
    borderRadius: Radius.xl,
    marginBottom: Spacing.stackLg,
  },
  newDraftText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.three,
  },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.marginMobile,
    marginBottom: 12,
    padding: Spacing.three,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.three,
  },
  draftIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftContent: { flex: 1 },
  draftTitle: { fontSize: 15, fontWeight: '600' },
  draftMeta: { fontSize: 12, marginTop: 2 },
  editorPreview: {
    marginHorizontal: Spacing.marginMobile,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  editorLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  editorInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 26,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  publishBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  publishText: { fontSize: 13, fontWeight: '700' },
  moderatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.marginMobile,
    marginTop: Spacing.stackLg,
    padding: Spacing.three,
    borderRadius: Radius.xl,
    gap: Spacing.three,
  },
  moderatorContent: { flex: 1 },
  moderatorTitle: { fontSize: 14, fontWeight: '700' },
  moderatorDesc: { fontSize: 12, marginTop: 2 },
});
