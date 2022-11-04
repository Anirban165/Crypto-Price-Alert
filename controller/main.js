var coins = require("../coins")
const currentPrice = require("../helpers/currentPriceBinance");
const {sendSuccessResponse, sendErrorResponse} = require('../helpers/sendResponse')
const alertsCollection = require('../database/models')

exports.coinPrices = async (req, res) => {
  try {
    const prices = await currentPrice();
    return sendSuccessResponse(res, prices.data)
  } catch (error) {
    console.log(error)
    return sendErrorResponse(res, 500, error.message);
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { coin, price, type, mobile, call, whatsapp, sms} = req.body;
    if (!coin || !price || !mobile || !type){                                               
      return sendErrorResponse(res, 400, 'Please provide the Required fields !')
    }      
    if(!coins.find(coin => coin == coin.toUpperCase())){                                      
      return sendErrorResponse(res, 400, `You can't set Alerts for ${coin} !`)
    }                    
    if(isNaN(price)){                                                                     
      return sendErrorResponse(res, 400, 'Please enter Valid price !')                        
    }
    if (!(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(mobile))){                           
      return sendErrorResponse(res, 400, 'Please enter Valid mobile number !')   
    }
    if(type != 'above' && type != 'below' ){                                                  
      return sendErrorResponse(res, 400, 'Only Above & Below Type Allowed.') 
    }    
    if (call === false && sms === false && whatsapp === false ){                               
      return sendErrorResponse(res, 400, 'Please Select atleast one Alert types !') 
    }
    await alertsCollection.create(req.body)
    console.log("Alert set Successfully !");
    return sendSuccessResponse(res, undefined, 'Alert set Successfully !')                    
  } 
  catch (error) {
    console.log(error)
    return sendErrorResponse(res);
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await alertsCollection.find().lean()
    return sendSuccessResponse(res, alerts)   
  } catch (error) {
    console.log(error)
    return sendErrorResponse(res)
  }  
};

exports.deleteAlerts = async (req ,res) => {
  try {
    const {id} = req.params
    if(!id || id === undefined)return sendErrorResponse(res, 400, 'Please send Valid id !')
    const data = await alertsCollection.findByIdAndDelete(id)
    return sendSuccessResponse(res, data, 'Alert deleted successfully') 
  } catch (error) {
    console.log(error)
    return sendErrorResponse(res)
  }
};
