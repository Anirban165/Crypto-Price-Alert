const axios = require("axios");
const qs = require('qs')

module.exports = async (alert, currentPrice) => {
  try {
    let voice_text = `Price of ${alert.coin.replace("USDT", "")} just ${alert.type == "above" ? "exceeded" : "fell below"} your alert price of ${alert.price} USDT. Current price is ${currentPrice} USDT. I repeat, Current price of ${alert.coin.replace("USDT", "")} is ${currentPrice} USDT.`
    const config = {
      method: 'post',
      url: 'https://obligr.io/api_v2/voice-call/campaign',
      headers: {
        'Authorization': 'Bearer ' + process.env.OBLIGR_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data : qs.stringify({'caller_id': process.env.CALLER_ID,'voice_source': 'voice_text','voice_text': voice_text,'voice_name': 'Aditi','mobile_no': alert.mobile})
    }

    const {data} = await axios(config);
    if(data.success === false) throw new Error() 
    console.log('Call Sent to ->', alert.mobile);
  } catch (error) {
    console.log("Error Sending Call.", error.message);
  }
}