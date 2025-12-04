import currency from 'currency.js';

const currencyFlag = [
  { currency_code: 'USD', flag: '🇺🇸' },
  { currency_code: 'BTN', flag: '🇧🇹' },
  { currency_code: 'INR', flag: '🇮🇳' },
];

// export const currencyOptions = (currencyList) => {
//   return currencyList.map((x) => {
//     return {
//       value: x.currency_code,
//       label:
//         (currencyFlag.find((currency) => currency.currency_code === x.currency_code)?.flag ||
//           '💵') +
//         ' ' +
//         x.currency_symbol +
//         ' (' +
//         x.currency_name +
//         ')',
//     };
//   });
// };

export const currencyOptions = () => {
  return currencyFlag.map((x) => {
    return {
      value: x.currency_code,
      label: x.flag + ' ' + x.currency_code,
    };
  });
};
