import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TopAppBarProps = {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  showSearch?: boolean;
};

export function TopAppBar({
  showBack = false,
  onBack,
  title = 'Thư quán',
  showSearch = true,
}: TopAppBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: `${theme.surface}B3`,
          borderBottomColor: `${theme.outlineVariant}4D`,
        },
      ]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={onBack} style={styles.iconButton} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </Pressable>
        ) : (
          <MaterialIcons name="menu" size={24} color={theme.primary} />
        )}
        <ThemedText style={[styles.title, { color: theme.primary, fontFamily: 'serif' }]}>
          {title}
        </ThemedText>
        {showSearch && (
          <MaterialIcons name="search" size={24} color={theme.primary} style={styles.searchIcon} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
  },
  iconButton: {
    marginRight: Spacing.one,
  },
  searchIcon: {
    marginLeft: 'auto',
  },
});
