import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  selected?: boolean;
};

export function Chip({ label, selected = false }: ChipProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: selected ? `${theme.primaryContainer}1A` : theme.surfaceContainer,
        },
      ]}>
      <ThemedText
        style={[
          styles.label,
          { color: selected ? theme.primaryContainer : theme.textSecondary },
        ]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginRight: Spacing.two,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
