const { PubSub } = require('@google-cloud/pubsub');
const statusCodes = require("../constants/statusCodes");

const keyFilename = process.env.keyfile;

const subscriber = new PubSub({
  keyFilename: keyFilename,
});
const publisher = new PubSub({
  keyFilename: keyFilename,
});
// Set up a subscription to listen for messages
const subscriptionName = 'recommendation-service-sub';
const subscription = subscriber.subscription(subscriptionName);

async function getAllScheduleLots(req, res, next) {
  try {
    const topicName = 'booking-backend';
    // Publish the recommendation request
    await publishMessage(topicName, "hola", "getAllScheduleLots");

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
  const jsonString = data ? JSON.stringify(data): '';
  const dataBuffer = Buffer.from(jsonString);
  const attributes = {
    name: filter
  };
  console.log(attributes)
    try {
    const messageId = await publisher
      .topic(topicName)
      .publishMessage({data:dataBuffer, attributes:attributes} );
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
          console.log('Received recommendation');
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