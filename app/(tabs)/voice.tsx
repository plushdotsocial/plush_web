import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { randomStranger } from '@/data/mock';

const RANGES = [1, 5, 25, 100];

type Phase = 'idle' | 'searching' | 'connecting' | 'incall';

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VoiceScreen() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('idle');
  const [range, setRange] = useState(5);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [stranger, setStranger] = useState(() => randomStranger(5));

  const pulse = useSharedValue(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Pulse rings while searching.
  useEffect(() => {
    if (phase === 'searching') {
      pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [phase, pulse]);

  // Call timer.
  useEffect(() => {
    if (phase !== 'incall') return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Cleanup on unmount.
  useEffect(() => () => clearTimers(), []);

  const startCall = () => {
    clearTimers();
    setStranger(randomStranger(range));
    setSeconds(0);
    setMuted(false);
    setPhase('searching');
    timersRef.current.push(setTimeout(() => setPhase('connecting'), 2600));
    timersRef.current.push(setTimeout(() => setPhase('incall'), 4000));
  };

  const endCall = () => {
    clearTimers();
    setPhase('idle');
    setMuted(false);
  };

  const ring1 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 1.1 }],
    opacity: 0.5 * (1 - pulse.value),
  }));
  const ring2 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.6 }],
    opacity: 0.35 * (1 - pulse.value),
  }));

  const isActive = phase !== 'idle';

  return (
    <LinearGradient
      colors={[Palette.background, Palette.peachSoft] as const}
      style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Anonymous voice</Text>
        <Text style={styles.subtitle}>Talk to someone new nearby — no names, no photos.</Text>
      </View>

      <View style={styles.stage}>
        <View style={styles.orbWrap}>
          {phase === 'searching' ? (
            <>
              <Animated.View style={[styles.ring, ring1]} />
              <Animated.View style={[styles.ring, ring2]} />
            </>
          ) : null}
          <LinearGradient colors={[Palette.peach, Palette.peachDeep] as const} style={styles.orb}>
            <Ionicons
              name={phase === 'incall' ? 'person' : phase === 'searching' ? 'radio' : 'mic'}
              size={56}
              color={Palette.white}
            />
          </LinearGradient>
        </View>

        {phase === 'idle' ? (
          <Text style={styles.statusBig}>Ready when you are</Text>
        ) : phase === 'searching' ? (
          <Text style={styles.statusBig}>Finding someone within {range} km…</Text>
        ) : phase === 'connecting' ? (
          <Text style={styles.statusBig}>Connecting…</Text>
        ) : (
          <>
            <Text style={styles.statusBig}>{stranger.nickname}</Text>
            <Text style={styles.statusSmall}>
              Anonymous · {stranger.distanceKm} km away
            </Text>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
          </>
        )}
      </View>

      {phase === 'idle' ? (
        <View style={styles.controls}>
          <Text style={styles.rangeLabel}>Search range</Text>
          <View style={styles.chips}>
            {RANGES.map((r) => {
              const selected = r === range;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRange(r)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{r} km</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable style={styles.startBtn} onPress={startCall}>
            <Ionicons name="call" size={22} color={Palette.white} />
            <Text style={styles.startText}>Start a call</Text>
          </Pressable>
        </View>
      ) : null}

      {phase === 'incall' ? (
        <View style={styles.callControls}>
          <Pressable
            style={[styles.callBtn, muted && styles.callBtnActive]}
            onPress={() => setMuted((m) => !m)}>
            <Ionicons name={muted ? 'mic-off' : 'mic'} size={26} color={muted ? Palette.white : Palette.text} />
          </Pressable>
          <Pressable style={[styles.callBtn, styles.endBtn]} onPress={endCall}>
            <Ionicons name="call" size={28} color={Palette.white} style={styles.endIcon} />
          </Pressable>
          <Pressable style={styles.callBtn} onPress={startCall}>
            <Ionicons name="play-skip-forward" size={24} color={Palette.text} />
          </Pressable>
        </View>
      ) : null}

      {isActive && phase !== 'incall' ? (
        <Pressable style={styles.cancelBtn} onPress={endCall}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.text,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.textMuted,
    textAlign: 'center',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  orbWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Palette.peach,
  },
  orb: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.peachDeep,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  statusBig: {
    fontSize: 22,
    fontWeight: '700',
    color: Palette.text,
    textAlign: 'center',
  },
  statusSmall: {
    fontSize: 14,
    color: Palette.textMuted,
    marginTop: 2,
  },
  timer: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.peachDeep,
    marginTop: 10,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    gap: 14,
  },
  rangeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  chipSelected: {
    backgroundColor: Palette.peachDeep,
    borderColor: Palette.peachDeep,
  },
  chipText: {
    color: Palette.text,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Palette.white,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Palette.peachDeep,
    borderRadius: 999,
    paddingVertical: 18,
    marginTop: 6,
    shadowColor: Palette.peachDeep,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  startText: {
    color: Palette.white,
    fontSize: 17,
    fontWeight: '800',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingVertical: 8,
  },
  callBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  callBtnActive: {
    backgroundColor: Palette.textMuted,
    borderColor: Palette.textMuted,
  },
  endBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.coral,
    borderColor: Palette.coral,
  },
  endIcon: {
    transform: [{ rotate: '135deg' }],
  },
  cancelBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: Palette.textMuted,
    fontWeight: '700',
    fontSize: 15,
  },
});
