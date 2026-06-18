import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Modal, useColorScheme, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

export default function ExploreScreen() {
  const {
    stories,
    filterSortBy,
    setFilterSortBy,
    filterStatus,
    setFilterStatus,
    filterPricing,
    setFilterPricing,
    filterGenres,
    toggleGenreFilter,
    resetFilters
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const BENTO_GENRES = [
    { name: 'Viễn Tưởng', color: '#6C5CE7', desc: 'Khám phá tương lai' },
    { name: 'Kỳ Ảo', color: '#E2849E', desc: 'Thế giới phép thuật' },
    { name: 'Lịch Sử', color: '#AC5D00', desc: 'Hành trình quá khứ' },
    { name: 'Lãng Mạn', color: '#2E7D32', desc: 'Giai điệu tình yêu' }
  ];

  const TREND_CHIPS = ['Kỳ Ảo', 'Viễn Tưởng', 'Lịch Sử', 'Lãng Mạn', 'Tiên Hiệp'];

  // Apply filters in memory
  const filteredStories = useMemo(() => {
    // 1. Search Query filter
    let list = stories.filter(s => s.status !== 'Bản nháp');

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      );
    }

    // 2. Genres check
    if (filterGenres.length > 0) {
      list = list.filter(s => filterGenres.includes(s.genre));
    }

    // 3. Status check
    if (filterStatus !== 'all') {
      const ongoing = filterStatus === 'ongoing';
      list = list.filter(s => (ongoing ? s.status === 'Đang ra' : s.status === 'Hoàn thành' || s.status === 'VIP'));
    }

    // 4. Pricing check
    if (filterPricing !== 'all') {
      const isVip = filterPricing === 'vip';
      list = list.filter(s => (isVip ? s.status === 'VIP' : s.status !== 'VIP'));
    }

    // 5. Sort By
    return [...list].sort((a, b) => {
      if (filterSortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filterSortBy === 'latest') {
        // Mock latest sort
        return b.title.localeCompare(a.title);
      }
      // default: popularity (views count string comparison)
      return b.views.localeCompare(a.views);
    });
  }, [stories, searchQuery, filterGenres, filterStatus, filterPricing, filterSortBy]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
          <Ionicons name="search" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Tìm kiếm tác phẩm, danh mục, tác giả..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.outline} />
            </Pressable>
          )}
        </View>

        {/* Filter Trigger Button */}
        <Pressable
          style={[styles.filterBtn, { backgroundColor: colors.primaryContainer }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color="#ffffff" />
          <Text style={styles.filterBtnText}>Lọc</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {searchQuery.length === 0 ? (
          <View>
            {/* Trend words */}
            <View style={styles.trendsContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Từ khóa nổi bật</Text>
              <View style={styles.trendRow}>
                {TREND_CHIPS.map((trend, i) => (
                  <Pressable
                    key={i}
                    style={[styles.trendChip, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
                    onPress={() => setSearchQuery(trend)}
                  >
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{trend}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Bento Grid */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.three }]}>
              Thể Loại Khám Phá
            </Text>
            <View style={styles.bentoGrid}>
              {BENTO_GENRES.map((item, index) => (
                <Pressable
                  key={index}
                  style={[styles.bentoCell, { backgroundColor: item.color }]}
                  onPress={() => setSearchQuery(item.name)}
                >
                  <Text style={styles.bentoName}>{item.name}</Text>
                  <Text style={styles.bentoDesc}>{item.desc}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {/* Search Results listing */}
            <Text style={[styles.resultsTitle, { color: colors.textSecondary }]}>
              Kết Quả Tìm Kiếm ({filteredStories.length})
            </Text>

            {filteredStories.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={colors.outline} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Không tìm thấy tác phẩm phù hợp. Thử từ khóa khác xem!
                </Text>
              </View>
            ) : (
              filteredStories.map(story => (
                <Pressable
                  key={story.id}
                  style={[styles.resultCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}
                  onPress={() => router.push({ pathname: '/book-detail', params: { id: story.id } })}
                >
                  <View style={styles.resultCover}>
                    {renderBookCover(story.title, story.genre)}
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultTitleText, { color: colors.text }]} numberOfLines={1}>
                      {story.title}
                    </Text>
                    <Text style={[styles.resultAuthor, { color: colors.textSecondary }]}>
                      {story.author}
                    </Text>
                    
                    <View style={styles.resultStats}>
                      <View style={styles.rowCenter}>
                        <Ionicons name="star" size={14} color="#FFD700" style={{ marginRight: 2 }} />
                        <Text style={[styles.ratingText, { color: colors.text }]}>{story.rating}</Text>
                      </View>
                      <Text style={[styles.viewsText, { color: colors.outline }]}>
                        Lượt xem: {story.views}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.outline} style={{ marginLeft: 'auto' }} />
                </Pressable>
              ))
            )}
          </View>
        )}

      </ScrollView>

      {/* Advanced Filters Modal Overlay */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Bộ lọc nâng cao</Text>
              <Pressable onPress={resetFilters} style={styles.resetBtn}>
                <Text style={[styles.resetText, { color: colors.primary }]}>RESET</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {/* Sort By section */}
              <View style={styles.modalSection}>
                <Text style={[styles.modalSecTitle, { color: colors.textSecondary }]}>SẮP XẾP THEO</Text>
                {[
                  { key: 'popularity', label: 'Độ phổ biến' },
                  { key: 'latest', label: 'Mới nhất' },
                  { key: 'rating', label: 'Đánh giá' }
                ].map(sort => (
                  <Pressable
                    key={sort.key}
                    style={styles.radioRow}
                    onPress={() => setFilterSortBy(sort.key)}
                  >
                    <Ionicons
                      name={filterSortBy === sort.key ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.radioLabel, { color: colors.text }]}>{sort.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Status Section */}
              <View style={styles.modalSection}>
                <Text style={[styles.modalSecTitle, { color: colors.textSecondary }]}>TRẠNG THÁI</Text>
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'ongoing', label: 'Đang ra' },
                  { key: 'completed', label: 'Hoàn thành' }
                ].map(status => (
                  <Pressable
                    key={status.key}
                    style={styles.radioRow}
                    onPress={() => setFilterStatus(status.key)}
                  >
                    <Ionicons
                      name={filterStatus === status.key ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.radioLabel, { color: colors.text }]}>{status.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Pricing Section */}
              <View style={styles.modalSection}>
                <Text style={[styles.modalSecTitle, { color: colors.textSecondary }]}>HÌNH THỨC</Text>
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'free', label: 'Miễn phí' },
                  { key: 'vip', label: 'VIP' }
                ].map(price => (
                  <Pressable
                    key={price.key}
                    style={styles.radioRow}
                    onPress={() => setFilterPricing(price.key)}
                  >
                    <Ionicons
                      name={filterPricing === price.key ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.radioLabel, { color: colors.text }]}>{price.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Genre Checkboxes */}
              <View style={styles.modalSection}>
                <Text style={[styles.modalSecTitle, { color: colors.textSecondary }]}>THỂ LOẠI</Text>
                {TREND_CHIPS.map(g => {
                  const isChecked = filterGenres.includes(g);
                  return (
                    <Pressable
                      key={g}
                      style={styles.radioRow}
                      onPress={() => toggleGenreFilter(g)}
                    >
                      <Ionicons
                        name={isChecked ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={[styles.radioLabel, { color: colors.text }]}>{g}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Apply Button */}
            <Pressable
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyBtnText}>Áp dụng bộ lọc</Text>
            </Pressable>
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
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    gap: 4,
  },
  filterBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  trendsContainer: {
    marginVertical: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  trendChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  bentoCell: {
    width: '47%',
    height: 110,
    borderRadius: 16,
    padding: Spacing.three,
    justifyContent: 'flex-end',
  },
  bentoName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bentoDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  resultsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: Spacing.three,
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.two,
    marginBottom: Spacing.two,
  },
  resultCover: {
    width: 50,
    height: 75,
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultInfo: {
    marginLeft: Spacing.three,
    justifyContent: 'center',
    flex: 1,
  },
  resultTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  resultAuthor: {
    fontSize: 11,
    marginTop: 2,
  },
  resultStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: 6,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  viewsText: {
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Spacing.five,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetBtn: {
    padding: 4,
  },
  resetText: {
    fontWeight: 'bold',
  },
  modalScroll: {
    padding: Spacing.four,
  },
  modalSection: {
    marginBottom: Spacing.four,
  },
  modalSecTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.two,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: Spacing.three,
  },
  applyBtn: {
    height: 50,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.four,
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  coverContainer: {
    flex: 1,
    padding: 6,
    justifyContent: 'flex-end',
  },
  coverSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  coverGenre: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 6,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coverTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
    fontSize: 9,
    lineHeight: 11,
  },
});
