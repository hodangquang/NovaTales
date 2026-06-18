import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, FlatList, Dimensions, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const { currentRole, currentUser, signOut, stories, claimStreakReward } = useApp();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  // Redirect to onboarding if not logged in
  useEffect(() => {
    if (currentRole === 'GUEST') {
      router.replace('/onboarding');
    }
  }, [currentRole]);

  if (currentRole === 'GUEST') {
    return null;
  }

  // Filter out drafts from public dashboard
  const publicStories = stories.filter(s => s.status !== 'Bản nháp');

  // Suggested stories (e.g. VIP or highly rated ones)
  const suggestedStories = publicStories.filter(s => s.rating >= 4.7);

  // Continue reading item (mocked or taken from progress > 0)
  const continueReadingStory = publicStories.find(s => s.progressPercent > 0);

  const renderBookCover = (title: string, genre: string, isBig = false) => {
    // Generate simple beautiful color pairs based on title length
    let bgColors = ['#5341CD', '#160066'];
    if (title.length % 4 === 0) bgColors = ['#6C5CE7', '#322A75'];
    else if (title.length % 4 === 1) bgColors = ['#E2849E', '#5952AF'];
    else if (title.length % 4 === 2) bgColors = ['#ac5d00', '#2F1500'];

    return (
      <View style={[styles.coverContainer, { backgroundColor: bgColors[0] }]}>
        {/* Spine shadow overlay */}
        <View style={styles.coverSpine} />
        <View style={styles.coverContent}>
          <Text style={styles.coverGenre}>{genre.toUpperCase()}</Text>
          <Text style={[styles.coverTitle, { fontSize: isBig ? 15 : 12 }]}>
            {title.split(' ').slice(0, 3).join(' ')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header bar */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.brandText, { color: colors.primary }]}>NovaTales</Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Chào thế giới văn học của {currentUser || 'độc giả'}
          </Text>
        </View>
        <Pressable
          style={[styles.logoutBtn, { borderColor: colors.outlineVariant }]}
          onPress={() => {
            signOut();
            router.replace('/login');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Event Banner */}
        <View style={[styles.eventBanner, { backgroundColor: '#140F2D' }]}>
          {/* Subtle decorative vector lines */}
          <View style={styles.eventGrid} />
          
          <View style={styles.eventContent}>
            <View style={[styles.eventTag, { backgroundColor: colors.primaryContainer }]}>
              <Text style={styles.eventTagText}>SỰ KIỆN ĐẶC BIỆT</Text>
            </View>
            <Text style={styles.eventTitle}>Cuộc Thi Sáng Tác Mùa Thu 2024</Text>
            <Text style={styles.eventDesc} numberOfLines={1}>
              Giải thưởng cực đỉnh lên tới 50.000.000 VNĐ đang chờ đợi các ngòi bút xuất thế...
            </Text>
          </View>
        </View>

        {/* AI Suggested Horizontal Row */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Gợi Ý Cho Bạn</Text>
            <Pressable onPress={() => router.push('/explore')}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>Xem tất cả</Text>
            </Pressable>
          </View>

          <FlatList
            data={suggestedStories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.bookCard}
                onPress={() => router.push({ pathname: '/book-detail', params: { id: item.id } })}
              >
                {renderBookCover(item.title, item.genre)}
                <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.bookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.author}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Continue Reading Bookmark block */}
        {continueReadingStory && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.two }]}>
              Tiếp Tục Đọc
            </Text>
            <Pressable
              style={[styles.continueCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
              onPress={() => router.push({ pathname: '/reader', params: { id: continueReadingStory.id } })}
            >
              <View style={styles.continueRow}>
                <View style={styles.continueCover}>
                  {renderBookCover(continueReadingStory.title, continueReadingStory.genre)}
                </View>
                <View style={styles.continueInfo}>
                  <Text style={[styles.continueTitle, { color: colors.text }]} numberOfLines={1}>
                    {continueReadingStory.title}
                  </Text>
                  <Text style={[styles.continueChapter, { color: colors.textSecondary }]}>
                    {continueReadingStory.currentChapter}
                  </Text>
                  
                  {/* Linear progress bar */}
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.outlineVariant }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            backgroundColor: colors.primary,
                            width: `${continueReadingStory.progressPercent}%`
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                      {continueReadingStory.progressPercent}%
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Literature Quote Card */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
          <Text style={[styles.quoteText, { color: colors.primary }]}>
            “Mỗi trang giấy trắng là một thế giới chờ được khám phá, một câu chuyện đang khao khát được kể.”
          </Text>
        </View>

        {/* Dynamic Catalog Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.two }]}>
            Khám phá tủ sách đặc sắc
          </Text>

          {publicStories.map(story => (
            <Pressable
              key={story.id}
              style={[
                styles.storyRow,
                { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }
              ]}
              onPress={() => router.push({ pathname: '/book-detail', params: { id: story.id } })}
            >
              <View style={styles.rowLayout}>
                <View style={styles.rowCover}>
                  {renderBookCover(story.title, story.genre)}
                </View>
                <View style={styles.rowInfo}>
                  <View style={styles.titleLine}>
                    <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                      {story.title}
                    </Text>
                    {story.status === 'VIP' && (
                      <View style={styles.vipBadge}>
                        <Text style={styles.vipText}>VIP</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.rowAuthor, { color: colors.primary }]}>
                    Tác giả: {story.author}
                  </Text>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                    {story.content}
                  </Text>

                  <View style={styles.statsRow}>
                    <Text style={[styles.statsText, { color: colors.outline }]}>
                      {story.views} lượt đọc • {story.genre}
                    </Text>
                    <Pressable
                      style={[styles.readBtn, { backgroundColor: colors.primary }]}
                      onPress={() => router.push({ pathname: '/reader', params: { id: story.id } })}
                    >
                      <Text style={styles.readBtnText}>Đọc ngay</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
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
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  eventBanner: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: Spacing.three,
    marginBottom: Spacing.stackLg,
    position: 'relative',
  },
  eventGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#ffffff',
    margin: 10,
    borderRadius: 10,
  },
  eventContent: {
    zIndex: 2,
  },
  eventTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: Spacing.one,
  },
  eventTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  section: {
    marginBottom: Spacing.stackLg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  suggestedList: {
    gap: Spacing.three,
  },
  bookCard: {
    width: 110,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: Spacing.one,
  },
  bookAuthor: {
    fontSize: 11,
    marginTop: 2,
  },
  continueCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueCover: {
    width: 48,
    height: 72,
    borderRadius: 6,
    overflow: 'hidden',
  },
  continueInfo: {
    flex: 1,
    marginLeft: Spacing.three,
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  continueChapter: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  quoteCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.stackLg,
    borderStyle: 'dashed',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Fonts?.serif,
  },
  storyRow: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  rowLayout: {
    flexDirection: 'row',
  },
  rowCover: {
    width: 70,
    height: 105,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rowInfo: {
    flex: 1,
    marginLeft: Spacing.three,
    justifyContent: 'space-between',
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
    flex: 1,
    marginRight: 6,
  },
  vipBadge: {
    backgroundColor: '#FFB74D',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  vipText: {
    color: '#5D4037',
    fontSize: 8,
    fontWeight: 'bold',
  },
  rowAuthor: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  rowDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statsText: {
    fontSize: 11,
  },
  readBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  readBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  coverContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-end',
    position: 'relative',
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
    lineHeight: 14,
  },
});
