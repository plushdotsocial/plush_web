import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { type Message } from '@/data/mock';
import { useMatches } from '@/store/matches';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, getPartner, sendMessage } = useMatches();
  const partner = getPartner(id);

  const messages = conversations[id] ?? [];
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const send = () => {
    if (!text.trim()) return;
    sendMessage(id, text);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Palette.text} />
        </Pressable>
        <Image source={{ uri: partner.avatar }} style={styles.headerAvatar} />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{partner.name}</Text>
          <Text style={styles.headerStatus}>{partner.online ? 'Online now' : 'Offline'}</Text>
        </View>
        <Ionicons name="call-outline" size={24} color={Palette.peachDeep} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>You matched with {partner.name}. Say hi! 👋</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, item.fromMe ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
            <View style={[styles.bubble, item.fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
              {item.attachment ? (
                item.attachment.type === 'photo' ? (
                  <Image source={{ uri: item.attachment.image }} style={styles.attachPhoto} contentFit="cover" />
                ) : (
                  <View style={styles.attachPrompt}>
                    <Text style={styles.attachPromptQ}>{item.attachment.question}</Text>
                    <Text style={styles.attachPromptA}>{item.attachment.answer}</Text>
                  </View>
                )
              ) : null}
              {item.text ? (
                <Text style={[styles.bubbleText, item.fromMe && styles.bubbleTextMine]}>{item.text}</Text>
              ) : null}
              <Text style={[styles.bubbleTime, item.fromMe && styles.bubbleTimeMine]}>{item.time}</Text>
            </View>
          </View>
        )}
      />

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder={`Message ${partner.name}…`}
          placeholderTextColor={Palette.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Pressable
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!text.trim()}>
          <Ionicons name="send" size={20} color={Palette.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: Palette.card,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  backBtn: {
    padding: 2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.peachSoft,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.text,
  },
  headerStatus: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  messages: {
    padding: 16,
    gap: 10,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowTheirs: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bubbleMine: {
    backgroundColor: Palette.peachDeep,
    borderBottomRightRadius: 6,
  },
  bubbleTheirs: {
    backgroundColor: Palette.card,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  attachPhoto: {
    width: 150,
    height: 190,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  attachPrompt: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    gap: 3,
  },
  attachPromptQ: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
  },
  attachPromptA: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.white,
  },
  bubbleText: {
    fontSize: 15,
    color: Palette.text,
    lineHeight: 20,
  },
  bubbleTextMine: {
    color: Palette.white,
  },
  bubbleTime: {
    fontSize: 10,
    color: Palette.textMuted,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  bubbleTimeMine: {
    color: 'rgba(255,255,255,0.8)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: Palette.card,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    backgroundColor: Palette.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 15,
    color: Palette.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.peachDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Palette.peachLight,
  },
});
