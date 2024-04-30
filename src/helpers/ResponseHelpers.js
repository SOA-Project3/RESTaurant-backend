const axios = require('axios');


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
    console.error("Error fetching data:", error);
    if (next) {
      next(error);
    }
    throw error;
  }
}

async function postData(url, body, next) {
  try {
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (next) {
      next(error);
    }
    throw error;
  }
}

module.exports = {
  postData,
  getData
};
