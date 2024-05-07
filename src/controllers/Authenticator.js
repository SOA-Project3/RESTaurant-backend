const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers");


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
        if (error.status == 403) {
          res.status(statusCodes.BAD_REQUEST).json('Id already exists');
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
      if (error.status == 403) {
        res.status(statusCodes.BAD_REQUEST).json('Invalid username or Password');
      } else {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    });
};


  module.exports = {
    register,
    login
  };