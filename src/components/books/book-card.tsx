import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Book } from '@/types/book';

type BookCardProps = {
  book: Book;
  variant?: 'vertical' | 'horizontal' | 'grid';
  onPress?: () => void;
};

export function BookCard({ book, variant = 'vertical', onPress }: BookCardProps) {
  const theme = useTheme();

  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.horizontalCard, { backgroundColor: `${theme.surfaceContainerLowest}CC`, borderColor: `${theme.outlineVariant}33` }]}>
        <Image source={{ uri: book.coverUrl }} style={styles.horizontalCover} contentFit="cover" />
        <View style={styles.horizontalContent}>
          <ThemedText style={styles.horizontalTitle}>{book.title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.author}>
            {book.author}
          </ThemedText>
          {book.genres?.[0] && (
            <View style={[styles.genreChip, { backgroundColor: theme.tertiaryFixed }]}>
              <ThemedText style={[styles.genreText, { color: theme.tertiary }]}>{book.genres[0]}</ThemedText>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={variant === 'grid' ? styles.gridItem : styles.verticalItem}>
      <View style={[styles.coverWrap, { backgroundColor: theme.surfaceContainerHigh }]}>
        <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
        {book.rating != null && (
          <View style={[styles.ratingBadge, { backgroundColor: `${theme.surface}E6` }]}>
            <ThemedText style={[styles.ratingText, { color: theme.primary }]}>★ {book.rating}</ThemedText>
          </View>
        )}
      </View>
      <ThemedText numberOfLines={2} style={styles.bookTitle}>
        {book.title}
      </ThemedText>
      {book.author ? (
        <ThemedText themeColor="textSecondary" numberOfLines={1} style={styles.author}>
          {book.author}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  verticalItem: {
    width: 140,
  },
  gridItem: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '33%',
  },
  coverWrap: {
    aspectRatio: 2 / 3,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  author: {
    fontSize: 12,
    marginTop: 2,
  },
  horizontalCard: {
    width: 280,
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.three,
  },
  horizontalCover: {
    width: 96,
    height: 144,
    borderRadius: Radius.md,
  },
  horizontalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '500',
    marginBottom: 4,
  },
  genreChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: 8,
  },
  genreText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
