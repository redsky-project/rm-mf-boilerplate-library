/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - date to format
 */
export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return 'just now';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
	if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

	return date.toLocaleDateString();
}

/**
 * Format date to string
 * @param date - date to format
 * @param options - Intl.DateTimeFormat options
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
	return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Check if date is today
 * @param date - date to check
 */
export function isToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}
