const { PubSub } = require('@google-cloud/pubsub');
const statusCodes = require("../constants/statusCodes");

const keyFilename = process.env.keyfile;

const subscriber = new PubSub({
  keyFilename: keyFilename,
});
const publisher = new PubSub({
  keyFilename: keyFilename,
});
const subscriptionName = 'recommendation-service-sub';
const subscription = subscriber.subscription(subscriptionName);

async function availableScheduleSlots(req, res, next) {
  try {
    const topicName = 'booking-backend';
    await publishMessage(topicName, "getAllScheduleLots", "getAllScheduleLots");

    const availableScheduleSlots = await waitForRecommendation();
    
    if (availableScheduleSlots.status === 200){
      res.status(statusCodes.OK).json(availableScheduleSlots.message);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(availableScheduleSlots.error);
    }
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send('Error publishing booking request.');
  }
}

async function userScheduleSlots(req, res, next) {
  try {
    const query = req.query;
    console.log(query)

    // Check if query is null, undefined, or an empty object
    if (!query || Object.keys(query).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
    }

    // Check if the only parameter is UserId
    if (Object.keys(query).length !== 1 || !query.hasOwnProperty('userId')) {
      return res.status(statusCodes.BAD_REQUEST).json('Only UserId parameter is allowed');
    }

    // Check if UserId value is empty or null
    if (!query.userId || !query.userId.trim()) {
      return res.status(statusCodes.BAD_REQUEST).json('UserId value is empty or null');
    }

    const topicName = 'booking-backend';
    await publishMessage(topicName, query, "userSchedulesLots");

    const userSchedulesLots_response = await waitForRecommendation();

    if (userSchedulesLots_response.status === 200){
      res.status(statusCodes.OK).json(userSchedulesLots_response.message);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(userSchedulesLots_response.error);
    }
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

async function allScheduleSlots(req, res, next) {
  try {
    const topicName = 'booking-backend';
    await publishMessage(topicName, "allScheduleSlots", "allScheduleSlots");

    const allScheduleSlots_response = await waitForRecommendation();
    
    res.status(statusCodes.OK).json(allScheduleSlots_response.message);
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

async function bookedScheduleSlots(req, res, next) {
  try {
    const topicName = 'booking-backend';
    await publishMessage(topicName, "bookedScheduleSlots", "bookedScheduleSlots");

    const bookedScheduleSlots_response = await waitForRecommendation();
    if (bookedScheduleSlots_response.status === 200){
      res.status(statusCodes.OK).json(bookedScheduleSlots_response.message);
    }else if (bookedScheduleSlots_response.status === 400) {
      return res.status(statusCodes.BAD_REQUEST).json(bookedScheduleSlots_response.error);
    }else if (bookedScheduleSlots_response.status === 404){
      return res.status(statusCodes.NOT_FOUND).json(bookedScheduleSlots_response.error);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(bookedScheduleSlots_response.error);
    }
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

async function bookScheduleSlot(req, res, next) {
  try {
    const query = req.query;
    console.log(query)

    if (!query || Object.keys(query).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
    }

    // Validate query parameters
    const allowedKeys = ['userId', 'scheduleSlotId', 'peopleQuantity'];
    const queryKeys = Object.keys(query);

    // Check if all required keys are present
    const missingKeys = allowedKeys.filter(key => !queryKeys.includes(key));
    if (missingKeys.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(`Missing required parameter(s): ${missingKeys.join(', ')}`);
    }

    // Check if any extra keys are present
    const extraKeys = queryKeys.filter(key => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(`Unexpected parameter(s): ${extraKeys.join(', ')}`);
    }

    const topicName = 'booking-backend';
    await publishMessage(topicName, query, "bookScheduleSlot");

    const bookScheduleSlot_response = await waitForRecommendation();

    if (bookScheduleSlot_response.status === 200){
      res.status(statusCodes.OK).json(bookScheduleSlot_response.message);
    }else if (bookScheduleSlot_response.status === 400) {
      return res.status(statusCodes.BAD_REQUEST).json(bookScheduleSlot_response.error);
    }else if (bookScheduleSlot_response.status === 404){
      return res.status(statusCodes.NOT_FOUND).json(bookScheduleSlot_response.error);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(bookScheduleSlot_response.error);
    }
    
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

async function cancelScheduleSlot(req, res, next) {
  try {
    const query = req.query;
    console.log(query)

    if (!query || Object.keys(query).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
    }

    // Validate query parameters
    const allowedKeys = ['userId', 'scheduleSlotId'];
    const queryKeys = Object.keys(query);

    // Check if all required keys are present
    const missingKeys = allowedKeys.filter(key => !queryKeys.includes(key));
    if (missingKeys.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(`Missing required parameter(s): ${missingKeys.join(', ')}`);
    }

    // Check if any extra keys are present
    const extraKeys = queryKeys.filter(key => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(`Unexpected parameter(s): ${extraKeys.join(', ')}`);
    }


    const topicName = 'booking-backend';
    await publishMessage(topicName, query, "cancelScheduleSlot");

    const scheduleSlotId_response = await waitForRecommendation();
    if (scheduleSlotId_response.status === 200){
      res.status(statusCodes.OK).json(scheduleSlotId_response.message);
    }else if (scheduleSlotId_response.status === 400) {
      return res.status(statusCodes.BAD_REQUEST).json(scheduleSlotId_response.error);
    }else if (scheduleSlotId_response.status === 404){
      return res.status(statusCodes.NOT_FOUND).json(scheduleSlotId_response.error);
    }else if (scheduleSlotId_response.status === 401){
      return res.status(statusCodes.FORBIDDEN).json(scheduleSlotId_response.error);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(scheduleSlotId_response.error);
    }
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

async function updateScheduleSlotQuantity(req, res, next) {
  try {
    const query = req.query;
    console.log(query)

    if (!query || Object.keys(query).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
    }

    // Validate query parameters
    const allowedKeys = ['userId', 'scheduleSlotId', 'peopleQuantity'];
    const queryKeys = Object.keys(query);

    // Check if all required keys are present
    const missingKeys = allowedKeys.filter(key => !queryKeys.includes(key));
    if (missingKeys.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(`Missing required parameter(s): ${missingKeys.join(', ')}`);
    }

    // Check if any extra keys are present
    const extraKeys = queryKeys.filter(key => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(`Unexpected parameter(s): ${extraKeys.join(', ')}`);
    }

    const topicName = 'booking-backend';
    await publishMessage(topicName, query, "updateScheduleSlotQuantity");

    const updateScheduleSlotQuantity_response = await waitForRecommendation();

    if (updateScheduleSlotQuantity_response.status === 200){
      res.status(statusCodes.OK).json(updateScheduleSlotQuantity_response.message);
    }else if (updateScheduleSlotQuantity_response.status === 400) {
      return res.status(statusCodes.BAD_REQUEST).json(updateScheduleSlotQuantity_response.error);
    }else if (updateScheduleSlotQuantity_response.status === 401){
      return res.status(statusCodes.FORBIDDEN).json(updateScheduleSlotQuantity_response.error);
    }else if (updateScheduleSlotQuantity_response.status === 404){
      return res.status(statusCodes.NOT_FOUND).json(updateScheduleSlotQuantity_response.error);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(updateScheduleSlotQuantity_response.error);
    }
    
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

async function deleteScheduleSlot(req, res, next) {
  try {
    const query = req.query;
    console.log(query)

    // Check if query is null, undefined, or an empty object
    if (!query || Object.keys(query).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
    }

    // Check if the only parameter is UserId
    if (Object.keys(query).length !== 1 || !query.hasOwnProperty('scheduleSlotId')) {
      return res.status(statusCodes.BAD_REQUEST).json('Only scheduleSlotId parameter is allowed');
    }

    // Check if UserId value is empty or null
    if (!query.scheduleSlotId || !query.scheduleSlotId.trim()) {
      return res.status(statusCodes.BAD_REQUEST).json('scheduleSlotId value is empty or null');
    }

    const topicName = 'booking-backend';
    await publishMessage(topicName, query, "deleteScheduleSlot");

    const deleteScheduleSlot_response = await waitForRecommendation();

    if (deleteScheduleSlot_response.status === 200){
      res.status(statusCodes.OK).json(deleteScheduleSlot_response.message);
    }else if (deleteScheduleSlot_response.status === 404){
      return res.status(statusCodes.NOT_FOUND).json(deleteScheduleSlot_response.error);
    }else{
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json(deleteScheduleSlot_response.error);
    }
  } catch (error) {
    console.error('Error publishing booking request:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
  }
};

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
};


async function waitForRecommendation() {
  return new Promise((resolve, reject) => {
      subscription.on('message', async (message) => {
        try {
          // Process the received message
          const data = JSON.parse(message.data.toString());
          console.log('Received response');
          console.log(data);
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
};

module.exports = {
  availableScheduleSlots,
  userScheduleSlots,
  allScheduleSlots,
  bookedScheduleSlots,
  bookScheduleSlot,
  cancelScheduleSlot,
  updateScheduleSlotQuantity,
  deleteScheduleSlot
};