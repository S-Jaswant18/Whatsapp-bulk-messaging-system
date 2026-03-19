export const normalizePhone = (phone) => {
    if (!phone) return '';
    // Keep only digits
    return phone.toString().replace(/\D/g, '');
};
