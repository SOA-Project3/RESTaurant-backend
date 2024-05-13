const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers");
const { PubSub } = require('@google-cloud/pubsub');

const keyFilename = process.env.keyfile;
const publisher = new PubSub({
  keyFilename: keyFilename,
});

const server = "https://us-central1-soa-gr6-p3.cloudfunctions.net/auth"

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const register = async(req, res) => {
    const apiUrl = server + "/register";
    console.log(apiUrl);
    console.log(req.body);
  
    await helpers.postData(apiUrl, req.body) 
      .then(jsonResponse => {
        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == statusCodes.FORBIDDEN) {
          res.status(statusCodes.FORBIDDEN).json('Id already exists');
        } else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
      });
  };


  const userById = async(req, res) => {
    const query = req.query;
    
    // Check if query is null, undefined, or an empty object
    if (!query || Object.keys(query).length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
    }

    // Check if the only parameter is UserId
    if (Object.keys(query).length !== 1 || !query.hasOwnProperty('Id')) {
      return res.status(statusCodes.BAD_REQUEST).json('Only Id parameter is allowed');
    }

    // Check if UserId value is empty or null
    if (!query.Id || !query.Id.trim()) {
      return res.status(statusCodes.BAD_REQUEST).json('Id value is empty or null');
    }
    let body = `?Id=${query.Id}`;
    
    const apiUrl = server + "/getUserbyId" + body;
    console.log(apiUrl);  
    await helpers.getData(apiUrl) 
      .then(jsonResponse => {
        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == statusCodes.FORBIDDEN) {
          res.status(statusCodes.FORBIDDEN).json('Id already exists');
        } else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
      });
  };

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const login = (req, res, next) => {
  const apiUrl = server + "/login";
  console.log(apiUrl);

  helpers.postData(apiUrl, req.body, next)
    .then(jsonResponse => {
      res.status(statusCodes.OK).json(jsonResponse);
    })
    .catch(error => {
      if (error.status == statusCodes.FORBIDDEN) {
        res.status(statusCodes.FORBIDDEN).json('Invalid username or Password');
      } else {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    });
};

const deleteUser = async(req, res, next) => {
  const query = req.query;
  console.log(query)

  // Check if query is null, undefined, or an empty object
  if (!query || Object.keys(query).length === 0) {
    return res.status(statusCodes.BAD_REQUEST).json('Query params are missing');
  }

  // Check if the only parameter is UserId
  if (Object.keys(query).length !== 1 || !query.hasOwnProperty('Id')) {
    return res.status(statusCodes.BAD_REQUEST).json('Only Id parameter is allowed');
  }

  // Check if UserId value is empty or null
  if (!query.Id || !query.Id.trim()) {
    return res.status(statusCodes.BAD_REQUEST).json('Id value is empty or null');
  }
  
  try {
    const topicName = 'auth-backend';
    await publishMessage(topicName, query, "deleteUser");
    return res.status(statusCodes.OK).json('Wait for email confirmation');

  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json('Error deleting user. Error: ' + error);
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


  module.exports = {
    register,
    login,
    userById,
    deleteUser
  };