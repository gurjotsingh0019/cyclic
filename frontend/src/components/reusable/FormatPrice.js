export const formatPrice = (price) => {
    if (price < 10000) {
      return `₹ ${price}`;
    } else if (price < 100000) {
      return `₹ ${(price / 1000).toFixed(2)}K`;
    } else if (price < 10000000) {
      return `₹ ${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹ ${(price / 10000000).toFixed(2)} Crore`;
    }
};