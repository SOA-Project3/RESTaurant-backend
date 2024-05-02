const { response } = require("express");
const statusCodes = require("../constants/statusCodes");
const publishHelpers = require("../helpers/publish");
const recieveHelpers = require("../helpers/recieve");

const getRecommendation = async (req, res, next) => {
  const query = req.query;
  const queryKeys = Object.keys(query);
  const queryLength = queryKeys.length;
  console.log(query);

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

    let responseSent = false;

    // Listen for messages
    recieveHelpers.listenForMessages(subscriptionName, (error, response) => {
      if (!responseSent) {
        if (error) {
          console.error('Error processing message:', error);
          res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Error processing message");
        } else {
          console.log("hello after listen")

          // Log the response
          console.log(response);
    
          // Send the response to the client
          res.status(statusCodes.OK).json(response);
        }
        responseSent = true;
      }
    });
    
} catch (error) {
    console.error(`Error publishing message to Pub/Sub: ${error}`);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Error publishing message to Pub/Sub");
}


};

  module.exports = {
    getRecommendation,
  };