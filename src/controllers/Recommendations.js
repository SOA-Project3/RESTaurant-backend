const { response } = require("express");
const statusCodes = require("../constants/statusCodes");
const publishHelpers = require("../helpers/publish");
const recieveHelpers = require("../helpers/recieve");

const getRecommendation = async (req, res, next) => {
  const query = req.query;
  const queryKeys = Object.keys(query);
  const queryLength = queryKeys.length;
  console.log(query);

  // Check if any input value is empty
  for (const key of queryKeys) {
    if (query[key].length === 0) {
      return res.status(statusCodes.NOT_FOUND).send(`${key} value is empty`);
    }
  }


  const topicName = 'recommendation-backend';
  const subscriptionName = 'recommendation-service-sub';
  try {
    await publishHelpers.publishMessage(topicName, query);
    console.log('Message published to Pub/Sub.')

    const response = await recieveHelpers.listenForMessages(subscriptionName);
    console.log(response)
    res.status(statusCodes.OK).json(response);
} catch (error) {
    console.error(`Error publishing message to Pub/Sub: ${error}`);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Error publishing message to Pub/Sub");
}


};

  module.exports = {
    getRecommendation,
  };