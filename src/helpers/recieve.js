const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();

function listenForMessages(subscriptionName) {
  const subscription = pubSubClient.subscription(subscriptionName);

  return new Promise((resolve, reject) => {
    subscription.on('message', async (message) => {
      try {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);

        // Acknowledge the message
        await message.ack();

        // Resolve the promise with the message data
        resolve(JSON.parse(message.data.toString()));
      } catch (error) {
        console.error(`Error handling message: ${error.message}`);
        reject(error);
      }
    });
  });
}

module.exports = {
  listenForMessages,
};
