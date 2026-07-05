import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  conversations as seedConversations,
  matches as seedMatches,
  ME,
  profiles,
  randomReply,
  type Attachment,
  type ChatMatch,
  type Message,
  type Profile,
} from '@/data/mock';

export type CommentTarget = Attachment;

type Partner = { name: string; avatar: string; online: boolean };

type MatchesContextValue = {
  matches: ChatMatch[];
  conversations: Record<string, Message[]>;
  getPartner: (id?: string) => Partner;
  /** Append a typed message to an existing conversation. */
  sendMessage: (id: string, text: string) => void;
  /** Start (or reuse) a chat by commenting on a photo/prompt. Returns the chat id. */
  startChatFromComment: (profile: Profile, text: string, target: CommentTarget) => string;
  /** Ensure a chat exists for a profile (used by the match overlay). Returns the chat id. */
  ensureChat: (profile: Profile) => string;
};

const MatchesContext = createContext<MatchesContextValue | null>(null);

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Move a match to the top of the list with a refreshed preview/time. */
function bumpToTop(list: ChatMatch[], id: string, lastMessage: string): ChatMatch[] {
  const found = list.find((m) => m.id === id);
  if (!found) return list;
  return [{ ...found, lastMessage, time: 'now', isNew: false }, ...list.filter((m) => m.id !== id)];
}

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<ChatMatch[]>(seedMatches);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(seedConversations);
  const replyTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const scheduleReply = useCallback((id: string) => {
    const timer = setTimeout(() => {
      const reply: Message = { id: `r-${Date.now()}`, text: randomReply(), fromMe: false, time: nowLabel() };
      setConversations((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), reply] }));
      setMatches((prev) => bumpToTop(prev, id, reply.text));
    }, 1400);
    replyTimers.current.push(timer);
  }, []);

  const getPartner = useCallback(
    (id?: string): Partner => {
      const m = matches.find((x) => x.id === id);
      if (m) return { name: m.name, avatar: m.avatar, online: m.online };
      const p = profiles.find((x) => x.id === id);
      if (p) return { name: p.name, avatar: p.photos[0], online: true };
      return { name: 'Someone', avatar: ME.avatar, online: false };
    },
    [matches]
  );

  const sendMessage = useCallback(
    (id: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const mine: Message = { id: `me-${Date.now()}`, text: trimmed, fromMe: true, time: nowLabel() };
      setConversations((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), mine] }));
      setMatches((prev) => bumpToTop(prev, id, trimmed));
      scheduleReply(id);
    },
    [scheduleReply]
  );

  const startChatFromComment = useCallback(
    (profile: Profile, text: string, target: CommentTarget) => {
      const trimmed = text.trim();
      const preview = trimmed || 'Sent a comment';
      const existing = matches.find((m) => m.name === profile.name);
      const chatId = existing ? existing.id : `from-${profile.id}`;
      const message: Message = {
        id: `me-${Date.now()}`,
        text: trimmed,
        fromMe: true,
        time: nowLabel(),
        attachment: target,
      };

      setMatches((prev) => {
        const found = prev.find((m) => m.name === profile.name);
        if (found) {
          return [
            { ...found, lastMessage: preview, time: 'now', isNew: false },
            ...prev.filter((m) => m.id !== found.id),
          ];
        }
        const newMatch: ChatMatch = {
          id: chatId,
          name: profile.name,
          age: profile.age,
          avatar: profile.photos[0],
          lastMessage: preview,
          time: 'now',
          unread: 0,
          online: true,
          isNew: true,
        };
        return [newMatch, ...prev];
      });
      setConversations((prev) => ({ ...prev, [chatId]: [...(prev[chatId] ?? []), message] }));
      scheduleReply(chatId);
      return chatId;
    },
    [matches, scheduleReply]
  );

  const ensureChat = useCallback(
    (profile: Profile) => {
      const existing = matches.find((m) => m.name === profile.name);
      if (existing) return existing.id;
      const chatId = `from-${profile.id}`;
      setMatches((prev) =>
        prev.some((m) => m.id === chatId)
          ? prev
          : [
              {
                id: chatId,
                name: profile.name,
                age: profile.age,
                avatar: profile.photos[0],
                lastMessage: 'You matched! Say hi 👋',
                time: 'now',
                unread: 0,
                online: true,
                isNew: true,
              },
              ...prev,
            ]
      );
      setConversations((prev) => (prev[chatId] ? prev : { ...prev, [chatId]: [] }));
      return chatId;
    },
    [matches]
  );

  const value = useMemo(
    () => ({ matches, conversations, getPartner, sendMessage, startChatFromComment, ensureChat }),
    [matches, conversations, getPartner, sendMessage, startChatFromComment, ensureChat]
  );

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
}

export function useMatches() {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error('useMatches must be used within a MatchesProvider');
  return ctx;
}
