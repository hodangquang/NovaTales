import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Modal, TextInput, Platform, ToastAndroid, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

export default function ReaderScreen() {
  const { id, chapterId } = useLocalSearchParams<{ id: string; chapterId: string }>();
  const { stories, coinsBalance, unlockChapter, saveBookmark, toggleStoryFavorite, comments, addComment, likeComment } = useApp();

  // Local settings states
  const [readerTheme, setReaderTheme] = useState<'White' | 'Sepia' | 'Dark'>('Sepia');
  const [readerFont, setReaderFont] = useState<'Serif' | 'Sans'>('Serif');
  const [readerFontSize, setReaderFontSize] = useState(16);
  const [chapterLocked, setChapterLocked] = useState(true);

  // Sheets visible
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Scroll position calculations
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const story = stories.find(s => s.id === id);

  // Chapters Mock resolved
  const chapters = Array.from({ length: story?.chaptersCount || 10 }, (_, index) => ({
    id: `chap_${index + 1}`,
    title: `Chương ${index + 1}: ${index === 41 ? 'Thức Tỉnh' : index === 5 ? 'Giao ước máu' : 'Chặng đường mới'}`,
    isVip: index >= 10 && story?.status === 'VIP',
    coinsPrice: 15
  }));

  const activeChapterIndex = chapters.findIndex(c => c.id === chapterId) ?? 0;
  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  // Set locked state based on chapter vip status
  useEffect(() => {
    if (activeChapter && activeChapter.isVip) {
      setChapterLocked(true);
    } else {
      setChapterLocked(false);
    }
  }, [chapterId]);

  if (!story) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Không tìm thấy thông tin tác phẩm.</Text>
      </SafeAreaView>
    );
  }

  // Set themes colors matching specs
  const getThemeStyles = () => {
    switch (readerTheme) {
      case 'White':
        return { bg: '#FFFFFF', text: '#1E1E1E', line: '#eae7e7' };
      case 'Dark':
        return { bg: '#161C1D', text: '#ECEFF1', line: '#2a2a2a' };
      default: // Sepia
        return { bg: '#FAF3E5', text: '#43301B', line: '#eae2ce' };
    }
  };

  const themeStyle = getThemeStyles();
  const fontStyle = readerFont === 'Serif' ? Fonts?.serif : Fonts?.sans;

  const handleUnlock = () => {
    const success = unlockChapter(story.id, activeChapter.coinsPrice);
    if (success) {
      setChapterLocked(false);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Mở khóa chương VIP thành công!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thành công', 'Mở khóa chương VIP thành công!');
      }
    } else {
      Alert.alert(
        'Số dư không đủ',
        'Số xu của bạn không đủ để mở khóa chương VIP này. Bạn có muốn nạp thêm xu không?',
        [
          { text: 'Để sau', style: 'cancel' },
          { text: 'Nạp xu', onPress: () => router.push('/wallet') }
        ]
      );
    }
  };

  const handleScroll = (event: any) => {
    const { y } = event.nativeEvent.contentOffset;
    const height = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;
    if (height > 0) {
      const progress = (y / height) * 100;
      setScrollProgress(progress);
      // Autosave progress
      saveBookmark(story.id, activeChapter.title, progress);
    }
  };

  const handleSendComment = () => {
    if (newCommentText.trim()) {
      addComment(story.id, newCommentText);
      setNewCommentText('');
    }
  };

  const chapterComments = comments.filter(c => c.chapterId === story.id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyle.bg }]}>
      
      {/* Top Floating Control Bar */}
      <View style={[styles.header, { backgroundColor: themeStyle.bg, borderBottomColor: themeStyle.line }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={themeStyle.text} />
        </Pressable>

        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: themeStyle.text }]} numberOfLines={1}>
            {story.title}
          </Text>
          <Text style={[styles.author, { color: themeStyle.text, opacity: 0.7 }]}>
            {activeChapter.title}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable onPress={() => toggleStoryFavorite(story.id)} style={styles.iconBtn}>
            <Ionicons
              name={story.isFavorited ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={story.isFavorited ? '#ba1a1a' : themeStyle.text}
            />
          </Pressable>
          <Pressable onPress={() => setSettingsVisible(true)} style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color={themeStyle.text} />
          </Pressable>
        </View>
      </View>

      {/* Linear progress line overlay */}
      <View style={styles.progressTrackerBg}>
        <View
          style={[
            styles.progressTrackerFill,
            {
              backgroundColor: colors.primary,
              width: `${scrollProgress}%`
            }
          ]}
        />
      </View>

      {/* Main text scroll content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.chapTitleText, { color: themeStyle.text, fontFamily: fontStyle }]}>
          {activeChapter.title}
        </Text>
        <View style={[styles.titleDivider, { backgroundColor: themeStyle.text, opacity: 0.15 }]} />

        {chapterLocked ? (
          /* Locked Prompt Card Overlay */
          <View style={[styles.lockedCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
            <Ionicons name="lock-closed" size={48} color={colors.primary} style={{ marginBottom: 12 }} />
            <Text style={[styles.lockedTitle, { color: colors.text }]}>Chương VIP</Text>
            <Text style={[styles.lockedDesc, { color: colors.textSecondary }]}>
              Nội dung tiếp theo dành riêng cho độc giả Premium. Vui lòng mở khóa để tiếp tục theo dõi hành trình u tối.
            </Text>
            <Pressable
              style={[styles.unlockBtn, { backgroundColor: colors.primary }]}
              onPress={handleUnlock}
            >
              <Text style={styles.unlockBtnText}>
                Mở khóa với {activeChapter.coinsPrice} Coins (Ví: {coinsBalance} Xu)
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Text content segments */
          <View>
            <Text
              style={[
                styles.contentText,
                {
                  color: themeStyle.text,
                  fontFamily: fontStyle,
                  fontSize: readerFontSize,
                  lineHeight: readerFontSize * 1.8
                }
              ]}
            >
              {story.content}
            </Text>

            {/* Inline Comments discussion box trigger */}
            <Pressable
              style={[styles.inlineCommentBox, { backgroundColor: `${colors.primary}18` }]}
              onPress={() => setCommentsVisible(true)}
            >
              <Ionicons name="chatbubbles" size={18} color={colors.primary} />
              <Text style={[styles.inlineCommentText, { color: colors.primary }]}>
                Thảo luận: "đứng trước bờ vực thẳm..." ({chapterComments.length} bình luận)
              </Text>
            </Pressable>

            <Text
              style={[
                styles.contentText,
                {
                  color: themeStyle.text,
                  fontFamily: fontStyle,
                  fontSize: readerFontSize,
                  lineHeight: readerFontSize * 1.8,
                  marginTop: Spacing.two
                }
              ]}
            >
              Cơn gió mùa đông quét qua Kepler lạnh buốt thấu xương. Minh Phạm nhắm chặt mắt, tưởng tượng về Trái Đất xa xôi nơi có biển xanh và cỏ cây thơm ngát. Mọi thứ giờ chỉ còn là cát bụi trong kho dữ liệu quang học. Nhân loại thực sự đã thua trước cỗ máy thông minh AI chăng? Câu trả lời dường như đang ẩn giấu trong hạt năng lượng mà anh đang nắm giữ chặt chẽ trong lòng bàn tay đầy vệt máu đỏ tươi...
            </Text>

            <View style={styles.footerInfo}>
              <Text style={[styles.footerText, { color: themeStyle.text, opacity: 0.5 }]}>
                Hết tác phẩm • NovaTales Sanctuary
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Reader Customize Settings Modal Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Cài Đặt Đọc</Text>
              <Pressable onPress={() => setSettingsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Themes Switcher */}
            <View style={styles.sheetSection}>
              <Text style={[styles.sheetSecTitle, { color: colors.textSecondary }]}>CHỦ ĐỀ ĐỌC</Text>
              <View style={styles.themesRow}>
                {['White', 'Sepia', 'Dark'].map(theme => (
                  <Pressable
                    key={theme}
                    style={[
                      styles.themeOption,
                      {
                        backgroundColor: theme === 'White' ? '#ffffff' : theme === 'Sepia' ? '#FAF3E5' : '#161C1D',
                        borderColor: readerTheme === theme ? colors.primary : colors.outlineVariant
                      }
                    ]}
                    onPress={() => setReaderTheme(theme as any)}
                  >
                    <Text
                      style={[
                        styles.themeOptionText,
                        { color: theme === 'Dark' ? '#ffffff' : '#333' }
                      ]}
                    >
                      {theme === 'White' ? 'Sáng' : theme === 'Sepia' ? 'Sepia' : 'Tối'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Fonts Selector */}
            <View style={styles.sheetSection}>
              <Text style={[styles.sheetSecTitle, { color: colors.textSecondary }]}>PHÔNG CHỮ</Text>
              <View style={styles.fontsRow}>
                {(['Serif', 'Sans'] as const).map(font => (
                  <Pressable
                    key={font}
                    style={[
                      styles.fontOption,
                      {
                        backgroundColor: readerFont === font ? colors.primary : colors.surfaceContainer,
                      }
                    ]}
                    onPress={() => setReaderFont(font)}
                  >
                    <Text
                      style={[
                        styles.fontOptionText,
                        { color: readerFont === font ? '#ffffff' : colors.text }
                      ]}
                    >
                      {font}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Font size adjustments */}
            <View style={styles.sheetSection}>
              <Text style={[styles.sheetSecTitle, { color: colors.textSecondary }]}>CỠ CHỮ ({readerFontSize}sp)</Text>
              <View style={styles.sizeRow}>
                <Pressable
                  style={[styles.sizeBtn, { backgroundColor: colors.surfaceContainer }]}
                  onPress={() => readerFontSize > 12 && setReaderFontSize(prev => prev - 2)}
                >
                  <Text style={[styles.sizeBtnText, { color: colors.text }]}>A-</Text>
                </Pressable>
                <Pressable
                  style={[styles.sizeBtn, { backgroundColor: colors.surfaceContainer }]}
                  onPress={() => readerFontSize < 32 && setReaderFontSize(prev => prev + 2)}
                >
                  <Text style={[styles.sizeBtnText, { color: colors.text }]}>A+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Inline Comments Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentsVisible}
        onRequestClose={() => setCommentsVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.commentSheet, { backgroundColor: colors.background }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                Thảo luận ({chapterComments.length})
              </Text>
              <Pressable onPress={() => setCommentsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.commentsList} showsVerticalScrollIndicator={false}>
              {chapterComments.length === 0 ? (
                <Text style={[styles.noComments, { color: colors.textSecondary }]}>
                  Chưa có thảo luận nào cho chương này. Hãy viết câu hỏi của bạn!
                </Text>
              ) : (
                chapterComments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={[styles.avatarBox, { backgroundColor: colors.outlineVariant }]}>
                      <Text style={styles.avatarLetters}>
                        {comment.authorName.substring(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.commentInfo}>
                      <View style={styles.rowBetween}>
                        <Text style={[styles.commentAuthor, { color: colors.text }]}>
                          {comment.authorName}
                        </Text>
                        <Text style={[styles.commentTime, { color: colors.outline }]}>
                          {comment.timeAgo}
                        </Text>
                      </View>
                      <Text style={[styles.commentContent, { color: colors.textSecondary }]}>
                        {comment.text}
                      </Text>
                      
                      <View style={styles.commentLikeRow}>
                        <Pressable onPress={() => likeComment(comment.id)}>
                          <Ionicons
                            name={comment.isLiked ? 'heart' : 'heart-outline'}
                            size={16}
                            color={comment.isLiked ? '#ba1a1a' : colors.textSecondary}
                          />
                        </Pressable>
                        <Text style={[styles.likeCountText, { color: colors.textSecondary }]}>
                          {comment.likesCount}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Input bar */}
            <View style={[styles.commentInputRow, { backgroundColor: colors.surfaceContainer, borderTopColor: colors.outlineVariant }]}>
              <TextInput
                style={[styles.commentInput, { color: colors.text, backgroundColor: colors.background }]}
                placeholder="Thêm bình luận thảo luận..."
                placeholderTextColor={colors.outline}
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <Pressable
                style={[styles.sendBtn, { backgroundColor: colors.primary }]}
                onPress={handleSendComment}
              >
                <Ionicons name="send" size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.three,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconBtn: {
    padding: 4,
  },
  progressTrackerBg: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressTrackerFill: {
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
  chapTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  titleDivider: {
    height: 1.5,
    width: 60,
    alignSelf: 'center',
    marginBottom: Spacing.four,
  },
  contentText: {
    textAlign: 'justify',
    fontSize: 16,
    lineHeight: 28,
  },
  lockedCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.four,
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lockedDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  unlockBtn: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    width: '100%',
  },
  unlockBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  inlineCommentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: Radius.md,
    marginVertical: Spacing.three,
    gap: Spacing.two,
  },
  inlineCommentText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  footerInfo: {
    marginTop: Spacing.five,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  commentSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 500,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.one,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sheetSection: {
    marginBottom: Spacing.three,
  },
  sheetSecTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.two,
  },
  themesRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  themeOption: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  fontsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  fontOption: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  sizeBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  commentsList: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  noComments: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  avatarLetters: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  commentInfo: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 10,
  },
  commentContent: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  commentLikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  likeCountText: {
    fontSize: 11,
  },
  commentInputRow: {
    flexDirection: 'row',
    padding: Spacing.three,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    paddingHorizontal: Spacing.three,
    fontSize: 13,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.two,
  },
});
