const {StatusCodes} = require('http-status-codes')

const sendSuccessResponse = (res, data, message) => {
    const responseObj = {
      statusCode: StatusCodes.OK,
      success: true,
      data,
      message 
    };
  return res.status(StatusCodes.OK).json(responseObj);
};

const sendErrorResponse = (res, statusCode, message) => {
  if(!message && !statusCode){
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      message = 'Oops, something went wrong.Please try again later.'
    }
  const responseObj = {
    statusCode,
    success: false,
    message
  };
  return res.status(StatusCodes.BAD_REQUEST).json(responseObj);
};


module.exports = {sendSuccessResponse, sendErrorResponse}