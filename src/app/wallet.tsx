import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Radius } from '@/constants/theme';

export default function WalletScreen() {
  const { coinsBalance, transactions, topUpCoins } = useApp();
  const [activeTab, setActiveTab] = useState<'TOPUP' | 'HISTORY'>('TOPUP');

  // Checkout states
  const [selectedCoins, setSelectedCoins] = useState(250);
  const [selectedPrice, setSelectedPrice] = useState(4.99);
  const [selectedMethod, setSelectedMethod] = useState('MoMo E-Wallet');

  // Popup triggers
  const [paySuccessVisible, setPaySuccessVisible] = useState(false);
  const [payFailedVisible, setPayFailedVisible] = useState(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const COIN_PACKAGES = [
    { coins: 100, price: 1.99, desc: 'Gói cơ bản' },
    { coins: 250, price: 4.99, desc: 'Ưu đãi nhẹ (+15 xu)' },
    { coins: 500, price: 9.99, desc: 'Phổ biến nhất (+50 xu)' },
    { coins: 1000, price: 18.99, desc: 'Siêu hời (+150 xu)' }
  ];

  const METHODS = ['MoMo E-Wallet', 'ZaloPay E-Wallet', 'Thẻ Visa/Mastercard'];

  const handleCheckout = () => {
    // 90% success, 10% failure simulation
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      topUpCoins(selectedCoins, selectedPrice, selectedMethod);
      setPaySuccessVisible(true);
    } else {
      setPayFailedVisible(true);
    }
  };

  const handleRetry = () => {
    setPayFailedVisible(false);
    topUpCoins(selectedCoins, selectedPrice, selectedMethod);
    setPaySuccessVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ví & Giao dịch</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs toggle */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'TOPUP' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('TOPUP')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'TOPUP' ? colors.primary : colors.textSecondary }]}>
            Nạp Tiền
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'HISTORY' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'HISTORY' ? colors.primary : colors.textSecondary }]}>
            Lịch sử giao dịch
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'TOPUP' ? (
          <View>
            {/* Giant Balance Card */}
            <View style={[styles.balanceCard, { backgroundColor: colors.primaryContainer }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.balanceTitle}>SỐ DƯ XU NOVATALES</Text>
                <Ionicons name="logo-usd" size={24} color="#FFD700" />
              </View>
              <Text style={styles.balanceVal}>{coinsBalance.toLocaleString()} Xu</Text>
              <Text style={styles.balanceInfo}>Sử dụng xu để mở khóa các chương VIP cao cấp từ tác giả.</Text>
            </View>

            {/* Select packages */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Chọn gói nạp</Text>
            <View style={styles.packagesGrid}>
              {COIN_PACKAGES.map((pkg, idx) => {
                const isSelected = selectedCoins === pkg.coins;
                return (
                  <Pressable
                    key={idx}
                    style={[
                      styles.packageCell,
                      {
                        backgroundColor: isSelected ? `${colors.primary}12` : colors.surfaceContainerLow,
                        borderColor: isSelected ? colors.primary : colors.outlineVariant
                      }
                    ]}
                    onPress={() => {
                      setSelectedCoins(pkg.coins);
                      setSelectedPrice(pkg.price);
                    }}
                  >
                    <Ionicons name="star" size={20} color="#FFB74D" />
                    <Text style={[styles.pkgCoins, { color: colors.text }]}>{pkg.coins} Coins</Text>
                    <Text style={[styles.pkgPrice, { color: colors.primary }]}>${pkg.price}</Text>
                    <Text style={[styles.pkgDesc, { color: colors.textSecondary }]}>{pkg.desc}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Payment methods */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.four }]}>
              Phương thức thanh toán
            </Text>
            {METHODS.map(method => {
              const isSelected = selectedMethod === method;
              return (
                <Pressable
                  key={method}
                  style={[
                    styles.methodRow,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: isSelected ? colors.primary : colors.outlineVariant
                    }
                  ]}
                  onPress={() => setSelectedMethod(method)}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.methodLabel, { color: colors.text }]}>{method}</Text>
                </Pressable>
              );
            })}

            {/* Checkout CTA */}
            <Pressable
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutBtnText}>Thanh toán (${selectedPrice})</Text>
            </Pressable>
          </View>
        ) : (
          /* Transaction log */
          <View style={styles.historyContainer}>
            {transactions.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: Spacing.four }}>
                Chưa có giao dịch nào được ghi lại.
              </Text>
            ) : (
              transactions.map(txn => {
                const isTopup = txn.type === 'TOP_UP';
                return (
                  <View
                    key={txn.id}
                    style={[styles.txnItem, { borderBottomColor: colors.outlineVariant }]}
                  >
                    <View style={[styles.txnIconBox, { backgroundColor: isTopup ? 'rgba(46,125,50,0.1)' : 'rgba(186,26,26,0.1)' }]}>
                      <Ionicons
                        name={isTopup ? 'arrow-down-outline' : 'arrow-up-outline'}
                        size={18}
                        color={isTopup ? '#2E7D32' : '#ba1a1a'}
                      />
                    </View>
                    <View style={styles.txnInfo}>
                      <Text style={[styles.txnTitle, { color: colors.text }]} numberOfLines={1}>
                        {txn.title}
                      </Text>
                      <Text style={[styles.txnDate, { color: colors.textSecondary }]}>
                        {txn.date}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.txnAmount,
                        { color: isTopup ? '#2E7D32' : '#ba1a1a' }
                      ]}
                    >
                      {isTopup ? '+' : ''}{txn.amount} xu
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        )}

      </ScrollView>

      {/* Payment Success Modal */}
      <Modal animationType="fade" transparent={true} visible={paySuccessVisible}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            <Ionicons name="checkmark-circle" size={64} color="#2E7D32" style={{ marginBottom: 12 }} />
            <Text style={[styles.modalTitleText, { color: colors.text }]}>Thanh toán thành công</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Bạn vừa nạp thành công gói {selectedCoins} Coins vào ví. Số dư xu mới: {coinsBalance} Xu.
            </Text>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={() => setPaySuccessVisible(false)}
            >
              <Text style={styles.modalBtnText}>Tiếp tục</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Payment Failed Modal */}
      <Modal animationType="fade" transparent={true} visible={payFailedVisible}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            <Ionicons name="close-circle" size={64} color={colors.error} style={{ marginBottom: 12 }} />
            <Text style={[styles.modalTitleText, { color: colors.text }]}>Giao dịch thất bại</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Có lỗi xảy ra trong quá trình xử lý qua cổng {selectedMethod}. Vui lòng thử lại.
            </Text>
            
            <View style={styles.modalBtnRow}>
              <Pressable
                style={[styles.modalOutlineBtn, { borderColor: colors.primary }]}
                onPress={() => setPayFailedVisible(false)}
              >
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Hủy</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.primary, flex: 1 }]}
                onPress={handleRetry}
              >
                <Text style={styles.modalBtnText}>Thử lại</Text>
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
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six,
  },
  balanceCard: {
    borderRadius: 20,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  balanceVal: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: Spacing.two,
  },
  balanceInfo: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  packageCell: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  pkgCoins: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pkgPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pkgDesc: {
    fontSize: 10,
    textAlign: 'center',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkoutBtn: {
    height: 50,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: Spacing.two,
  },
  txnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  txnIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  txnInfo: {
    flex: 1,
  },
  txnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  txnDate: {
    fontSize: 11,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    elevation: 4,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  modalBtn: {
    height: 44,
    borderRadius: Radius.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
  },
  modalOutlineBtn: {
    width: 80,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
