const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers")

const server = "https://us-central1-soa-g6-p2.cloudfunctions.net/recommendation/custom/"

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getRecommendation = (req, res, next) => {
    const query = req.query;
  
    const queryLength = Object.keys(query).length;
    const firstParameter = Object.keys(query)[0];
    const firstParameterValue = Object.values(query)[0];
    if (firstParameterValue.length === 0){
      res.status(statusCodes.NOT_FOUND).send("Input value is empty");
    }
    let body = `?${firstParameter}=${firstParameterValue}`;
  
    if (queryLength === 2) {
      const secondParameter = Object.keys(query)[1];
      const secondParameterValue = Object.values(query)[1];
      if (secondParameterValue.length === 0){
        res.status(statusCodes.NOT_FOUND).send("Input value is empty");
      }
      body += `&${secondParameter}=${secondParameterValue}`;
    }
  
    const apiUrl = server + body;
    console.log(apiUrl);
  
    helpers.getData(apiUrl)
      .then(jsonResponse => {
        console.log(jsonResponse);

        var meal = jsonResponse.meal;
        var dessert = jsonResponse.dessert;
        var drink = jsonResponse.drink;

        console.log("Meal: " + meal);
        console.log("Dessert: " + dessert); 
        console.log("Drink: " + drink);

        res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
        if (error.status == 404) {
          res.status(statusCodes.NOT_FOUND).send("Could not find a recommendation for that meal");
        } else if (error.status == 400) {
          res.status(statusCodes.BAD_REQUEST).send("Bad Request response. Invalid number of query parameters. Must be between 1 and 2. Or invalid query values, must be one of [meal, drink, dessert]. Values should not contain numbers or invalid letters");
        } else {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
      });
  };

  module.exports = {
    getRecommendation,
  };