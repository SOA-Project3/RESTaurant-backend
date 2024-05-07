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
    console.error('Error:', error.response.status);
    if (error.response.status === statusCodes.FORBIDDEN) {
      error.status = statusCodes.FORBIDDEN;
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
    console.error('Error:', error.response.status);
    if (error.response.status === statusCodes.FORBIDDEN) {
      error.status = statusCodes.FORBIDDEN;
    } 
    throw error;
  }
}

module.exports = {
  postData,
  getData
};
