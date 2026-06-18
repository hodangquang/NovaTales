import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Radius } from '@/constants/theme';

export default function AlertsScreen() {
  const { notifications } = useApp();
  const [activeFilter, setActiveFilter] = useState(0); // 0: Tất cả, 1: Chưa đọc, 2: Bình luận, 3: Hệ thống
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const handleMarkAllRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 1:
        return localNotifications.filter(n => !n.isRead);
      case 2:
        return localNotifications.filter(n => n.type === 'comment');
      case 3:
        return localNotifications.filter(n => n.type === 'system');
      default:
        return localNotifications;
    }
  }, [localNotifications, activeFilter]);

  const filterLabels = ['Tất cả', 'Chưa đọc', 'Bình luận', 'Hệ thống'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Thông báo</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Theo dõi cập nhật từ hệ thống và độc giả.
          </Text>
        </View>
        <Pressable onPress={handleMarkAllRead}>
          <Text style={[styles.markReadText, { color: colors.primary }]}>Đọc tất cả</Text>
        </Pressable>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.two }}>
          {filterLabels.map((lbl, idx) => {
            const isSelected = activeFilter === idx;
            return (
              <Pressable
                key={idx}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceContainer,
                    borderColor: colors.outlineVariant
                  }
                ]}
                onPress={() => setActiveFilter(idx)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#ffffff' : colors.textSecondary }
                  ]}
                >
                  {lbl}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* List content */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.outline} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Hộp thư trống! Không có thông báo nào.
            </Text>
          </View>
        ) : (
          filteredNotifications.map(notif => {
            let iconName = 'notifications-outline';
            let iconColor: string = colors.primary;

            if (notif.type === 'chapter') {
              iconName = 'book-outline';
              iconColor = colors.primary;
            } else if (notif.type === 'comment') {
              iconName = 'chatbubble-ellipses-outline';
              iconColor = colors.secondary;
            } else if (notif.type === 'follower') {
              iconName = 'people-outline';
              iconColor = colors.primary;
            } else if (notif.type === 'system') {
              iconName = 'alert-circle-outline';
              iconColor = '#AC5D00';
            }

            return (
              <View
                key={notif.id}
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: notif.isRead ? 'rgba(0,0,0,0.02)' : colors.surfaceContainerLowest,
                    borderColor: notif.isRead ? colors.outlineVariant : colors.primary
                  }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                    <Ionicons name={iconName as any} size={20} color={iconColor} />
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <Text style={[styles.cardTime, { color: colors.outline }]}>
                      {notif.timestamp}
                    </Text>
                  </View>
                  {!notif.isRead && (
                    <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                  )}
                </View>

                <View style={styles.cardBody}>
                  <Text style={[styles.cardMsg, { color: colors.textSecondary }]}>
                    {notif.message}
                  </Text>

                  {/* Nested Quotation blockquote if comment quotes exist */}
                  {notif.highlightQuote && (
                    <View style={[styles.quoteBlock, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
                      <Text style={[styles.quoteText, { color: colors.textSecondary }]}>
                        {notif.highlightQuote}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
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
    alignItems: 'baseline',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  filterRow: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
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
  },
  notifCard: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.three,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardTime: {
    fontSize: 10,
    marginTop: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.two,
  },
  cardBody: {
    marginTop: Spacing.two,
    paddingLeft: 44, // Align with title info
  },
  cardMsg: {
    fontSize: 13,
    lineHeight: 18,
  },
  quoteBlock: {
    borderLeftWidth: 3,
    padding: Spacing.two,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
