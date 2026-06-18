import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - Spacing.four * 2 - Spacing.three) / 2;

export default function LibraryScreen() {
  const { stories, streakCount } = useApp();
  const [activeTab, setActiveTab] = useState(0);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const libraryStories = stories.filter(s => s.isLibrary);

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
          <Text style={styles.coverTitle}>{title.split(' ').slice(0, 3).join(' ')}</Text>
        </View>
      </View>
    );
  };

  const tabs = ['Đang đọc', 'Hoàn thành', 'Đã tải', 'Đang theo dõi'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title */}
        <View style={styles.titleSec}>
          <Text style={[styles.title, { color: colors.text }]}>Thư Viện Của Tôi</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Theo dõi hành trình văn học của bạn.
          </Text>
        </View>

        {/* Stats Bento Box Grid */}
        <View style={styles.statsBentoGrid}>
          <View style={styles.statsRow}>
            {/* Stat 1: Streak */}
            <View style={[styles.statCard, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="flame" size={24} color="#FFB74D" />
              <Text style={[styles.statVal, { color: colors.text }]}>{streakCount} Ngày</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>CHUỒI NGÀY</Text>
            </View>

            {/* Stat 2: Reading Count */}
            <View style={[styles.statCard, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="book" size={24} color={colors.primary} />
              <Text style={[styles.statVal, { color: colors.text }]}>{libraryStories.length} Truyện</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>ĐANG ĐỌC</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {/* Stat 3: Chapters Completed */}
            <View style={[styles.statCard, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
              <Text style={[styles.statVal, { color: colors.text }]}>128 Chap</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>HOÀN THÀNH</Text>
            </View>

            {/* Stat 4: Time Read */}
            <View style={[styles.statCard, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="time" size={24} color={colors.primary} />
              <Text style={[styles.statVal, { color: colors.text }]}>45 giờ</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>THỜI GIAN ĐỌC</Text>
            </View>
          </View>
        </View>

        {/* Filter Scrollable Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsRow}
          contentContainerStyle={{ gap: Spacing.two }}
        >
          {tabs.map((tab, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.tabChip,
                activeTab === idx && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
              ]}
              onPress={() => setActiveTab(idx)}
            >
              <Text
                style={[
                  styles.tabChipText,
                  { color: activeTab === idx ? colors.primary : colors.textSecondary }
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Library Content */}
        {libraryStories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color={colors.primary} style={{ marginBottom: Spacing.three }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Tủ Sách Trống</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Danh sách sách bạn lưu trữ và đang theo dõi sẽ xuất hiện tại đây.
            </Text>
            <Pressable
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.emptyBtnText}>Khám Phá Toàn Bộ Sách</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.booksGrid}>
            {libraryStories.map(story => (
              <Pressable
                key={story.id}
                style={styles.gridBookCard}
                onPress={() => router.push({ pathname: '/book-detail', params: { id: story.id } })}
              >
                <View style={styles.gridBookCover}>
                  {renderBookCover(story.title, story.genre)}
                </View>
                <Text style={[styles.gridBookTitle, { color: colors.text }]} numberOfLines={1}>
                  {story.title}
                </Text>
                <Text style={[styles.gridBookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                  {story.author}
                </Text>

                <View style={styles.progressRow}>
                  <Text style={[styles.currentChapterText, { color: colors.textSecondary }]} numberOfLines={1}>
                    {story.currentChapter || 'Chưa đọc'}
                  </Text>
                  <Text style={[styles.progressPercentText, { color: colors.text }]}>
                    {story.progressPercent}%
                  </Text>
                </View>

                {/* Progress bar fill */}
                <View style={[styles.barBg, { backgroundColor: colors.outlineVariant }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${story.progressPercent}%`
                      }
                    ]}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  titleSec: {
    paddingVertical: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statsBentoGrid: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
  },
  statVal: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLbl: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 2,
  },
  tabsRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: Spacing.four,
    paddingBottom: 2,
  },
  tabChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  tabChipText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.four,
  },
  emptyBtn: {
    height: 44,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  gridBookCard: {
    width: GRID_ITEM_WIDTH,
    marginBottom: Spacing.three,
  },
  gridBookCover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridBookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: Spacing.two,
  },
  gridBookAuthor: {
    fontSize: 11,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  currentChapterText: {
    fontSize: 10,
    flex: 1,
    marginRight: 4,
  },
  progressPercentText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  barBg: {
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  coverContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
  coverSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
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
    fontSize: 14,
    lineHeight: 18,
  },
});
