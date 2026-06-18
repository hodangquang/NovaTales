import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, useColorScheme, Switch, ToastAndroid, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Radius } from '@/constants/theme';

type StudioTab = 'CREATE' | 'EDITOR' | 'ANALYTICS';

export default function WriterStudioScreen() {
  const { 
    stories, 
    drafts, 
    saveDraft, 
    submitNewStory, 
    setCurrentRole,
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<StudioTab>('CREATE');

  // Story Creator Form States
  const [storyTitle, setStoryTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Viễn Tưởng');
  const [synopsis, setSynopsis] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Kỳ ảo', 'Hành động']);

  // Editor Canvas States
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [isVipChapter, setIsVipChapter] = useState(false);
  const [coinsPrice, setCoinsPrice] = useState('15');
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const GENRES = ['Viễn Tưởng', 'Kỳ Ảo', 'Kiếm Hiệp', 'Lãng Mạn', 'Đô Thị', 'Trinh Thám'];

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Thành công', msg);
    }
  };

  // Tag list operations
  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  // Submit Story Creator
  const handleSubmitStory = () => {
    if (!storyTitle.trim() || !synopsis.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tiêu đề và tóm tắt tác phẩm.');
      return;
    }
    submitNewStory(storyTitle, selectedGenre, synopsis, tags);
    showToast('Tạo tác phẩm mới thành công!');
    setStoryTitle('');
    setSynopsis('');
    setTags(['Kỳ ảo', 'Hành động']);
  };

  // Save Draft Canvas
  const handleSaveDraft = () => {
    if (!chapterTitle.trim() || !chapterContent.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền tiêu đề chương và nội dung.');
      return;
    }
    const priceNum = isVipChapter ? parseInt(coinsPrice, 10) || 0 : 0;
    saveDraft(chapterTitle, chapterContent, isVipChapter, priceNum);
    showToast('Đã lưu chương bản nháp thành công!');
    setChapterTitle('');
    setChapterContent('');
    setIsVipChapter(false);
  };

  // Word Counter
  const wordCount = useMemo(() => {
    const cleanContent = chapterContent.trim();
    if (!cleanContent) return 0;
    return cleanContent.split(/\s+/).filter(Boolean).length;
  }, [chapterContent]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Studio Header */}
      <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
        <View>
          <Text style={[styles.brandText, { color: colors.primary }]}>NovaTales Studio</Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Nhà sáng tác: {currentUser || 'Tác giả'}
          </Text>
        </View>
        <Pressable
          style={[styles.portalBtn, { backgroundColor: colors.primaryContainer }]}
          onPress={() => {
            setCurrentRole('READER');
            router.replace('/(tabs)');
          }}
        >
          <Ionicons name="book-outline" size={16} color="#ffffff" />
          <Text style={styles.portalBtnText}>Độc giả</Text>
        </Pressable>
      </View>

      {/* Tabs list */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surfaceContainer }]}>
        {(['CREATE', 'EDITOR', 'ANALYTICS'] as const).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabBtn,
              activeTab === tab && [styles.tabBtnActive, { backgroundColor: colors.surfaceContainerLowest }]
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.textSecondary }
              ]}
            >
              {tab === 'CREATE' ? 'Tạo tác phẩm' : tab === 'EDITOR' ? 'Soạn chương' : 'Số liệu & Thống kê'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Scrollable body */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. STORY CREATOR TAB */}
        {activeTab === 'CREATE' && (
          <View style={styles.formContainer}>
            <Text style={[styles.formHeading, { color: colors.text }]}>Đăng ký Tác phẩm Mới</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>TÊN TÁC PHẨM</Text>
              <TextInput
                style={[styles.inputSingle, { color: colors.text, borderColor: colors.outlineVariant }]}
                placeholder="Ví dụ: Đại Mạc Hoang Vu"
                placeholderTextColor={colors.outline}
                value={storyTitle}
                onChangeText={setStoryTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>THỂ LOẠI CHÍNH</Text>
              <View style={styles.genreChipsRow}>
                {GENRES.map(g => (
                  <Pressable
                    key={g}
                    onPress={() => setSelectedGenre(g)}
                    style={[
                      styles.genreChip,
                      { 
                        backgroundColor: selectedGenre === g ? colors.primary : colors.surfaceContainer,
                        borderColor: colors.outlineVariant
                      }
                    ]}
                  >
                    <Text style={[
                      styles.genreChipText,
                      { color: selectedGenre === g ? '#ffffff' : colors.textSecondary }
                    ]}>
                      {g}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>GIỚI THIỆU TÓM TẮT (SYNOPSIS)</Text>
              <TextInput
                style={[styles.inputMulti, { color: colors.text, borderColor: colors.outlineVariant }]}
                placeholder="Nhập phần tóm tắt cốt truyện lôi cuốn để thu hút người đọc..."
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={6}
                value={synopsis}
                onChangeText={setSynopsis}
              />
            </View>

            {/* Tag Flow collector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>CÁC THẺ TAGS (TỐI ĐA 5)</Text>
              <View style={styles.tagInputRow}>
                <TextInput
                  style={[styles.tagInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                  placeholder="Thêm tag..."
                  placeholderTextColor={colors.outline}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                />
                <Pressable style={[styles.tagAddBtn, { backgroundColor: colors.primary }]} onPress={handleAddTag}>
                  <Ionicons name="add" size={20} color="#ffffff" />
                </Pressable>
              </View>

              <View style={styles.collectedTagsRow}>
                {tags.map(t => (
                  <View key={t} style={[styles.collectedTag, { backgroundColor: colors.primaryFixed }]}>
                    <Text style={[styles.collectedTagText, { color: colors.onPrimaryFixed }]}>{t}</Text>
                    <Pressable onPress={() => handleRemoveTag(t)}>
                      <Ionicons name="close-circle" size={14} color={colors.onPrimaryFixed} style={{ marginLeft: 4 }} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>

            <Pressable style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleSubmitStory}>
              <Text style={styles.submitBtnText}>Khởi Tạo Tác Phẩm</Text>
            </Pressable>
          </View>
        )}

        {/* 2. EDITOR CANVAS TAB */}
        {activeTab === 'EDITOR' && (
          <View style={styles.formContainer}>
            <Text style={[styles.formHeading, { color: colors.text }]}>Soạn thảo chương mới</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>TIÊU ĐỀ CHƯƠNG</Text>
              <TextInput
                style={[styles.inputSingle, { color: colors.text, borderColor: colors.outlineVariant }]}
                placeholder="Chương 1: Khởi đầu mới..."
                placeholderTextColor={colors.outline}
                value={chapterTitle}
                onChangeText={setChapterTitle}
              />
            </View>

            {/* Simulated formatting tool belt */}
            <View style={[styles.toolBelt, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
              <Pressable 
                onPress={() => setBoldActive(!boldActive)}
                style={[styles.toolBtn, boldActive && { backgroundColor: colors.outlineVariant }]}
              >
                <MaterialIcons name="format-bold" size={18} color={colors.text} />
              </Pressable>
              <Pressable 
                onPress={() => setItalicActive(!italicActive)}
                style={[styles.toolBtn, italicActive && { backgroundColor: colors.outlineVariant }]}
              >
                <MaterialIcons name="format-italic" size={18} color={colors.text} />
              </Pressable>
              <Pressable 
                onPress={() => setUnderlineActive(!underlineActive)}
                style={[styles.toolBtn, underlineActive && { backgroundColor: colors.outlineVariant }]}
              >
                <MaterialIcons name="format-underlined" size={18} color={colors.text} />
              </Pressable>
              <View style={styles.toolSeparator} />
              
              <Text style={[styles.wordCountBadge, { color: colors.textSecondary }]}>
                {wordCount} từ
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.editorInput, 
                  { 
                    color: colors.text, 
                    borderColor: colors.outlineVariant,
                    fontWeight: boldActive ? 'bold' : 'normal',
                    fontStyle: italicActive ? 'italic' : 'normal',
                    textDecorationLine: underlineActive ? 'underline' : 'none'
                  }
                ]}
                placeholder="Nhập nội dung chương truyện tại đây..."
                placeholderTextColor={colors.outline}
                multiline
                value={chapterContent}
                onChangeText={setChapterContent}
              />
            </View>

            {/* VIP configuration switches */}
            <View style={[styles.vipConfigRow, { borderColor: colors.outlineVariant }]}>
              <View>
                <Text style={[styles.vipLabel, { color: colors.text }]}>Thiết lập Chương VIP</Text>
                <Text style={[styles.vipSub, { color: colors.textSecondary }]}>Yêu cầu độc giả trả phí xu để đọc chương này</Text>
              </View>
              <Switch
                value={isVipChapter}
                onValueChange={setIsVipChapter}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={isVipChapter ? colors.primary : colors.outline}
              />
            </View>

            {isVipChapter && (
              <View style={styles.priceContainer}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>GIÁ XU MỞ KHÓA</Text>
                <View style={styles.priceInputRow}>
                  <TextInput
                    style={[styles.priceInput, { color: colors.text, borderColor: colors.outlineVariant }]}
                    keyboardType="number-pad"
                    value={coinsPrice}
                    onChangeText={setCoinsPrice}
                  />
                  <Text style={[styles.coinsText, { color: colors.text }]}>Coins</Text>
                </View>
              </View>
            )}

            <Pressable style={[styles.submitBtn, { backgroundColor: colors.primary, marginTop: Spacing.four }]} onPress={handleSaveDraft}>
              <Text style={styles.submitBtnText}>Lưu và Công bố Chương</Text>
            </Pressable>
          </View>
        )}

        {/* 3. ANALYTICS TAB */}
        {activeTab === 'ANALYTICS' && (
          <View>
            <Text style={[styles.formHeading, { color: colors.text }]}>Số liệu tác giả 7 ngày qua</Text>

            {/* Pure CSS bar chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Lượt đọc chương mới hàng ngày</Text>
              
              <View style={styles.chartBarsContainer}>
                {[
                  { label: 'T2', val: 450, h: '45%' },
                  { label: 'T3', val: 780, h: '78%' },
                  { label: 'T4', val: 620, h: '62%' },
                  { label: 'T5', val: 950, h: '95%' },
                  { label: 'T6', val: 1200, h: '100%' },
                  { label: 'T7', val: 890, h: '89%' },
                  { label: 'CN', val: 1100, h: '98%' },
                ].map((bar, i) => (
                  <View key={i} style={styles.chartBarCol}>
                    <Text style={styles.barValText}>{bar.val}</Text>
                    <View style={[styles.barFill, { height: bar.h as any, backgroundColor: colors.primary }]} />
                    <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{bar.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Revenue Structure Segmented Progress bar */}
            <View style={[styles.analyticBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
              <Text style={[styles.boxTitle, { color: colors.text }]}>Cơ cấu Thu nhập (Tháng này)</Text>
              
              {/* Horizontal stacked progress representation */}
              <View style={styles.stackedBarContainer}>
                <View style={[styles.stackedBarPart, { width: '65%', backgroundColor: '#6C5CE7' }]} />
                <View style={[styles.stackedBarPart, { width: '25%', backgroundColor: '#FF8A00' }]} />
                <View style={[styles.stackedBarPart, { width: '10%', backgroundColor: '#00C853' }]} />
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#6C5CE7' }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>VIP Coins (65%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF8A00' }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>Donate (25%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#00C853' }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>Quảng cáo (10%)</Text>
                </View>
              </View>
            </View>

            {/* Age Demographics progress columns */}
            <View style={[styles.analyticBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
              <Text style={[styles.boxTitle, { color: colors.text }]}>Nhân khẩu học Độc giả (Độ tuổi)</Text>
              
              <View style={styles.demoList}>
                {[
                  { range: '13 - 18 tuổi', percent: 30, w: '30%', color: colors.primary },
                  { range: '19 - 25 tuổi', percent: 50, w: '50%', color: colors.primary },
                  { range: '26 - 35 tuổi', percent: 15, w: '15%', color: colors.primary },
                  { range: 'Khác', percent: 5, w: '5%', color: colors.primary }
                ].map((demo, i) => (
                  <View key={i} style={styles.demoRow}>
                    <Text style={[styles.demoLabel, { color: colors.text }]}>{demo.range}</Text>
                    <View style={styles.demoProgressContainer}>
                      <View style={[styles.demoProgressBg, { backgroundColor: colors.outlineVariant }]}>
                        <View style={[styles.demoProgressFill, { width: demo.w as any, backgroundColor: demo.color }]} />
                      </View>
                      <Text style={[styles.demoPercent, { color: colors.textSecondary }]}>{demo.percent}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  brandText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 12,
    marginTop: 2,
  },
  portalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    gap: 6,
  },
  portalBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: Spacing.half,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    borderRadius: Radius.lg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    paddingTop: Spacing.three,
  },
  formContainer: {
    paddingVertical: Spacing.two,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  inputGroup: {
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  inputSingle: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    height: 48,
    paddingHorizontal: Spacing.two,
    fontSize: 14,
  },
  genreChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.one,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1.2,
  },
  genreChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputMulti: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.two,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    height: 44,
    paddingHorizontal: Spacing.two,
    fontSize: 14,
  },
  tagAddBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectedTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.two,
  },
  collectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  collectedTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  submitBtn: {
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  toolBelt: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.one,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    height: 40,
  },
  toolBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  toolSeparator: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
  },
  wordCountBadge: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 8,
  },
  editorInput: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    minHeight: 240,
    padding: Spacing.two,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  vipConfigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  vipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  vipSub: {
    fontSize: 10,
    marginTop: 2,
  },
  priceContainer: {
    marginBottom: Spacing.three,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    width: 80,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    height: 44,
    paddingHorizontal: Spacing.two,
    fontSize: 14,
    textAlign: 'center',
  },
  coinsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: Spacing.three,
    marginBottom: Spacing.stackLg,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  barFill: {
    width: 16,
    borderRadius: Radius.sm,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '500',
  },
  analyticBox: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: Spacing.three,
    marginBottom: Spacing.stackLg,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  stackedBarContainer: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: Spacing.three,
  },
  stackedBarPart: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  demoList: {
    gap: 12,
  },
  demoRow: {
    gap: 4,
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  demoProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoProgressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  demoProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  demoPercent: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'right',
  },
});
