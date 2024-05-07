
const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers");

const server = "https://us-central1-soa-g6-p2.cloudfunctions.net/chatbot/";



  
/**
 * Handle feedback submission request
 * @param {*} req
 * @param {*} res
 * @returns
 */
const submitFeedback = async (req, res, next) => {
    const feedback = req.body.feedback; // Aquí obtenemos directamente el valor de 'feedback' del cuerpo de la solicitud
    if (!feedback) {
      return badRequestError(res);
    }
  
    const body = {
      feedback: feedback
    };
  
    const apiUrl = server + "postFeedback";
    console.log(apiUrl);
  
    try {
      const jsonResponse = await helpers.postData(apiUrl, body, next);
      console.log(jsonResponse);
  
      res.status(statusCodes.OK).json(jsonResponse);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return notFoundError(res);
      } else {
        return internalServiceError(res);
      }
    }
};

/**
 * Handle feedback retrieval request
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getFeedback = async (req, res, next) => {
  const apiUrl = server + "getFeedback";
  console.log(apiUrl);

  try {
    const jsonResponse = await helpers.getData(apiUrl, next);
    console.log(jsonResponse);

    res.status(statusCodes.OK).json(jsonResponse);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return notFoundError(res);
    } else {
      return internalServiceError(res);
    }
  }
};

function notFoundError(res) {
  res.status(statusCodes.NOT_FOUND).send("Pending message");
}

function internalServiceError(res) {
  res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
}

function badRequestError(res) {
  res.status(statusCodes.BAD_REQUEST).send("Bad Request response. Feedback is required.");
}

module.exports = {
  submitFeedback,
  getFeedback,
};
