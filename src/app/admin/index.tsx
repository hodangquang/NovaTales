import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, useColorScheme, Switch, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Spacing, Radius } from '@/constants/theme';

type AdminTab = 'DASHBOARD' | 'USERS' | 'REPORTS';

// Dedicated professional administration console colors (independent of regular reader theme)
const AdminColors = {
  background: '#090D16',       // Ultra dark slate-blue
  surface: '#111827',          // Deep slate grey card
  surfaceLow: '#1F2937',       // Lighter slate grey for inputs/headers
  surfaceLowest: '#030712',    // True black container
  border: '#374151',           // Dark grey border
  borderFocus: '#6B7280',      // Active border
  primary: '#3B82F6',          // Electric Blue
  primaryMuted: 'rgba(59, 130, 246, 0.15)',
  success: '#10B981',          // Emerald Green
  successMuted: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',          // Amber Yellow
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',            // Crimson Red
  errorMuted: 'rgba(239, 68, 68, 0.1)',
  text: '#F9FAFB',             // High contrast white
  textSecondary: '#9CA3AF',    // Medium slate gray
  textMuted: '#6B7280',        // Dark slate gray for helper labels
};

export default function AdminPortalScreen() {
  const { 
    users, 
    reports, 
    stories, 
    transactions, 
    changeUserStatus, 
    approveStory, 
    rejectStory, 
    dismissReport,
    setCurrentRole,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  
  // Users Management states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'READER' | 'WRITER' | 'ADMIN'>('ALL');

  // Reports Management state
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );

  // Stats calculations
  const totalUsers = users.length;
  const totalStories = stories.length;
  const pendingReportsCount = reports.length;
  
  const totalRevenue = useMemo(() => {
    const sum = transactions
      .filter(t => t.type === 'TOP_UP')
      .reduce((acc, t) => acc + t.amount, 0);
    return (sum * 100).toLocaleString('vi-VN') + ' VNĐ';
  }, [transactions]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                            user.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'ALL' || user.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // Selected Report details
  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || reports[0] || null;
  }, [reports, selectedReportId]);

  const handleApprove = (storyTitle: string, rId: string) => {
    const storyObj = stories.find(s => storyTitle.includes(s.title));
    if (storyObj) {
      approveStory(storyObj.id, rId);
    } else {
      dismissReport(rId);
    }
  };

  const handleReject = (storyTitle: string, rId: string) => {
    const storyObj = stories.find(s => storyTitle.includes(s.title));
    if (storyObj) {
      rejectStory(storyObj.id, rId);
    } else {
      dismissReport(rId);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: AdminColors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={AdminColors.surfaceLowest} />
      
      {/* Admin Panel Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>NovaConsole</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>SYSTEM LIVE</Text>
            </View>
          </View>
          <Text style={styles.welcomeText}>
            Hệ thống Quản trị • {currentUser || 'Administrator'}
          </Text>
        </View>
        <Pressable
          style={styles.portalBtn}
          onPress={() => {
            setCurrentRole('READER');
            router.replace('/(tabs)');
          }}
        >
          <Ionicons name="exit-outline" size={16} color={AdminColors.text} />
          <Text style={styles.portalBtnText}>Thoát Console</Text>
        </Pressable>
      </View>

      {/* Admin Tabs */}
      <View style={styles.tabContainer}>
        {(['DASHBOARD', 'USERS', 'REPORTS'] as const).map(tab => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                if (tab === 'REPORTS' && reports.length > 0) {
                  setSelectedReportId(reports[0].id);
                }
              }}
              style={[
                styles.tabBtn,
                isSelected && styles.tabBtnActive
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isSelected ? AdminColors.primary : AdminColors.textSecondary }
                ]}
              >
                {tab === 'DASHBOARD' ? 'Tổng quan' : tab === 'USERS' ? 'Thành viên' : `Báo cáo (${pendingReportsCount})`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Main Console View */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'DASHBOARD' && (
          <View>
            {/* Bento metrics grids */}
            <View style={styles.bentoGrid}>
              <View style={styles.bentoCard}>
                <View style={styles.bentoHeader}>
                  <Text style={styles.bentoLabel}>TỔNG THÀNH VIÊN</Text>
                  <Ionicons name="people" size={18} color={AdminColors.primary} />
                </View>
                <Text style={styles.bentoValue}>{totalUsers}</Text>
                <View style={styles.growthBadge}>
                  <Ionicons name="trending-up" size={12} color={AdminColors.success} />
                  <Text style={styles.growthText}>+12% tuần này</Text>
                </View>
              </View>

              <View style={styles.bentoCard}>
                <View style={styles.bentoHeader}>
                  <Text style={styles.bentoLabel}>TỔNG TÁC PHẨM</Text>
                  <Ionicons name="book" size={18} color={AdminColors.success} />
                </View>
                <Text style={styles.bentoValue}>{totalStories}</Text>
                <View style={styles.growthBadge}>
                  <Ionicons name="add" size={12} color={AdminColors.success} />
                  <Text style={styles.growthText}>+4 tác phẩm mới</Text>
                </View>
              </View>

              <View style={styles.bentoCard}>
                <View style={styles.bentoHeader}>
                  <Text style={styles.bentoLabel}>YÊU CẦU DUYỆT</Text>
                  <Ionicons name="shield-outline" size={18} color={AdminColors.error} />
                </View>
                <Text style={[styles.bentoValue, { color: AdminColors.error }]}>{pendingReportsCount}</Text>
                <View style={[styles.growthBadge, { backgroundColor: AdminColors.errorMuted }]}>
                  <Ionicons name="warning" size={12} color={AdminColors.error} />
                  <Text style={[styles.growthText, { color: AdminColors.error }]}>Cần xử lý ngay</Text>
                </View>
              </View>

              <View style={styles.bentoCard}>
                <View style={styles.bentoHeader}>
                  <Text style={styles.bentoLabel}>DOANH THU HỆ THỐNG</Text>
                  <Ionicons name="wallet" size={18} color={AdminColors.warning} />
                </View>
                <Text style={[styles.bentoValue, { fontSize: 16 }]}>{totalRevenue}</Text>
                <View style={[styles.growthBadge, { backgroundColor: AdminColors.successMuted }]}>
                  <Text style={[styles.growthText, { color: AdminColors.success }]}>Cổng MoMo Active</Text>
                </View>
              </View>
            </View>

            {/* Admin growth line graph container */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeaderRow}>
                <View>
                  <Text style={styles.chartTitle}>Biểu đồ tăng trưởng Coin nạp</Text>
                  <Text style={styles.chartSubtitle}>Tuần hiện tại (Tính theo nghìn coin)</Text>
                </View>
                <View style={styles.chartLegend}>
                  <View style={styles.legendDot} />
                  <Text style={styles.legendText}>Doanh số</Text>
                </View>
              </View>

              {/* Grid representation */}
              <View style={styles.chartArea}>
                {/* Horizontal grid lines */}
                <View style={styles.chartGridLine} />
                <View style={styles.chartGridLine} />
                <View style={styles.chartGridLine} />
                
                <View style={styles.chartBarsContainer}>
                  {[
                    { label: 'T2', val: '40%', coins: '4.0k' },
                    { label: 'T3', val: '75%', coins: '7.5k' },
                    { label: 'T4', val: '55%', coins: '5.5k' },
                    { label: 'T5', val: '90%', coins: '9.0k' },
                    { label: 'T6', val: '100%', coins: '10k' },
                    { label: 'T7', val: '65%', coins: '6.5k' },
                    { label: 'CN', val: '80%', coins: '8.0k' }
                  ].map((bar, i) => (
                    <View key={i} style={styles.chartBarCol}>
                      <Text style={styles.barTooltipText}>{bar.coins}</Text>
                      <View style={[styles.barFill, { height: bar.val as any }]} />
                      <Text style={styles.barLabel}>{bar.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* System Log Console output */}
            <View style={styles.consoleLogCard}>
              <Text style={styles.consoleLogTitle}>System Audit Logs (Nhật ký kiểm toán)</Text>
              <View style={styles.consoleLogList}>
                <Text style={styles.logLine}>
                  <Text style={styles.logTime}>[16:32:04]</Text> <Text style={styles.logSuccess}>SYS_OK</Text> - Đồng bộ TypeScript thành công. Exit Code 0.
                </Text>
                <Text style={styles.logLine}>
                  <Text style={styles.logTime}>[16:20:15]</Text> <Text style={styles.logWarning}>WARN</Text> - Quét phát hiện bản dịch nghi vấn AI tại tác phẩm "Mật Mã Lãng Quên".
                </Text>
                <Text style={styles.logLine}>
                  <Text style={styles.logTime}>[16:11:42]</Text> <Text style={styles.logInfo}>INFO</Text> - User USR-004 đã bị đổi trạng thái hoạt động thành Banned.
                </Text>
                <Text style={styles.logLine}>
                  <Text style={styles.logTime}>[15:45:00]</Text> <Text style={styles.logInfo}>INFO</Text> - Đồng bộ cơ sở dữ liệu cổng nạp xu MOMO_PAY thành công.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 2. MEMBERS MANAGEMENT VIEW */}
        {activeTab === 'USERS' && (
          <View>
            {/* Search console */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={AdminColors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm thành viên theo tên hoặc email..."
                placeholderTextColor={AdminColors.textMuted}
                value={userSearch}
                onChangeText={setUserSearch}
              />
            </View>

            {/* Filter pills */}
            <View style={styles.filterPillsRow}>
              {(['ALL', 'READER', 'WRITER', 'ADMIN'] as const).map(role => {
                const isSelected = userRoleFilter === role;
                return (
                  <Pressable
                    key={role}
                    onPress={() => setUserRoleFilter(role)}
                    style={[
                      styles.pillBtn,
                      isSelected && styles.pillBtnActive
                    ]}
                  >
                    <Text style={[
                      styles.pillText,
                      { color: isSelected ? '#ffffff' : AdminColors.textSecondary }
                    ]}>
                      {role === 'ALL' ? 'Tất cả' : role === 'READER' ? 'Độc giả' : role === 'WRITER' ? 'Tác giả' : 'Admin'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Members table layout */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thText, { flex: 2.2 }]}>Thành viên</Text>
                <Text style={[styles.thText, { flex: 1.2 }]}>Vai trò</Text>
                <Text style={[styles.thText, { flex: 1.2 }]}>Trạng thái</Text>
                <Text style={[styles.thText, { flex: 1, textAlign: 'right' }]}>Thao tác</Text>
              </View>

              {filteredUsers.length === 0 ? (
                <Text style={styles.emptyTableText}>Không tìm thấy thành viên phù hợp trong database.</Text>
              ) : (
                filteredUsers.map(user => {
                  const isActive = user.status === 'Active';
                  return (
                    <View key={user.id} style={styles.tableRow}>
                      
                      {/* Name/Email Info */}
                      <View style={{ flex: 2.2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={styles.userInitialBox}>
                          <Text style={styles.userInitialText}>{user.avatarLetters}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tdName} numberOfLines={1}>{user.name}</Text>
                          <Text style={styles.tdEmail} numberOfLines={1}>{user.email}</Text>
                        </View>
                      </View>

                      {/* Role */}
                      <View style={{ flex: 1.2 }}>
                        <Text style={[
                          styles.roleTagText,
                          { color: user.role === 'ADMIN' ? AdminColors.error : user.role === 'WRITER' ? AdminColors.warning : AdminColors.primary }
                        ]}>
                          {user.role}
                        </Text>
                      </View>

                      {/* Status */}
                      <View style={{ flex: 1.2 }}>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: isActive ? AdminColors.successMuted : AdminColors.errorMuted }
                        ]}>
                          <Text style={[
                            styles.statusBadgeText,
                            { color: isActive ? AdminColors.success : AdminColors.error }
                          ]}>
                            {isActive ? 'Hoạt động' : 'Đã Khóa'}
                          </Text>
                        </View>
                      </View>

                      {/* Action trigger */}
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        {user.role !== 'ADMIN' ? (
                          <Pressable
                            style={[
                              styles.actionButton,
                              { borderColor: isActive ? AdminColors.error : AdminColors.success }
                            ]}
                            onPress={() => changeUserStatus(user.id, isActive ? 'Banned' : 'Active')}
                          >
                            <Text style={[
                              styles.actionButtonText,
                              { color: isActive ? AdminColors.error : AdminColors.success }
                            ]}>
                              {isActive ? 'Khóa' : 'Mở'}
                            </Text>
                          </Pressable>
                        ) : (
                          <Text style={styles.systemLockLabel}>Khóa</Text>
                        )}
                      </View>

                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* 3. MODERATION QUEUE VIEW */}
        {activeTab === 'REPORTS' && (
          <View>
            {reports.length === 0 ? (
              <View style={styles.emptyReportsCard}>
                <Ionicons name="shield-checkmark" size={54} color={AdminColors.success} />
                <Text style={styles.emptyReportsText}>Hàng đợi kiểm duyệt sạch!</Text>
                <Text style={styles.emptyReportsSub}>Không phát hiện tác phẩm nào có dấu hiệu vi phạm.</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.sectionHeading}>Hàng đợi báo cáo vi phạm ({reports.length})</Text>
                
                {/* Horizontal slider for reports */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.four }}>
                  {reports.map(rep => {
                    const isSelected = selectedReportId === rep.id;
                    return (
                      <Pressable
                        key={rep.id}
                        onPress={() => setSelectedReportId(rep.id)}
                        style={[
                          styles.queueCard,
                          isSelected && styles.queueCardActive
                        ]}
                      >
                        <Text style={[
                          styles.queueTitle,
                          { color: isSelected ? AdminColors.text : AdminColors.textSecondary }
                        ]} numberOfLines={1}>
                          {rep.subjectTitle}
                        </Text>
                        <Text style={[
                          styles.queueViolation,
                          { color: isSelected ? AdminColors.textSecondary : AdminColors.textMuted }
                        ]} numberOfLines={1}>
                          {rep.violationType}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Report detail panel */}
                {selectedReport && (
                  <View style={styles.reportDetailCard}>
                    
                    {/* Header */}
                    <View style={styles.detailHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailTitle}>{selectedReport.subjectTitle}</Text>
                        <Text style={styles.detailSubtitle}>Vị trí: {selectedReport.subjectDetail}</Text>
                      </View>
                      <View style={styles.reportIdBadge}>
                        <Text style={styles.reportIdText}>{selectedReport.id}</Text>
                      </View>
                    </View>

                    {/* AI Risk Flag Warning Card */}
                    <View style={[
                      styles.aiRiskBanner,
                      { borderColor: selectedReport.riskLevel.includes('Cao') ? AdminColors.error : AdminColors.warning }
                    ]}>
                      <Ionicons 
                        name="hardware-chip" 
                        size={20} 
                        color={selectedReport.riskLevel.includes('Cao') ? AdminColors.error : AdminColors.warning} 
                      />
                      <View>
                        <Text style={[
                          styles.aiRiskTitle,
                          { color: selectedReport.riskLevel.includes('Cao') ? AdminColors.error : AdminColors.warning }
                        ]}>
                          QUÉT AI DETECTOR FLAG
                        </Text>
                        <Text style={styles.aiRiskSub}>Độ tin cậy: {selectedReport.riskLevel}</Text>
                      </View>
                    </View>

                    {/* Violation contents code block */}
                    <View style={styles.bodySection}>
                      <Text style={styles.sectionLabel}>ĐOẠN TRÍCH NGHI VẤN (CODE SNAPSHOT):</Text>
                      <View style={styles.codeBlockContainer}>
                        <Text style={styles.codeBlockText}>
                          "{selectedReport.snippetText}"
                        </Text>
                      </View>

                      <Text style={[styles.sectionLabel, { marginTop: Spacing.three }]}>CHI TIẾT KHIẾU NẠI:</Text>
                      <Text style={styles.complaintDetailText}>
                        {selectedReport.complaintDetail}
                      </Text>
                    </View>

                    {/* Action buttons */}
                    <View style={styles.actionRow}>
                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: AdminColors.error }]}
                        onPress={() => {
                          handleReject(selectedReport.subjectTitle, selectedReport.id);
                          if (reports.length > 1) {
                            setSelectedReportId(reports.filter(r => r.id !== selectedReport.id)[0].id);
                          } else {
                            setSelectedReportId(null);
                          }
                        }}
                      >
                        <Ionicons name="trash-bin" size={16} color="#ffffff" />
                        <Text style={styles.actionBtnText}>GỠ BỎ TRUYỆN</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: AdminColors.success }]}
                        onPress={() => {
                          handleApprove(selectedReport.subjectTitle, selectedReport.id);
                          if (reports.length > 1) {
                            setSelectedReportId(reports.filter(r => r.id !== selectedReport.id)[0].id);
                          } else {
                            setSelectedReportId(null);
                          }
                        }}
                      >
                        <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                        <Text style={styles.actionBtnText}>DUYỆT AN TOÀN</Text>
                      </Pressable>
                    </View>

                  </View>
                )}
              </View>
            )}
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
    backgroundColor: AdminColors.surfaceLowest,
    borderBottomWidth: 1,
    borderBottomColor: AdminColors.border,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: AdminColors.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AdminColors.success,
  },
  liveText: {
    color: AdminColors.success,
    fontSize: 8,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: AdminColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  portalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AdminColors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
    gap: 6,
    backgroundColor: AdminColors.surface,
  },
  portalBtnText: {
    color: AdminColors.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: Spacing.half,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    borderRadius: Radius.lg,
    backgroundColor: AdminColors.surfaceLowest,
    borderWidth: 1,
    borderColor: AdminColors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: AdminColors.surface,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    paddingTop: Spacing.three,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.stackLg,
  },
  bentoCard: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    padding: Spacing.three,
    aspectRatio: 1.2,
    justifyContent: 'space-between',
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: AdminColors.textSecondary,
    letterSpacing: 0.5,
  },
  bentoValue: {
    fontSize: 22,
    fontWeight: '900',
    color: AdminColors.text,
    marginVertical: 4,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AdminColors.successMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  growthText: {
    color: AdminColors.success,
    fontSize: 9,
    fontWeight: '600',
  },
  chartCard: {
    borderRadius: 16,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    padding: Spacing.three,
    marginBottom: Spacing.stackLg,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AdminColors.text,
  },
  chartSubtitle: {
    fontSize: 10,
    color: AdminColors.textSecondary,
    marginTop: 2,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AdminColors.primary,
  },
  legendText: {
    fontSize: 10,
    color: AdminColors.textSecondary,
  },
  chartArea: {
    height: 140,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  chartGridLine: {
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    height: 35,
    width: '100%',
  },
  chartBarsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTooltipText: {
    color: AdminColors.textSecondary,
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  barFill: {
    width: 14,
    borderRadius: Radius.sm,
    backgroundColor: AdminColors.primary,
  },
  barLabel: {
    fontSize: 9,
    marginTop: 6,
    color: AdminColors.textSecondary,
    fontWeight: 'bold',
  },
  consoleLogCard: {
    borderRadius: 16,
    backgroundColor: AdminColors.surfaceLowest,
    borderWidth: 1,
    borderColor: AdminColors.border,
    padding: Spacing.three,
  },
  consoleLogTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AdminColors.textSecondary,
    marginBottom: Spacing.two,
  },
  consoleLogList: {
    gap: 8,
  },
  logLine: {
    fontSize: 11,
    color: AdminColors.textSecondary,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logTime: {
    color: AdminColors.textMuted,
  },
  logSuccess: {
    color: AdminColors.success,
    fontWeight: 'bold',
  },
  logWarning: {
    color: AdminColors.warning,
    fontWeight: 'bold',
  },
  logInfo: {
    color: AdminColors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AdminColors.border,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.three,
    height: 44,
    backgroundColor: AdminColors.surface,
    marginBottom: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: AdminColors.text,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.three,
  },
  pillBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: AdminColors.border,
    backgroundColor: AdminColors.surface,
  },
  pillBtnActive: {
    backgroundColor: AdminColors.primary,
    borderColor: AdminColors.primary,
  },
  pillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tableCard: {
    backgroundColor: AdminColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AdminColors.border,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: AdminColors.surfaceLow,
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: AdminColors.border,
  },
  thText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AdminColors.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: AdminColors.border,
  },
  emptyTableText: {
    color: AdminColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
  userInitialBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: AdminColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AdminColors.primary,
  },
  userInitialText: {
    color: AdminColors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tdName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AdminColors.text,
  },
  tdEmail: {
    fontSize: 11,
    color: AdminColors.textSecondary,
    marginTop: 1,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: AdminColors.surfaceLowest,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  systemLockLabel: {
    color: AdminColors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  emptyReportsCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: 8,
  },
  emptyReportsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AdminColors.text,
  },
  emptyReportsSub: {
    fontSize: 12,
    color: AdminColors.textSecondary,
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AdminColors.text,
    marginBottom: Spacing.two,
  },
  queueCard: {
    width: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AdminColors.border,
    padding: Spacing.two,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: AdminColors.surface,
  },
  queueCardActive: {
    backgroundColor: AdminColors.primaryMuted,
    borderColor: AdminColors.primary,
  },
  queueTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  queueViolation: {
    fontSize: 10,
    marginTop: 2,
  },
  reportDetailCard: {
    backgroundColor: AdminColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AdminColors.border,
    padding: Spacing.three,
    marginTop: Spacing.one,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AdminColors.text,
  },
  detailSubtitle: {
    fontSize: 11,
    color: AdminColors.textSecondary,
    marginTop: 2,
  },
  reportIdBadge: {
    backgroundColor: AdminColors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AdminColors.border,
  },
  reportIdText: {
    color: AdminColors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  aiRiskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: AdminColors.surfaceLowest,
    marginBottom: Spacing.three,
  },
  aiRiskTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  aiRiskSub: {
    fontSize: 11,
    color: AdminColors.textSecondary,
    marginTop: 1,
  },
  bodySection: {
    marginBottom: Spacing.four,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AdminColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },
  codeBlockContainer: {
    backgroundColor: AdminColors.surfaceLowest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AdminColors.border,
    padding: Spacing.two,
    marginTop: Spacing.one,
  },
  codeBlockText: {
    color: '#34D399',          // Monospace green text for code comparison
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  complaintDetailText: {
    fontSize: 13,
    color: AdminColors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.one,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 6,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
