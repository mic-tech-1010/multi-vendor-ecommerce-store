function CurrencyFormatter(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
) {

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    const format = formatter.format(amount);

    const parts = formatter.formatToParts(amount);

    let currencySymbol = '';
    let numericalValue = '';

    for (const part of parts) {
        if (part.type === 'currency') {
            currencySymbol = part.value;
        } else {
            numericalValue += part.value;
        }
    }

    return { currencySymbol: currencySymbol, numericalValue: numericalValue, formatted: format };
}

export default CurrencyFormatter;
