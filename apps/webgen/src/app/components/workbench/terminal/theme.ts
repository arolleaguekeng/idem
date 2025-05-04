import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--lexi-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--lexi-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--lexi-elements-terminal-textColor'),
    background: cssVar('--lexi-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--lexi-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--lexi-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--lexi-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--lexi-elements-terminal-color-black'),
    red: cssVar('--lexi-elements-terminal-color-red'),
    green: cssVar('--lexi-elements-terminal-color-green'),
    yellow: cssVar('--lexi-elements-terminal-color-yellow'),
    blue: cssVar('--lexi-elements-terminal-color-blue'),
    magenta: cssVar('--lexi-elements-terminal-color-magenta'),
    cyan: cssVar('--lexi-elements-terminal-color-cyan'),
    white: cssVar('--lexi-elements-terminal-color-white'),
    brightBlack: cssVar('--lexi-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--lexi-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--lexi-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--lexi-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--lexi-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--lexi-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--lexi-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--lexi-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
