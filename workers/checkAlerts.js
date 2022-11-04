const CronJob = require("cron").CronJob;
const currentPrice = require("../helpers/currentPriceBinance");
const alertsCollection = require('../database/models')
const sendCall = require('../helpers/sendCall')
const sendSms = require('../helpers/sendSms')
const sendWhatsApp = require('../helpers/sendWhatsApp')

async function sendAlert(alert, currentPrice){
  alert.call === true ? await sendCall(alert, currentPrice) : null                                                       // send call
  alert.sms === true ? await sendSms(alert, currentPrice) : null                                                         // send sms
  alert.whatsapp === true ? await sendWhatsApp(alert, currentPrice) : null                                               // send whatsapp
  await alertsCollection.findByIdAndDelete(alert._id)
  console.log("alert deleted.") 
}

const checkAlert = new CronJob("* * * * *",                                                                               // Execute every 60 seconds */60 * * * * *
  async () => {
    try {
      const alerts = await alertsCollection.find().lean()
      const {data: currentPrices} = await currentPrice();
      for(let alert of alerts){
        let currentPrice = currentPrices[alert.coin]
        alert.type == "above" && currentPrice >= alert.price ? await sendAlert(alert, currentPrice) : null                 // if above condition match 
        alert.type == "below" && currentPrice <= alert.price ? await sendAlert(alert, currentPrice) : null                 //if below condition match
      }
    }
    catch (error) {
     console.log(error) 
    }
  }
);
  
checkAlert.start();

