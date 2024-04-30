const statusCodes = require("../constants/statusCodes");
const getTypes = require("../constants/classmatesRecommendationDict")
const helpers = require("../helpers/RecommendationHelpers")

const server = "http://soadproyecto1.eastus.azurecontainer.io:44319/api/Meal"


async function fetchData(url, next) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const err = new Error("Error while requesting our service");
      err.status = response.status;
      throw err;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    if (next) {
      next(error);
    }
    throw error;
  }
}

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getClassmatesRecommendation = (req, res, next) => {
  const query = req.query;
  let responseApi = {};

  const queryLength = Object.keys(query).length;
  const firstParameter = Object.keys(query)[0];
  const firstParameterValue = Object.values(query)[0];
  if (firstParameterValue.length === 0){
    return notFoundError(next)
  }
  let body = `?SourceType=Local&MealName1=${firstParameterValue}&CourseType1=${getTypes[firstParameter]}`;

  if (queryLength === 2) {
    const secondParameter = Object.keys(query)[1];
    const secondParameterValue = Object.values(query)[1];
    if (secondParameterValue.length === 0){
      return notFoundError(next)
    }
    body += `&MealName2=${secondParameterValue}&CourseType2=${getTypes[secondParameter]}`;
  }

  const apiUrl = server + body;

  fetchData(apiUrl)
    .then(jsonResponse => {
      console.log(jsonResponse);
      const recommendation1 = jsonResponse.data.RecommendedMeals[0].Name;
      const type1 = jsonResponse.data.RecommendedMeals[0].CourseType;

      if (queryLength === 1) {
        const recommendation2 = jsonResponse.data.RecommendedMeals[1].Name;
        const type2 = jsonResponse.data.RecommendedMeals[1].CourseType;
        responseApi = helpers.writeResponse(
          responseApi,
          firstParameter,
          getTypes[type1],
          getTypes[type2],
          firstParameterValue,
          recommendation1,
          recommendation2
        );
      } else {
        const secondParameter = Object.keys(query)[1];
        const secondParameterValue = Object.values(query)[1];
        responseApi = helpers.writeResponse(
          responseApi,
          firstParameter,
          secondParameter,
          getTypes[type1],
          firstParameterValue,
          secondParameterValue,
          recommendation1
        );
      }

      res.status(statusCodes.OK).json(responseApi); // Move this line inside the .then block
    })
    .catch(error => {
      console.error("Unknown error:", error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    });
};

function notFoundError(next) {

  const err = new Error("Could not find a recommendation for that meal");
  err.status = statusCodes.NOT_FOUND;
  return next(err);
  
};
module.exports = {
  getClassmatesRecommendation,
};
