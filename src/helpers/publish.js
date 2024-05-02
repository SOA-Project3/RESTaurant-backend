// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage(topicName, data) {
  const jsonString = JSON.stringify(data);
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(jsonString);

  try {
    const messageId = await pubSubClient
      .topic(topicName)
      .publishMessage({data: dataBuffer});
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    throw error;
  }
}

module.exports = {
    publishMessage,
}