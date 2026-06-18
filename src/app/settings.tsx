import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopAppBar } from '@/components/layout/top-app-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SETTINGS = [
  { key: 'dark', label: 'Chế độ tối', type: 'switch' as const },
  { key: 'notify', label: 'Thông báo chương mới', type: 'switch' as const },
  { key: 'offline', label: 'Tự động tải khi có Wi-Fi', type: 'switch' as const },
  { key: 'font', label: 'Font chữ mặc định', value: 'EB Garamond' },
  { key: 'lang', label: 'Ngôn ngữ', value: 'Tiếng Việt' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <TopAppBar showBack onBack={() => router.back()} title="Cài đặt" showSearch={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest }]}>
          {SETTINGS.map((item, i) => (
            <View
              key={item.key}
              style={[
                styles.row,
                i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: `${theme.outlineVariant}1A` },
              ]}>
              <ThemedText style={styles.label}>{item.label}</ThemedText>
              {item.type === 'switch' ? (
                <Switch value trackColor={{ true: theme.primaryContainer }} />
              ) : (
                <ThemedText themeColor="textSecondary" style={styles.value}>
                  {item.value}
                </ThemedText>
              )}
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/writer-studio')}
          style={[styles.linkCard, { backgroundColor: theme.primaryFixed }]}>
          <MaterialIcons name="edit" size={22} color={theme.primary} />
          <View style={styles.linkContent}>
            <ThemedText style={[styles.linkTitle, { color: theme.primary }]}>Studio viết truyện</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.linkDesc}>
              Soạn thảo và xuất bản tác phẩm của bạn
            </ThemedText>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={theme.primary} />
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    margin: Spacing.marginMobile,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  label: { fontSize: 15, fontWeight: '500' },
  value: { fontSize: 14 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.marginMobile,
    padding: Spacing.three,
    borderRadius: Radius.xl,
    gap: Spacing.three,
  },
  linkContent: { flex: 1 },
  linkTitle: { fontSize: 15, fontWeight: '700' },
  linkDesc: { fontSize: 12, marginTop: 2 },
});
