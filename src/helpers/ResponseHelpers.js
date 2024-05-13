const axios = require('axios');
const statusCodes = require("../constants/statusCodes");



async function getData(url, next) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const err = new Error("Error while requesting our service");
      err.status = response.status;
      throw err;
    }
    return await response.json();
  } catch (error) {
    if (error.status === statusCodes.FORBIDDEN) {
      error.status = statusCodes.FORBIDDEN;
    } else if (error.status === statusCodes.NOT_FOUND){
      error.status = statusCodes.NOT_FOUND;
    } else if (error.status === statusCodes.BAD_REQUEST){
      error.status = statusCodes.BAD_REQUEST;
    }else {
      error.status = statusCodes.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
}


async function postData(url, data) {
  try {
    const response = await axios.post(url, data);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    if (error.status === statusCodes.FORBIDDEN) {
      error.status = statusCodes.FORBIDDEN;
    } else if (error.status === statusCodes.NOT_FOUND){
      error.status = statusCodes.NOT_FOUND;
    } else if (error.status === statusCodes.BAD_REQUEST){
      error.status = statusCodes.BAD_REQUEST;
    }else {
      error.status = statusCodes.INTERNAL_SERVER_ERROR;
    } 
    throw error;
  }
}

module.exports = {
  postData,
  getData
};
