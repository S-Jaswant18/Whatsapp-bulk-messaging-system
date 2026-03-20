export const normalizePhone = (phone) => {
    if (!phone) return '';
    // Keep only digits
    return phone.toString().replace(/\D/g, '');
};

export const toWhatsAppRecipient = (phone) => {
    const normalized = normalizePhone(phone);
    if (!normalized) return '';

    const defaultCountryCode = (process.env.DEFAULT_COUNTRY_CODE || '91').replace(/\D/g, '');

    if (normalized.length === 10 && defaultCountryCode) {
        return `${defaultCountryCode}${normalized}`;
    }

    return normalized;
};
