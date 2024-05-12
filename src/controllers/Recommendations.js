const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers")

const server = "https://us-central1-soa-gr6-p3.cloudfunctions.net/recommendation/custom/"

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getRecommendation = (req, res, next) => {
  const query = req.query;
  const queryParams = Object.keys(query);
  const validParams = ["meal", "drink", "dessert"];

  if (queryParams.length > 2 || queryParams.length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json("Invalid number of query parameters. Must be between 1 and 2.");
  }

  for (const param of queryParams) {
      if (!validParams.includes(param)) {
          return res.status(statusCodes.BAD_REQUEST).json(`Invalid query parameter value '${param}'. Must be one of: meal, drink, dessert.`);
      }
  }

  for (const param in query) {
      if (query[param].length === 0) {
          return res.status(statusCodes.NOT_FOUND).json("Input value is empty");
      }
  }

  let body = `?${queryParams[0]}=${query[queryParams[0]]}`;

  if (queryParams.length === 2) {
      body += `&${queryParams[1]}=${query[queryParams[1]]}`;
  }

  const apiUrl = server + body;
  console.log(apiUrl);

  helpers.getData(apiUrl)
      .then(jsonResponse => {
          console.log(jsonResponse);

          const { meal, dessert, drink } = jsonResponse;

          console.log("Meal: " + meal);
          console.log("Dessert: " + dessert);
          console.log("Drink: " + drink);

          res.status(statusCodes.OK).json(jsonResponse);
      })
      .catch(error => {
          if (error.status == 404) {
              res.status(statusCodes.NOT_FOUND).json("Could not find a recommendation for that meal");
          } else if (error.status == 400) {
              res.status(statusCodes.BAD_REQUEST).json("Bad Request response. Invalid number of query parameters. Must be between 1 and 2. Or invalid query values, must be one of [meal, drink, dessert]. Values should not contain numbers or invalid letters");
          } else {
              res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
          }
      });
};



  module.exports = {
    getRecommendation,
  };