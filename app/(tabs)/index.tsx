import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileCard, ProfileCardPreview } from '@/components/profile-card';
import { Palette } from '@/constants/theme';
import { ME, profiles as PROFILES, type Attachment, type Profile } from '@/data/mock';
import { useMatches } from '@/store/matches';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const OFF_SCREEN = SCREEN_WIDTH * 1.5;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { startChatFromComment, ensureChat } = useMatches();
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState<Profile | null>(null);
  const [composer, setComposer] = useState<{ profile: Profile; target: Attachment } | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwiped = useCallback(
    (dir: 'left' | 'right') => {
      const profile = PROFILES[index];
      translateX.value = 0;
      translateY.value = 0;
      setIndex((i) => i + 1);
      if (dir === 'right' && profile?.guaranteedMatch) {
        setMatched(profile);
      }
    },
    [index, translateX, translateY]
  );

  const forceSwipe = useCallback(
    (dir: 'left' | 'right') => {
      translateX.value = withTiming(dir === 'right' ? OFF_SCREEN : -OFF_SCREEN, { duration: 220 }, (finished) => {
        if (finished) runOnJS(handleSwiped)(dir);
      });
    },
    [handleSwiped, translateX]
  );

  const pan = Gesture.Pan()
    // Only claim clearly-horizontal drags so the card's vertical scroll still works.
    .activeOffsetX([-18, 18])
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(OFF_SCREEN, { duration: 220 }, (f) => {
          if (f) runOnJS(handleSwiped)('right');
        });
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-OFF_SCREEN, { duration: 220 }, (f) => {
          if (f) runOnJS(handleSwiped)('left');
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const topCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          [-10, 0, 10],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [10, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, -10], [1, 0], Extrapolation.CLAMP),
  }));

  const nextCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    return {
      transform: [{ scale: 0.94 + progress * 0.06 }],
      opacity: 0.85 + progress * 0.15,
    };
  });

  const current = PROFILES[index];
  const next = PROFILES[index + 1];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>plush</Text>
        <Ionicons name="options-outline" size={24} color={Palette.text} />
      </View>

      <View style={styles.deck}>
        {!current ? (
          <View style={styles.empty}>
            <Ionicons name="sparkles-outline" size={52} color={Palette.peachDeep} />
            <Text style={styles.emptyTitle}>You&apos;re all caught up</Text>
            <Text style={styles.emptySub}>Check back later for new people nearby.</Text>
            <Pressable style={styles.resetBtn} onPress={() => setIndex(0)}>
              <Text style={styles.resetText}>Start over</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {next ? (
              <Animated.View style={[styles.cardWrapper, nextCardStyle]} pointerEvents="none">
                <ProfileCardPreview profile={next} />
              </Animated.View>
            ) : null}
            <GestureDetector gesture={pan}>
              <Animated.View key={current.id} style={[styles.cardWrapper, topCardStyle]}>
                <ProfileCard
                  profile={current}
                  onPass={() => forceSwipe('left')}
                  onLike={() => forceSwipe('right')}
                  onComment={(target) => setComposer({ profile: current, target })}
                />
                <Animated.View style={[styles.stamp, styles.likeStamp, likeStyle]}>
                  <Text style={[styles.stampText, { color: Palette.like }]}>LIKE</Text>
                </Animated.View>
                <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStyle]}>
                  <Text style={[styles.stampText, { color: Palette.nope }]}>NOPE</Text>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          </>
        )}
      </View>

      {matched ? (
        <MatchOverlay
          profile={matched}
          onClose={() => setMatched(null)}
          onMessage={() => {
            const id = ensureChat(matched);
            setMatched(null);
            router.push(`/chat/${id}`);
          }}
        />
      ) : null}

      {composer ? (
        <CommentComposer
          profile={composer.profile}
          target={composer.target}
          onClose={() => setComposer(null)}
          onSend={(text) => {
            const id = startChatFromComment(composer.profile, text, composer.target);
            setComposer(null);
            router.push(`/chat/${id}`);
          }}
        />
      ) : null}
    </View>
  );
}

function CommentComposer({
  profile,
  target,
  onClose,
  onSend,
}: {
  profile: Profile;
  target: Attachment;
  onClose: () => void;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.composerBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.composerSheet}>
          <View style={styles.composerHandle} />
          <Text style={styles.composerTitle}>
            Comment on {profile.name}&apos;s {target.type}
          </Text>

          {target.type === 'photo' ? (
            <Image source={{ uri: target.image }} style={styles.composerPhoto} contentFit="cover" />
          ) : (
            <View style={styles.composerQuote}>
              <Text style={styles.composerQuoteQ}>{target.question}</Text>
              <Text style={styles.composerQuoteA}>{target.answer}</Text>
            </View>
          )}

          <View style={styles.composerInputRow}>
            <TextInput
              style={styles.composerInput}
              placeholder={`Say something to ${profile.name}…`}
              placeholderTextColor={Palette.textMuted}
              value={text}
              onChangeText={setText}
              autoFocus
              multiline
            />
            <Pressable
              style={[styles.composerSend, !canSend && styles.composerSendDisabled]}
              onPress={() => onSend(text)}
              disabled={!canSend}>
              <Ionicons name="send" size={20} color={Palette.white} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function MatchOverlay({
  profile,
  onClose,
  onMessage,
}: {
  profile: Profile;
  onClose: () => void;
  onMessage: () => void;
}) {
  return (
    <LinearGradient colors={[Palette.peachDeep, Palette.coral] as const} style={styles.overlay}>
      <Text style={styles.matchTitle}>It&apos;s a match!</Text>
      <Text style={styles.matchSub}>You and {profile.name} liked each other</Text>
      <View style={styles.matchAvatars}>
        <Image source={{ uri: ME.avatar }} style={styles.matchAvatar} />
        <Image source={{ uri: profile.photos[0] }} style={[styles.matchAvatar, styles.matchAvatarOverlap]} />
      </View>
      <Pressable style={styles.matchPrimary} onPress={onMessage}>
        <Text style={styles.matchPrimaryText}>Send a message</Text>
      </Pressable>
      <Pressable onPress={onClose} hitSlop={12}>
        <Text style={styles.matchSecondary}>Keep swiping</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  logo: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.peachDeep,
    letterSpacing: 0.5,
  },
  deck: {
    flex: 1,
    marginVertical: 8,
  },
  cardWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  stamp: {
    position: 'absolute',
    top: 36,
    borderWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  likeStamp: {
    left: 24,
    borderColor: Palette.like,
    transform: [{ rotate: '-16deg' }],
  },
  nopeStamp: {
    right: 24,
    borderColor: Palette.nope,
    transform: [{ rotate: '16deg' }],
  },
  stampText: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.text,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 15,
    color: Palette.textMuted,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 12,
    backgroundColor: Palette.peachDeep,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  resetText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 32,
    zIndex: 20,
  },
  matchTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Palette.white,
  },
  matchSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 12,
  },
  matchAvatars: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  matchAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: Palette.white,
    backgroundColor: Palette.peachSoft,
  },
  matchAvatarOverlap: {
    marginLeft: -24,
  },
  matchPrimary: {
    backgroundColor: Palette.white,
    borderRadius: 999,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 8,
  },
  matchPrimaryText: {
    color: Palette.peachDeep,
    fontWeight: '800',
    fontSize: 16,
  },
  matchSecondary: {
    color: Palette.white,
    fontWeight: '600',
    fontSize: 15,
    marginTop: 4,
  },
  composerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  composerSheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    gap: 14,
  },
  composerHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.border,
    marginBottom: 4,
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text,
  },
  composerPhoto: {
    alignSelf: 'center',
    width: 200,
    height: 260,
    borderRadius: 18,
    backgroundColor: Palette.peachSoft,
  },
  composerQuote: {
    backgroundColor: Palette.peachSoft,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  composerQuoteQ: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.peachDeep,
  },
  composerQuoteA: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.text,
  },
  composerInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  composerInput: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    backgroundColor: Palette.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: Palette.text,
  },
  composerSend: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.peachDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerSendDisabled: {
    backgroundColor: Palette.peachLight,
  },
});
