import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Fonts, Radius } from '@/constants/theme';

export default function ProfileScreen() {
  const { currentUser, coinsBalance, setCurrentRole } = useApp();
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const QUICK_ACTIONS = [
    {
      icon: 'library-outline',
      tint: colors.primary,
      title: 'Thư viện của tôi',
      subtitle: 'Sách đang đọc & lưu',
      onPress: () => router.push('/library')
    },
    {
      icon: 'receipt-outline',
      tint: colors.secondary,
      title: 'Ví & Giao dịch',
      subtitle: 'Nạp xu & tiêu dùng',
      onPress: () => router.push('/wallet')
    },
    {
      icon: 'chatbubbles-outline',
      tint: '#FF8A65',
      title: 'Thảo luận đã đăng',
      subtitle: 'Bình luận & Đánh giá',
      onPress: () => {}
    },
    {
      icon: 'settings-outline',
      tint: colors.primary,
      title: 'Cài đặt hệ thống',
      subtitle: 'Dark Mode & Ngôn ngữ',
      onPress: () => {}
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card with sweep border glow */}
        <View style={[styles.profileCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
          <View style={styles.avatarBorder}>
            <View style={[styles.avatarBox, { backgroundColor: colors.surfaceContainerLow }]}>
              <Ionicons name="person" size={56} color={colors.outline} />
            </View>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>
            {currentUser || 'Minh Phạm'}
          </Text>
          <Text style={[styles.userHandle, { color: colors.textSecondary }]}>@minh_reads</Text>
          <Text style={[styles.userQuote, { color: colors.text, fontFamily: Fonts?.serif }]}>
            "Đọc sách là một cuộc trò chuyện với những bộ óc vĩ đại nhất."
          </Text>

          <Pressable style={[styles.editProfileBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.editProfileText}>Chỉnh sửa hồ sơ</Text>
          </Pressable>
        </View>

        {/* Stats Grid Bento */}
        <View style={styles.statsGrid}>
          {/* Books Read */}
          <View style={[styles.statCell, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
            <Text style={[styles.statVal, { color: colors.text }]}>142</Text>
            <Text style={[styles.statLbl, { color: colors.textSecondary }]}>TRUYỆN ĐÀ ĐỌC</Text>
          </View>

          {/* Coins balance (Interactive) */}
          <Pressable
            style={[styles.statCell, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}
            onPress={() => router.push('/wallet')}
          >
            <Ionicons name="logo-usd" size={24} color="#FFB74D" />
            <Text style={[styles.statVal, { color: colors.text }]}>
              {coinsBalance.toLocaleString()}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textSecondary }]}>XU HIỆN CÓ</Text>
          </Pressable>
        </View>

        {/* Bento Quick Actions Grid */}
        <View style={styles.gridContainer}>
          {QUICK_ACTIONS.map((action, i) => (
            <Pressable
              key={i}
              style={[
                styles.actionCell,
                { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }
              ]}
              onPress={action.onPress}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${action.tint}15` }]}>
                <Ionicons name={action.icon as any} size={18} color={action.tint} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {action.subtitle}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Switch portal portals (Admin / Writer Portal redirect cards) */}
        <View style={styles.portalSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cổng kết nối Portals</Text>

          {/* 1. Writer Portal */}
          <Pressable
            style={[styles.portalCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
            onPress={() => {
              setCurrentRole('WRITER');
              router.replace('/studio' as any);
            }}
          >
            <View style={styles.portalLeft}>
              <View style={[styles.portalIcon, { backgroundColor: colors.primaryContainer }]}>
                <Ionicons name="create" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={[styles.portalTitleText, { color: colors.text }]}>Writer Studio Portal</Text>
                <Text style={[styles.portalSubtext, { color: colors.textSecondary }]}>
                  Sáng tác truyện, theo dõi doanh số, quản lý draft
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.outline} />
          </Pressable>

          {/* 2. Admin Portal */}
          <Pressable
            style={[styles.portalCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
            onPress={() => {
              setCurrentRole('ADMIN');
              router.replace('/admin' as any);
            }}
          >
            <View style={styles.portalLeft}>
              <View style={[styles.portalIcon, { backgroundColor: '#AC5D00' }]}>
                <Ionicons name="shield" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={[styles.portalTitleText, { color: colors.text }]}>Admin Panel Portal</Text>
                <Text style={[styles.portalSubtext, { color: colors.textSecondary }]}>
                  Kiểm duyệt báo cáo vi phạm AI, khóa/mở khóa users
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.outline} />
          </Pressable>
        </View>

        {/* Dark Mode switcher segment helper */}
        <View style={[styles.settingRow, { borderBottomColor: colors.outlineVariant }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={22} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Chế độ Dark Mode (Giao diện)</Text>
          </View>
          <Switch
            value={systemDarkMode}
            onValueChange={setSystemDarkMode}
            trackColor={{ false: colors.outlineVariant, true: colors.primary }}
          />
        </View>

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
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarBorder: {
    width: 106,
    height: 106,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: '#cebdff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  avatarBox: {
    width: 90,
    height: 90,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts?.serif,
  },
  userHandle: {
    fontSize: 13,
    marginTop: 2,
  },
  userQuote: {
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    marginVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  editProfileBtn: {
    width: '100%',
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  statCell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLbl: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  actionCell: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionSub: {
    fontSize: 10,
    marginTop: 2,
  },
  portalSection: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  portalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    justifyContent: 'space-between',
  },
  portalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  portalIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  portalTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  portalSubtext: {
    fontSize: 10,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
