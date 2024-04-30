const statusCodes = require("../constants/statusCodes");
const publishHelpers = require("../responseHelpers/PublishPubSubConfig");

const server = "https://us-central1-soa-g6-p2.cloudfunctions.net/recommendation/custom/"

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getRecommendation = async (req, res, next) => {
  const query = req.query;
  const queryKeys = Object.keys(query);
  const queryLength = queryKeys.length;
  
  // Check if any input value is empty
  for (const key of queryKeys) {
    if (query[key].length === 0) {
      return res.status(statusCodes.NOT_FOUND).send(`${key} value is empty`);
    }
  }
  
  let messageBody = '';
  // Construct the message body
  for (let i = 0; i < queryLength; i++) {
    const key = queryKeys[i];
    const value = query[key];
    messageBody += `${key}=${value}`;
    if (i !== queryLength - 1) {
      messageBody += '&';
    }
  }

  console.log(messageBody);

  const topicName = 'recommendation-backend';
  try {
    await publishMessage(topicName, messageBody);
    res.status(statusCodes.OK).send('Message published to Pub/Sub.');

    // Listen for recommendations
    const subscriptionName = 'recommendation-service-sub';
    listenForMessages(subscriptionName);
} catch (error) {
    console.error(`Error publishing message to Pub/Sub: ${error}`);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Error publishing message to Pub/Sub");
}


};

  module.exports = {
    getRecommendation,
  };