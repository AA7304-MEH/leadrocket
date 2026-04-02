/**
 * Formats a numeric amount based on the payment gateway and currency.
 * @param amount The numeric value to format.
 * @param gateway The payment gateway being used ('razorpay' or 'paypal').
 * @returns A formatted string with the appropriate currency symbol.
 */
export const formatCurrency = (amount: number, gateway: 'razorpay' | 'paypal' = 'razorpay') => {
    if (gateway === 'razorpay') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats INR specifically for Indian context.
 */
export const formatINR = (amount: number) => formatCurrency(amount, 'razorpay');

/**
 * Formats USD specifically for international context.
 */
export const formatUSD = (amount: number) => formatCurrency(amount, 'paypal');

/**
 * Plan prices for LeadRockets 4.0
 */
export const PLAN_PRICES = {
    Starter: { inr: 8299, usd: 99 },
    Pro: { inr: 16599, usd: 199 },
    Agency: { inr: 41499, usd: 499 },
};
