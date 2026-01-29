/**
 * Format number to Indonesian currency format without Rp symbol
 * Example: 1000000 -> "1.000.000"
 */
export const formatCurrency = (value) => {
    if (!value && value !== 0) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(value));
};

/**
 * Format number to Indonesian currency format with Rp symbol
 * Example: 1000000 -> "Rp 1.000.000"
 */
export const formatCurrencyWithSymbol = (value) => {
    if (!value && value !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

/**
 * Parse Indonesian formatted number string to number
 * Example: "1.000.000" -> 1000000
 */
export const parseCurrency = (value) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return parseInt(value.toString().replace(/\./g, ''), 10) || 0;
};
