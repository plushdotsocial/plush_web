import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Palette } from '@/constants/theme';
import type { Attachment, Profile, Prompt } from '@/data/mock';

function heightLabel(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}'${inch}" · ${cm} cm`;
}

type IoniconName = keyof typeof Ionicons.glyphMap;

function vitalsFor(profile: Profile): { icon: IoniconName; label: string }[] {
  return [
    { icon: 'heart-circle-outline', label: profile.lookingFor },
    { icon: 'resize-outline', label: heightLabel(profile.heightCm) },
    { icon: 'school-outline', label: profile.education },
    { icon: 'sunny-outline', label: profile.zodiac },
    { icon: 'flag-outline', label: profile.politics },
    { icon: 'wine-outline', label: profile.drink },
    { icon: 'cloud-outline', label: profile.smoke },
  ];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CommentButton({ onPress, floating }: { onPress: () => void; floating?: boolean }) {
  return (
    <Pressable style={[styles.commentBtn, floating && styles.commentBtnFloating]} onPress={onPress} hitSlop={8}>
      <Ionicons name="chatbubble-ellipses" size={18} color={Palette.peachDeep} />
    </Pressable>
  );
}

function PromptCard({ prompt, onComment }: { prompt: Prompt; onComment?: () => void }) {
  return (
    <View style={styles.promptCard}>
      <Text style={styles.promptQuestion}>{prompt.question}</Text>
      <Text style={styles.promptAnswer}>{prompt.answer}</Text>
      {onComment ? (
        <View style={styles.promptCommentRow}>
          <CommentButton onPress={onComment} />
        </View>
      ) : null}
    </View>
  );
}

function Photo({ uri, onComment }: { uri: string; onComment?: () => void }) {
  return (
    <View style={styles.photoWrap}>
      <Image source={{ uri }} style={styles.photo} contentFit="cover" transition={200} />
      {onComment ? <CommentButton onPress={onComment} floating /> : null}
    </View>
  );
}

/** Full, scrollable profile shown as the top card in the Discover deck. */
export function ProfileCard({
  profile,
  onPass,
  onLike,
  onComment,
}: {
  profile: Profile;
  onPass?: () => void;
  onLike?: () => void;
  onComment?: (target: Attachment) => void;
}) {
  const [hero, ...rest] = profile.photos;
  const vitals = vitalsFor(profile);
  const prompts = profile.prompts;
  // Returns a tap handler (using optional chaining so it's type-safe in nested closures).
  const commentOn = (target: Attachment) => () => onComment?.(target);

  return (
    <View style={styles.card}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: hero }} style={styles.heroImg} contentFit="cover" transition={200} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)'] as const}
            style={styles.heroGradient}
          />
          <View style={styles.heroInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.age}>{profile.age}</Text>
            </View>
            <View style={styles.distanceRow}>
              <Ionicons name="location" size={14} color={Palette.white} />
              <Text style={styles.distance}>{profile.distanceKm} km away</Text>
            </View>
          </View>
        </View>

        <Section title="About me">
          <Text style={styles.bio}>{profile.bio}</Text>
        </Section>

        <View style={styles.vitals}>
          {vitals.map((v) => (
            <View key={v.label} style={styles.vital}>
              <Ionicons name={v.icon} size={16} color={Palette.peachDeep} />
              <Text style={styles.vitalText}>{v.label}</Text>
            </View>
          ))}
        </View>

        {prompts[0] ? (
          <PromptCard
            prompt={prompts[0]}
            onComment={onComment ? commentOn({ type: 'prompt', ...prompts[0] }) : undefined}
          />
        ) : null}

        {rest[0] ? (
          <Photo uri={rest[0]} onComment={onComment ? commentOn({ type: 'photo', image: rest[0] }) : undefined} />
        ) : null}

        <Section title="Interests">
          <View style={styles.tags}>
            {profile.interests.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Section>

        {prompts[1] ? (
          <PromptCard
            prompt={prompts[1]}
            onComment={onComment ? commentOn({ type: 'prompt', ...prompts[1] }) : undefined}
          />
        ) : null}

        {rest[1] ? (
          <Photo uri={rest[1]} onComment={onComment ? commentOn({ type: 'photo', image: rest[1] }) : undefined} />
        ) : null}

        {prompts[2] ? (
          <PromptCard
            prompt={prompts[2]}
            onComment={onComment ? commentOn({ type: 'prompt', ...prompts[2] }) : undefined}
          />
        ) : null}

        {rest.slice(2).map((uri) => (
          <Photo key={uri} uri={uri} onComment={onComment ? commentOn({ type: 'photo', image: uri }) : undefined} />
        ))}

        {onPass || onLike ? (
          <View style={styles.endActions}>
            <Text style={styles.endLabel}>Like {profile.name}?</Text>
            <View style={styles.actionRow}>
              <Pressable style={[styles.actionBtn, styles.nopeAction]} onPress={onPass}>
                <Ionicons name="close" size={34} color={Palette.nope} />
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.likeAction]} onPress={onLike}>
                <Ionicons name="heart" size={32} color={Palette.white} />
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

/** Lightweight card shown peeking behind the top card (no scroll). */
export function ProfileCardPreview({ profile }: { profile: Profile }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: profile.photos[0] }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)'] as const}
        style={styles.previewGradient}
      />
      <View style={styles.previewInfo}>
        <Text style={styles.name}>
          {profile.name} <Text style={styles.age}>{profile.age}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: Palette.card,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  heroWrap: {
    height: 470,
    justifyContent: 'flex-end',
  },
  heroImg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Palette.peachSoft,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  heroInfo: {
    padding: 20,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  name: {
    color: Palette.white,
    fontSize: 30,
    fontWeight: '800',
  },
  age: {
    color: Palette.white,
    fontSize: 24,
    fontWeight: '400',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bio: {
    fontSize: 16,
    lineHeight: 23,
    color: Palette.text,
  },
  vitals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  vital: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.peachSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  vitalText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text,
  },
  promptCard: {
    marginHorizontal: 18,
    marginTop: 18,
    backgroundColor: Palette.peachSoft,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  promptQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.peachDeep,
  },
  promptAnswer: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: '600',
    color: Palette.text,
  },
  photoWrap: {
    marginHorizontal: 18,
    marginTop: 18,
  },
  photo: {
    height: 440,
    borderRadius: 20,
    backgroundColor: Palette.peachSoft,
  },
  commentBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  commentBtnFloating: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
  promptCommentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Palette.peachSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tagText: {
    color: Palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  endActions: {
    alignItems: 'center',
    gap: 14,
    paddingTop: 28,
    paddingBottom: 8,
  },
  endLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.card,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  nopeAction: {
    borderWidth: 1,
    borderColor: Palette.border,
  },
  likeAction: {
    backgroundColor: Palette.peachDeep,
  },
  bottomSpacer: {
    height: 12,
  },
  previewGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  previewInfo: {
    position: 'absolute',
    left: 20,
    bottom: 22,
  },
});
