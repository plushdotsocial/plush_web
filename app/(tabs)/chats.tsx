import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { type ChatMatch } from '@/data/mock';
import { useMatches } from '@/store/matches';

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const { matches } = useMatches();
  const newMatches = matches.filter((m) => m.isNew);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={matches}
        keyExtractor={(m) => m.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<NewMatchesRow matches={newMatches} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <ChatRow match={item} />}
      />
    </View>
  );
}

function NewMatchesRow({ matches: newMatches }: { matches: ChatMatch[] }) {
  if (newMatches.length === 0) return null;
  return (
    <View style={styles.newSection}>
      <Text style={styles.sectionLabel}>New matches</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newRow}>
        {newMatches.map((m) => (
          <Link key={m.id} href={`/chat/${m.id}`} asChild>
            <Pressable style={styles.newItem}>
              <View>
                <Image source={{ uri: m.avatar }} style={styles.newAvatar} />
                {m.online ? <View style={styles.onlineDotNew} /> : null}
              </View>
              <Text style={styles.newName} numberOfLines={1}>
                {m.name}
              </Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

function ChatRow({ match }: { match: ChatMatch }) {
  return (
    <Link href={`/chat/${match.id}`} asChild>
      <Pressable style={styles.row}>
        <View>
          <Image source={{ uri: match.avatar }} style={styles.avatar} />
          {match.online ? <View style={styles.onlineDot} /> : null}
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.name}>{match.name}</Text>
          <Text style={[styles.preview, match.unread > 0 && styles.previewUnread]} numberOfLines={1}>
            {match.lastMessage}
          </Text>
        </View>
        <View style={styles.rowMeta}>
          <Text style={styles.time}>{match.time}</Text>
          {match.unread > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{match.unread}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.text,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  newSection: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  newRow: {
    paddingHorizontal: 20,
    gap: 16,
  },
  newItem: {
    alignItems: 'center',
    width: 68,
    gap: 6,
  },
  newAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Palette.peachDeep,
    backgroundColor: Palette.peachSoft,
  },
  onlineDotNew: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Palette.online,
    borderWidth: 2,
    borderColor: Palette.background,
  },
  newName: {
    fontSize: 12,
    color: Palette.text,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.peachSoft,
  },
  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: Palette.online,
    borderWidth: 2.5,
    borderColor: Palette.background,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.text,
  },
  preview: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  previewUnread: {
    color: Palette.text,
    fontWeight: '600',
  },
  rowMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  time: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.peachDeep,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: Palette.border,
    marginLeft: 94,
  },
});
