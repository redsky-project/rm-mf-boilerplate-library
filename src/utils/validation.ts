/**
 * Validate email address
 * @param email - email to validate
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate URL
 * @param url - URL to validate
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

/**
 * Validate phone number (simple validation)
 * @param phone - phone number to validate
 */
export function isValidPhone(phone: string): boolean {
	const phoneRegex = /^\+?[\d\s\-()]+$/;
	return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
