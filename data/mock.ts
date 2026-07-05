/**
 * Mock data for the plush dating-app prototype.
 * Everything here is fake — no backend, no real audio.
 */

export type Prompt = { question: string; answer: string };

export type Profile = {
  id: string;
  name: string;
  age: number;
  distanceKm: number;
  /** Up to 6 photos. The first is the portrait/hero shot. */
  photos: string[];
  bio: string;
  interests: string[];
  lookingFor: string;
  heightCm: number;
  education: string;
  /** Sun sign ("sunshine"). */
  zodiac: string;
  /** Political leaning — left / right / centre. */
  politics: string;
  drink: string;
  smoke: string;
  prompts: Prompt[];
  /** When liked, instantly triggers the "It's a match!" overlay. */
  guaranteedMatch?: boolean;
};

export type ChatMatch = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isNew?: boolean;
};

/** A photo or prompt a message is replying to (Hinge-style comment). */
export type Attachment =
  | { type: 'photo'; image: string }
  | { type: 'prompt'; question: string; answer: string };

export type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
  attachment?: Attachment;
};

/** The signed-in user, used in the match overlay. */
export const ME = { name: 'You', avatar: 'https://i.pravatar.cc/200?img=12' };

const lifestyle = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export const profiles: Profile[] = [
  {
    id: 'p1',
    name: 'Aria',
    age: 24,
    distanceKm: 2,
    photos: [
      'https://i.pravatar.cc/600?img=5',
      lifestyle('aria-climb'),
      lifestyle('aria-coffee'),
      lifestyle('aria-trip'),
      lifestyle('aria-night'),
    ],
    bio: 'Coffee-fueled climber chasing sunsets and good playlists. Looking for a partner in crime who can keep up with bad puns.',
    interests: ['Coffee', 'Climbing', 'Indie music', 'Film photography', 'Hiking'],
    lookingFor: 'Long-term relationship',
    heightCm: 170,
    education: 'Stanford University',
    zodiac: 'Leo',
    politics: 'Liberal',
    drink: 'Socially',
    smoke: 'Non-smoker',
    prompts: [
      { question: 'My simple pleasures', answer: 'First sip of coffee at 6am before a climb, still half asleep.' },
      { question: 'The way to win me over is', answer: 'Send me a playlist that makes no sense but slaps.' },
      { question: "We'll get along if", answer: 'You think a 5am alarm for a sunrise hike is a great idea.' },
    ],
    guaranteedMatch: true,
  },
  {
    id: 'p2',
    name: 'Maya',
    age: 27,
    distanceKm: 4,
    photos: [
      'https://i.pravatar.cc/600?img=9',
      lifestyle('maya-plants'),
      lifestyle('maya-trail'),
      lifestyle('maya-vinyl'),
    ],
    bio: 'Plant mom 🌿 weekend hiker, vinyl hoarder. I will gently judge your playlist, then add to it.',
    interests: ['Hiking', 'Plants', 'Vinyl', 'Cooking', 'Camping'],
    lookingFor: 'Long-term, open to short',
    heightCm: 165,
    education: 'NYU',
    zodiac: 'Virgo',
    politics: 'Left-leaning',
    drink: 'On weekends',
    smoke: 'Non-smoker',
    prompts: [
      { question: 'I geek out on', answer: 'Repotting plants and naming each one like they pay rent.' },
      { question: 'A shower thought I recently had', answer: 'Trail mix is just a socially acceptable way to eat candy.' },
      { question: 'My ideal Sunday', answer: 'Farmers market, a long hike, then records and a slow dinner.' },
    ],
  },
  {
    id: 'p3',
    name: 'Sofia',
    age: 23,
    distanceKm: 6,
    photos: [
      'https://i.pravatar.cc/600?img=16',
      lifestyle('sofia-design'),
      lifestyle('sofia-ramen'),
      lifestyle('sofia-travel'),
      lifestyle('sofia-city'),
      lifestyle('sofia-art'),
    ],
    bio: 'Designer by day, ramen hunter by night. Currently collecting passport stamps and tiny ceramic bowls.',
    interests: ['Design', 'Ramen', 'Travel', 'Ceramics', 'Museums'],
    lookingFor: 'Still figuring it out',
    heightCm: 168,
    education: 'RISD',
    zodiac: 'Gemini',
    politics: 'Liberal',
    drink: 'Rarely',
    smoke: 'Non-smoker',
    prompts: [
      { question: 'Dating me is like', answer: 'A surprise tasting menu — trust the process, it ends in ramen.' },
      { question: 'My most irrational fear', answer: 'Ordering the second-best thing on the menu.' },
      { question: 'Two truths and a lie', answer: 'I’ve been to 22 countries, I can read kanji, I hate dessert.' },
    ],
    guaranteedMatch: true,
  },
  {
    id: 'p4',
    name: 'Elena',
    age: 29,
    distanceKm: 8,
    photos: [
      'https://i.pravatar.cc/600?img=20',
      lifestyle('elena-yoga'),
      lifestyle('elena-dog'),
      lifestyle('elena-beach'),
    ],
    bio: 'Yoga, sunsets, and dogs > most people. Calm on the outside, competitive at board games.',
    interests: ['Yoga', 'Dogs', 'Sunsets', 'Board games', 'Wine'],
    lookingFor: 'Long-term relationship',
    heightCm: 172,
    education: 'UCLA',
    zodiac: 'Libra',
    politics: 'Moderate',
    drink: 'Wine only',
    smoke: 'Non-smoker',
    prompts: [
      { question: 'Green flags I look for', answer: 'You’re kind to dogs and waiters, and you text back.' },
      { question: 'My love language', answer: 'Bringing you coffee in bed and beating you at Catan.' },
      { question: 'Best travel story', answer: 'Got adopted by a stray dog in Lisbon for an entire weekend.' },
    ],
  },
  {
    id: 'p5',
    name: 'Zoe',
    age: 25,
    distanceKm: 11,
    photos: [
      'https://i.pravatar.cc/600?img=24',
      lifestyle('zoe-film'),
      lifestyle('zoe-camera'),
      lifestyle('zoe-wine'),
      lifestyle('zoe-street'),
    ],
    bio: 'Film nerd with strong opinions and a soft heart. Let’s argue about the best A24 movie over natural wine.',
    interests: ['Film', 'Photography', 'Wine', 'Vintage', 'Writing'],
    lookingFor: 'Something genuine',
    heightCm: 160,
    education: 'Tisch School of the Arts',
    zodiac: 'Scorpio',
    politics: 'Left-leaning',
    drink: 'Socially',
    smoke: 'Socially',
    prompts: [
      { question: 'Unpopular opinion', answer: 'The book is not always better than the movie. Fight me.' },
      { question: 'I’ll fall for you if', answer: 'You cry at the same scene in Past Lives that I do.' },
      { question: 'My weekend project', answer: 'Shooting a roll of film and pretending I’m a director.' },
    ],
  },
  {
    id: 'p6',
    name: 'Nina',
    age: 26,
    distanceKm: 14,
    photos: [
      'https://i.pravatar.cc/600?img=44',
      lifestyle('nina-run'),
      lifestyle('nina-bake'),
      lifestyle('nina-books'),
    ],
    bio: 'Runner, baker, perpetual optimist. I’ll bring snacks to the trailhead and cookies to the finish line.',
    interests: ['Running', 'Baking', 'Books', 'Brunch', 'Pottery'],
    lookingFor: 'Long-term relationship',
    heightCm: 175,
    education: 'UC Berkeley',
    zodiac: 'Aries',
    politics: 'Moderate',
    drink: 'Not for me',
    smoke: 'Non-smoker',
    prompts: [
      { question: 'My happy place', answer: 'Mile 8 of a long run with a cinnamon roll waiting at home.' },
      { question: 'You should leave a comment if', answer: 'You have a strong ranking of breakfast pastries.' },
      { question: 'I’m known for', answer: 'Baking way too many cookies and forcing everyone to take some.' },
    ],
  },
];

export const matches: ChatMatch[] = [
  {
    id: 'm1',
    name: 'Aria',
    age: 24,
    avatar: 'https://i.pravatar.cc/200?img=5',
    lastMessage: 'haha okay you win this round 😄',
    time: 'now',
    unread: 2,
    online: true,
    isNew: true,
  },
  {
    id: 'm2',
    name: 'Sofia',
    age: 23,
    avatar: 'https://i.pravatar.cc/200?img=16',
    lastMessage: 'ramen friday?? 🍜',
    time: '2m',
    unread: 1,
    online: true,
    isNew: true,
  },
  {
    id: 'm3',
    name: 'Maya',
    age: 27,
    avatar: 'https://i.pravatar.cc/200?img=9',
    lastMessage: 'sent you the trail photo',
    time: '1h',
    unread: 0,
    online: false,
  },
  {
    id: 'm4',
    name: 'Elena',
    age: 29,
    avatar: 'https://i.pravatar.cc/200?img=20',
    lastMessage: 'my dog says hi 🐕',
    time: '3h',
    unread: 0,
    online: true,
  },
  {
    id: 'm5',
    name: 'Zoe',
    age: 25,
    avatar: 'https://i.pravatar.cc/200?img=24',
    lastMessage: 'okay but Hereditary is overrated',
    time: '1d',
    unread: 0,
    online: false,
  },
  {
    id: 'm6',
    name: 'Nina',
    age: 26,
    avatar: 'https://i.pravatar.cc/200?img=44',
    lastMessage: 'baked too many cookies again',
    time: '2d',
    unread: 0,
    online: false,
  },
];

export const conversations: Record<string, Message[]> = {
  m1: [
    { id: '1', text: 'Hey! Saw you’re into climbing 🧗', fromMe: false, time: '9:01 AM' },
    { id: '2', text: 'Guilty 😄 indoor mostly though', fromMe: true, time: '9:03 AM' },
    { id: '3', text: 'We should go sometime. I’ll out-climb you', fromMe: false, time: '9:04 AM' },
    { id: '4', text: 'haha okay you win this round 😄', fromMe: false, time: '9:05 AM' },
  ],
  m2: [{ id: '1', text: 'ramen friday?? 🍜', fromMe: false, time: '12:20 PM' }],
  m3: [
    { id: '1', text: 'that trail was unreal', fromMe: true, time: 'Yesterday' },
    { id: '2', text: 'sent you the trail photo', fromMe: false, time: 'Yesterday' },
  ],
};

export function lookupChatPartner(id?: string) {
  const m = matches.find((x) => x.id === id);
  if (m) return { name: m.name, avatar: m.avatar, online: m.online };
  const p = profiles.find((x) => x.id === id);
  if (p) return { name: p.name, avatar: p.photos[0], online: true };
  return { name: 'Someone', avatar: ME.avatar, online: false };
}

const STRANGER_NAMES = [
  'Sunny Otter',
  'Velvet Fox',
  'Quiet Comet',
  'Peachy Lynx',
  'Midnight Wren',
  'Golden Koi',
  'Lucky Heron',
  'Soft Maple',
];

export function randomStranger(maxKm = 10) {
  const nickname = STRANGER_NAMES[Math.floor(Math.random() * STRANGER_NAMES.length)];
  const distanceKm = Math.max(0.3, +(Math.random() * maxKm).toFixed(1));
  return { nickname, distanceKm };
}

const REPLIES = [
  'haha for sure 😄',
  'omg same',
  'tell me more 👀',
  'okay you’re actually funny',
  'wait really?',
  'love that',
  'what are you up to later?',
];

export function randomReply() {
  return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}
