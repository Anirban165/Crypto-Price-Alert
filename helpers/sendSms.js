const axios = require('axios')
const qs = require('qs')

module.exports = async (alert, currentPrice) => {
  try {
    let  message = `Price of ${alert.coin.replace("USDT", "")} just ${alert.type == "above" ? "exceeded" : "fell below"} your alert price of ${alert.price}USDT,\nCurrent price is ${currentPrice}USDT.\n~`;
    const config = {
      method: 'post',
      url: 'https://obligr.io/api_v2/message/send',
      headers: {
        'Authorization': 'Bearer ' + process.env.OBLIGR_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : qs.stringify({'dlt_template_id': process.env.DLT_TEMPLATE_ID, 'sender_id': process.env.SENDER_ID, 'mobile_no': alert.mobile ,'message': message})
    }
    const {data} = await axios(config);
    if(data.success === false) throw new Error() 
    console.log('Sms Sent to ->', alert.mobile);
  } catch (error) {
    console.log("Error Sending Sms.", error.message);
  }
}
