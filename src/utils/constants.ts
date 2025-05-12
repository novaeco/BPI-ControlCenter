export const COLORS = {
  primary: {
    DEFAULT: 'primary-500',
    light: 'primary-400',
    dark: 'primary-600',
    bg: 'primary-500/20',
  },
  background: {
    DEFAULT: 'background-dark',
    surface: 'surface-dark',
  },
  border: 'gray-700/50',
  text: {
    primary: 'white',
    secondary: 'gray-400',
    accent: 'primary-400',
  },
} as const;

export const STATUS_COLORS = {
  active: {
    bg: 'green-500/20',
    text: 'green-400',
  },
  warning: {
    bg: 'yellow-500/20',
    text: 'yellow-400',
  },
  error: {
    bg: 'red-500/20',
    text: 'red-400',
  },
  disabled: {
    bg: 'gray-700/50',
    text: 'gray-400',
  },
} as const;

export const BUTTON_STYLES = {
  base: 'btn',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  icon: 'icon-btn',
} as const;

export const INPUT_STYLES = {
  base: 'input',
  select: 'select',
} as const;

export const CARD_STYLES = {
  base: 'card',
  header: 'card-header',
  body: 'card-body',
  footer: 'card-footer',
} as const;