// All prices are in Kazakhstani tenge, shown as e.g. "2 847 ₸"
const tenge = new Intl.NumberFormat('ru-KZ', {
  style: 'currency',
  currency: 'KZT',
  maximumFractionDigits: 0
});

export const formatPrice = (value) => tenge.format(value);
