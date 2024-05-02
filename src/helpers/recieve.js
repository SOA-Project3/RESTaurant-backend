const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();

function listenForMessages(subscriptionName, callback) {
  const subscription = pubSubClient.subscription(subscriptionName);

  // Define the callback function for the 'message' event
  subscription.on('message', async (message) => {
    try {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);

      // Acknowledge the message
      message.ack();
      console.log("hello after ack")

      // Parse the message data and pass it to the callback function
      const jsonData = JSON.parse(message.data.toString());
      console.log("hello after parse")
      callback(null, jsonData);
    } catch (error) {
      console.error(`Error handling message: ${error.message}`);
      callback(error, null);
    }
  });
}

module.exports = {
  listenForMessages,
};
