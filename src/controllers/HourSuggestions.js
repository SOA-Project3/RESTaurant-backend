const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers")

const server = "https://us-central1-soa-g6-p2.cloudfunctions.net/schedule-recommendation/schedule/"

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getHourSuggestion = (req, res, next) => {
    const query = req.query;

    const weekday = Object.values(query)[0];
    if (weekday.length === 0){
      res.status(statusCodes.BAD_REQUEST).send("Weekday input empty")
    }

    const reservationHour = Object.values(query)[1];
    if (reservationHour.length === 0){
      res.status(statusCodes.BAD_REQUEST).send("Reservation hour input empty")
    }
    let body = `${weekday}/${reservationHour}`;
    
    const apiUrl = server + body;
    console.log(apiUrl);
  
    helpers.getData(apiUrl)
      .then(jsonResponse => {
        console.log(jsonResponse);

        var time = jsonResponse.time;
        var day = jsonResponse.day;
        var message = jsonResponse.message;
        var available = jsonResponse.available;

        console.log("Time: " + time);
        console.log("Day: " + day); 
        console.log("Message: " + message);
        console.log("available: " + available);

        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == 404) {
          res.status(statusCodes.NOT_FOUND).send("No available day");
        } else if (error.status == 400) {
          res.status(statusCodes.BAD_REQUEST).send("Bad Request response. Invalid name day of the week. [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday or Sunday]. Or invalid hour of the day, 24 hour format and not contain alphabeti letters. Day and time are required params.");
        } else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
      });
  };

  module.exports = {
    getHourSuggestion,
  };