import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '@/components/layout/top-app-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { COMMUNITY_POSTS } from '@/data/mock-data';
import { useTheme } from '@/hooks/use-theme';

const TABS = ['Thảo luận', 'Bảng xếp hạng', 'Người dùng nổi bật'];

export default function CommunityScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ThemedView style={styles.container}>
      <TopAppBar />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View style={styles.pageHeader}>
          <ThemedText style={[styles.pageTitle, { color: theme.primary, fontFamily: 'serif' }]}>
            Cộng đồng
          </ThemedText>
          <View style={[styles.tabRow, { borderBottomColor: `${theme.outlineVariant}4D` }]}>
            {TABS.map((tab, i) => (
              <Pressable key={tab} onPress={() => setActiveTab(i)} style={styles.communityTab}>
                <ThemedText
                  style={[
                    styles.communityTabText,
                    activeTab === i
                      ? { color: theme.primary, borderBottomColor: theme.primary }
                      : { color: theme.textSecondary },
                  ]}>
                  {tab}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {activeTab === 0 &&
          COMMUNITY_POSTS.map((post) => (
            <View
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor: theme.surfaceContainerLowest,
                  borderColor: `${theme.outlineVariant}33`,
                },
              ]}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatarUrl }} style={styles.avatar} contentFit="cover" />
                <View style={styles.postMeta}>
                  <ThemedText style={styles.postAuthor}>{post.author}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.postSubtitle}>
                    {post.subtitle}
                  </ThemedText>
                </View>
                <MaterialIcons name="more-horiz" size={20} color={theme.textSecondary} />
              </View>
              <ThemedText style={styles.postContent}>{post.content}</ThemedText>
              {post.imageUrl && post.quote ? (
                <View style={styles.quoteBlock}>
                  <Image source={{ uri: post.imageUrl }} style={styles.quoteImage} contentFit="cover" />
                  <View style={styles.quoteOverlay}>
                    <ThemedText style={styles.quoteText}>"{post.quote}"</ThemedText>
                  </View>
                </View>
              ) : null}
              <View style={[styles.postActions, { borderTopColor: `${theme.outlineVariant}1A` }]}>
                <Pressable style={styles.actionBtn}>
                  <MaterialIcons name="favorite" size={18} color={theme.primary} />
                  <ThemedText style={[styles.actionText, { color: theme.primary }]}>{post.likes}</ThemedText>
                </Pressable>
                <Pressable style={styles.actionBtn}>
                  <MaterialIcons name="forum" size={18} color={theme.textSecondary} />
                  <ThemedText themeColor="textSecondary" style={styles.actionText}>
                    {post.comments}
                  </ThemedText>
                </Pressable>
                <MaterialIcons
                  name="share"
                  size={18}
                  color={theme.textSecondary}
                  style={styles.shareIcon}
                />
              </View>
            </View>
          ))}

        {activeTab !== 0 && (
          <View style={styles.placeholder}>
            <ThemedText themeColor="textSecondary" style={styles.placeholderText}>
              Nội dung "{TABS[activeTab]}" sẽ được cập nhật sớm.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageHeader: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: Spacing.three,
    marginBottom: Spacing.stackLg,
  },
  pageTitle: { fontSize: 28, fontWeight: '600', marginBottom: Spacing.three },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.stackMd,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  communityTab: { paddingBottom: 8 },
  communityTabText: {
    fontSize: 14,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 6,
  },
  postCard: {
    marginHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.stackLg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: 12,
  },
  avatar: { width: 40, height: 40, borderRadius: Radius.full },
  postMeta: { flex: 1 },
  postAuthor: { fontSize: 14, fontWeight: '600' },
  postSubtitle: { fontSize: 12 },
  postContent: { paddingHorizontal: Spacing.three, paddingBottom: 12, fontSize: 15, lineHeight: 22 },
  quoteBlock: { marginHorizontal: Spacing.three, marginBottom: Spacing.three, borderRadius: Radius.md, overflow: 'hidden' },
  quoteImage: { width: '100%', aspectRatio: 4 / 3 },
  quoteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  quoteText: { color: '#fff', fontSize: 18, fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center' },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.stackLg,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 12 },
  shareIcon: { marginLeft: 'auto' },
  placeholder: { padding: Spacing.five, alignItems: 'center' },
  placeholderText: { fontSize: 14, textAlign: 'center' },
});
