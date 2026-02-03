/**
 * Format a number as currency
 * @param amount - number to format
 * @param currency - currency code (default: 'USD')
 * @param locale - locale code (default: 'en-US')
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(amount);
}

/**
 * Format a number with commas
 * @param num - number to format
 */
export function formatNumber(num: number): string {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate text with ellipsis
 * @param text - text to truncate
 * @param maxLength - maximum length
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}
