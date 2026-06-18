import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stories, toggleLibraryStatus } = useApp();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const story = stories.find(s => s.id === id);

  if (!story) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Không tìm thấy thông tin tác phẩm.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Quay lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Mock chapters list based on story metadata
  const chapters = Array.from({ length: story.chaptersCount }, (_, index) => ({
    id: `chap_${index + 1}`,
    title: `Chương ${index + 1}: ${index === 41 ? 'Thức Tỉnh' : index === 5 ? 'Giao ước máu' : 'Chặng đường mới'}`,
    isVip: index >= 10 && story.status === 'VIP',
    coinsPrice: 15
  }));

  const renderBookCover = (title: string, genre: string) => {
    let bgColors = ['#5341CD', '#160066'];
    if (title.length % 4 === 0) bgColors = ['#6C5CE7', '#322A75'];
    else if (title.length % 4 === 1) bgColors = ['#E2849E', '#5952AF'];
    else if (title.length % 4 === 2) bgColors = ['#ac5d00', '#2F1500'];

    return (
      <View style={[styles.coverContainer, { backgroundColor: bgColors[0] }]}>
        <View style={styles.coverSpine} />
        <View style={styles.coverContent}>
          <Text style={styles.coverGenre}>{genre.toUpperCase()}</Text>
          <Text style={styles.coverTitle}>{title}</Text>
        </View>
      </View>
    );
  };

  const handleChapterPress = (chapId: string) => {
    router.push({
      pathname: '/reader',
      params: { id: story.id, chapterId: chapId }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Chi tiết sách
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Book cover & short detail */}
        <View style={styles.bookHeaderRow}>
          <View style={styles.coverWrap}>
            {renderBookCover(story.title, story.genre)}
          </View>

          <View style={styles.bookMeta}>
            <View style={styles.badgeRow}>
              <View style={[styles.tagBadge, { backgroundColor: `${colors.secondary}20` }]}>
                <Text style={[styles.tagBadgeText, { color: colors.secondary }]}>{story.genre}</Text>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: `${colors.primary}20` }]}>
                <Text style={[styles.tagBadgeText, { color: colors.primary }]}>{story.status}</Text>
              </View>
            </View>

            <Text style={[styles.bookTitleText, { color: colors.text }]} numberOfLines={2}>
              {story.title}
            </Text>

            <View style={styles.authorRow}>
              <View style={[styles.authorAvatar, { backgroundColor: colors.outlineVariant }]}>
                <Text style={styles.authorLetters}>{story.author.substring(0, 2).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={[styles.authorName, { color: colors.text }]}>{story.author}</Text>
                <Text style={[styles.authorHandle, { color: colors.textSecondary }]}>
                  @{story.author.toLowerCase().replace(/\s/g, '')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: colors.surfaceContainer }]}>
          <View style={styles.statCol}>
            <View style={styles.rowCenter}>
              <Ionicons name="star" size={16} color="#FFB74D" style={{ marginRight: 4 }} />
              <Text style={[styles.statValText, { color: colors.text }]}>{story.rating}</Text>
            </View>
            <Text style={[styles.statLblText, { color: colors.textSecondary }]}>Đánh giá (1.2k)</Text>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />

          <View style={styles.statCol}>
            <Text style={[styles.statValText, { color: colors.text }]}>{story.views}</Text>
            <Text style={[styles.statLblText, { color: colors.textSecondary }]}>Lượt xem</Text>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />

          <View style={styles.statCol}>
            <Text style={[styles.statValText, { color: colors.text }]}>{story.chaptersCount}</Text>
            <Text style={[styles.statLblText, { color: colors.textSecondary }]}>Chương</Text>
          </View>
        </View>

        {/* Synopsis Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tóm tắt</Text>
          <Text style={[styles.synopsisText, { color: colors.textSecondary }]}>
            {story.content}
          </Text>
        </View>

        {/* Chapters list */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.two }]}>
            Danh sách chương
          </Text>

          {chapters.map((chapter, index) => (
            <Pressable
              key={chapter.id}
              style={[
                styles.chapterCard,
                { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }
              ]}
              onPress={() => handleChapterPress(chapter.id)}
            >
              <Text style={[styles.chapterIdx, { color: colors.textSecondary }]}>
                {(index + 1).toString().padStart(2, '0')}
              </Text>
              <Text style={[styles.chapterTitle, { color: colors.text }]} numberOfLines={1}>
                {chapter.title}
              </Text>

              {chapter.isVip && (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.stickyFooter, { backgroundColor: colors.background, borderTopColor: colors.outlineVariant }]}>
        <Pressable
          style={[styles.outlineBtn, { borderColor: colors.primary }]}
          onPress={() => toggleLibraryStatus(story.id)}
        >
          <Ionicons name={story.isLibrary ? 'heart' : 'heart-outline'} size={20} color={colors.primary} />
          <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
            {story.isLibrary ? 'Bỏ thư viện' : 'Thêm thư viện'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => handleChapterPress('chap_1')}
        >
          <Ionicons name="book-outline" size={20} color="#ffffff" />
          <Text style={styles.primaryBtnText}>Đọc Ngay</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 100, // Leave room for sticky footer
  },
  bookHeaderRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  coverWrap: {
    width: 110,
    height: 165,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  bookMeta: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  bookTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
    lineHeight: 26,
    marginTop: Spacing.one,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  authorLetters: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  authorName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  authorHandle: {
    fontSize: 10,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLblText: {
    fontSize: 10,
    marginTop: 2,
  },
  dividerLine: {
    width: 1,
    height: 32,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.two,
  },
  synopsisText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  chapterIdx: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 28,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  vipBadge: {
    backgroundColor: '#FFB74D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vipText: {
    color: '#5D4037',
    fontSize: 9,
    fontWeight: 'bold',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.three,
  },
  outlineBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  coverContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  coverSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  coverGenre: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  coverTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
    fontSize: 15,
    lineHeight: 18,
  },
});
