const coins = require("../coins");
const axios = require("axios");

module.exports = async () => {
  try {
    const data = new Object();
    const {data: response} = await axios.get('https://api.binance.com/api/v1/ticker/allPrices');
    coins.forEach((coin) => {
      response.forEach((item) => {
        if (item.symbol == coin.toUpperCase()) {
          data[coin] = decimalCut(item.price);
        }
      });
    });
    return {
      success: true,
      data
    };
  } catch (error) {
    throw new Error('Error getting price data..')
  }
};


function decimalCut(num) {
  num = Number(num);
  if (num > 1) {
    return Number(num.toFixed(3));
  } else if (num < 1) {
    return Number(num.toPrecision(4));
  }
  return Number(num.toFixed(2));
}