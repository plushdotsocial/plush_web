/**
 * Peach-themed palette for the plush dating-app prototype.
 * `Palette` holds the brand colors used directly across screens;
 * `Colors` keeps the light/dark shape the starter components expect.
 */

import { Platform } from 'react-native';

export const Palette = {
  peach: '#FFB59E',
  peachLight: '#FFD9CC',
  peachSoft: '#FFE9E1',
  peachDeep: '#FF7A59',
  coral: '#F25C54',
  background: '#FFF6F1',
  card: '#FFFFFF',
  text: '#3A2A24',
  textMuted: '#9B847A',
  border: '#F3DDD2',
  like: '#FF6F61',
  nope: '#8A94A6',
  online: '#52C77E',
  white: '#FFFFFF',
};

const tintColorLight = Palette.peachDeep;
const tintColorDark = Palette.peach;

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.background,
    tint: tintColorLight,
    icon: Palette.textMuted,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F5E7E0',
    background: '#241A16',
    tint: tintColorDark,
    icon: '#C9AFA4',
    tabIconDefault: '#C9AFA4',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
