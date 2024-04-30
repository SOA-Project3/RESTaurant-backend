const { getRecommendation } = require('../controllers/Recommendations');

// Mocking
jest.mock('../helpers/ResponseHelpers', () => ({
  getData: jest.fn(),
}));

const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers");

describe('getRecommendation function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 404 status and error message if second parameter value is empty', async () => {
    req.query = { meal: 'pizza', drink: '' };
    await getRecommendation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(statusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith('Input value is empty');
  });

  it('should return 404 status and error message if API call returns 404 status', async () => {
    req.query = { meal: 'pizza' };
    helpers.getData.mockRejectedValueOnce({ status: 404 });
    await getRecommendation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(statusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith('Could not find a recommendation for that meal');
  });

  it('should return 400 status and error message if API call returns 400 status', async () => {
    req.query = { meal: 'pizza' };
    helpers.getData.mockRejectedValueOnce({ status: 400 });
    await getRecommendation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(statusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith('Bad Request response. Invalid number of query parameters. Must be between 1 and 2. Or invalid query values, must be one of [meal, drink, dessert]. Values should not contain numbers or invalid letters');
  }); 

  it('should return 500 status and error message if API call returns unknown error status', async () => {
    req.query = { meal: 'pizza' };
    helpers.getData.mockRejectedValueOnce({ status: 500 });
    await getRecommendation(req, res, next);
    expect(res.status).toBe(statusCodes.INTERNAL_SERVER_ERROR);
    expect(res.send).toBe('Internal Server Error');
  });

  it('should return recommendation data with 200 status if API call is successful', async () => {
    req.query = { meal: 'pizza' };
    const mockData = {
      meal: 'pizza',
      dessert: 'cake',
      drink: 'coke'
    };
    helpers.getData.mockResolvedValueOnce(mockData);
    await getRecommendation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(statusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});
