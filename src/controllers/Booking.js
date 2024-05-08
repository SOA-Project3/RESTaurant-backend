const { PubSub } = require('@google-cloud/pubsub');
const statusCodes = require("../constants/statusCodes");
const topicName = 'booking-backend';

const subscriber = new PubSub();
const publisher = new PubSub();

// Set up a subscription to listen for messages
const subscriptionName = 'recommendation-service-sub';
const subscription = subscriber.subscription(subscriptionName);

async function getAllScheduleLots(req, res, next) {
  try {
    // Publish the recommendation request
    await publishMessage(topicName, "", "getAllScheduleLots");

    // Wait for the recommendation response from the subscription
    const recommendation = await waitForRecommendation();
    
    // Send the recommendation response to the client
    res.status(statusCodes.OK).json(recommendation);
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send('Error publishing booking request.');
  }
}

async function publishMessage(topicName, data, filter) {
  const jsonString = JSON.stringify(data);
  const dataBuffer = Buffer.from(jsonString);
  const attributes = {
    name: filter
  };
  
    try {
    const messageId = await publisher
      .topic(topicName)
      .publishMessage(dataBuffer, attributes);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    throw error;
  }
}


async function waitForRecommendation() {
  // Return the stored recommendation data
  return new Promise((resolve, reject) => {
      // If recommendation data is not available, wait for the next message
      subscription.on('message', async (message) => {
        try {
          // Process the received message
          const data = JSON.parse(message.data.toString());
          console.log('Received recommendation:', data);
          message.ack();
          resolve(data);
        } catch (error) {
          console.error('Error processing recommendation message:', error);
          // Acknowledge the message to prevent reprocessing
          message.ack();
          reject(error);
        }
      });   
  });
}

module.exports = {
    getAllScheduleLots,
};