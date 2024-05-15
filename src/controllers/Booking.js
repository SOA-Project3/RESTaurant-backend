  const { PubSub } = require('@google-cloud/pubsub');
  const statusCodes = require("../constants/statusCodes");
  const helpers = require("../helpers/ResponseHelpers");

  const keyFilename = process.env.keyfile;
  const server = "https://us-central1-soa-gr6-p3.cloudfunctions.net/booking";

  const subscriber = new PubSub({
    keyFilename: keyFilename,
  });
  const publisher = new PubSub({
    keyFilename: keyFilename,
  });
  const subscriptionName = 'recommendation-service-sub';
  const subscription = subscriber.subscription(subscriptionName);

  async function availableScheduleSlots(req, res, next) {
    const apiUrl = server + "/availableScheduleSlots";
    console.log(apiUrl);

    await helpers.getData(apiUrl) 
      .then(jsonResponse => {
        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == statusCodes.NOT_FOUND) {
          res.status(statusCodes.NOT_FOUND).json('No available schedule slots found');
        } else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
      });
  }

  async function userScheduleSlots(req, res, next) {
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
      
      const apiUrl = server + "/userScheduleSlots" + `?userId=${query.userId}`;
      console.log(apiUrl);
    
      await helpers.getData(apiUrl) 
        .then(jsonResponse => {
          res.status(statusCodes.OK).json(jsonResponse);
        })
        .catch(error => {
          if (error.status == statusCodes.NOT_FOUND) {
            res.status(statusCodes.NOT_FOUND).json('No schedule slots found for the specified user');
          } else {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
          }
        });
  };

  const allScheduleSlots = async(req, res) => {
    const apiUrl = server + "/allScheduleSlots";
    console.log(apiUrl);

    await helpers.getData(apiUrl) 
      .then(jsonResponse => {
        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == statusCodes.NOT_FOUND) {
          res.status(statusCodes.NOT_FOUND).json('No schedule slots found');
        } else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
      });
  };

  async function bookedScheduleSlots(req, res, next) {
    const apiUrl = server + "/bookedScheduleSlots";
    console.log(apiUrl);

    await helpers.getData(apiUrl) 
      .then(jsonResponse => {
        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == statusCodes.NOT_FOUND) {
          res.status(statusCodes.NOT_FOUND).json('No booked schedule slots found');
        }else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
      });
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

      res.status(statusCodes.OK).json('Wait for email confirmation');
      
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

      res.status(statusCodes.OK).json('Wait for email confirmation');
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

      res.status(statusCodes.OK).json('Wait for email confirmation');
      
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

      res.status(statusCodes.OK).json('Wait for email confirmation');
    } catch (error) {
      console.error('Error publishing booking request:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error publishing booking request.');
    }
  };

  async function createScheduleSlot(req, res, next) {
    try {
      const query = req.body;
      console.log(query)

      // Check if query is null, undefined, or an empty object
      if (!query || Object.keys(query).length === 0) {
        return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
      }

      // Check if the only parameter is UserId
      if (Object.keys(query).length !== 1 || !query.hasOwnProperty('datetime')) {
        return res.status(statusCodes.BAD_REQUEST).json('Only datetime parameter is allowed');
      }

      // Check if UserId value is empty or null
      if (!query.datetime || !query.datetime.trim()) {
        return res.status(statusCodes.BAD_REQUEST).json('datetime value is empty or null');
      }

      const topicName = 'booking-backend';
      await publishMessage(topicName, query, "createScheduleSlot");

      res.status(statusCodes.OK).json('Wait for email confirmation');
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
    deleteScheduleSlot,
    createScheduleSlot
  };