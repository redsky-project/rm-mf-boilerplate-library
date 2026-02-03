/**
 * Application configuration constants
 */
export const APP_NAME = 'RM MF Library';
export const APP_VERSION = '0.1.0';

/**
 * Default pagination settings
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Timeout values (in milliseconds)
 */
export const DEFAULT_API_TIMEOUT = 10000;
export const DEBOUNCE_DELAY = 300;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
	THEME: 'theme',
	AUTH_TOKEN: 'auth_token',
	USER_PREFERENCES: 'user_preferences',
} as const;
