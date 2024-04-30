const request = require('supertest');
const { app } = require('./src/index.js');

describe('RESTaurant App', () => {
    it('GET /recommendations should return status 200 and JSON response with recommendations', async () => {
        const response = await request(app).get('/recommendations/?meal=Pizza');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          meal: 'Pizza',
          dessert: 'Helado de cajeta',
          drink: 'Jugo de mango'
        });
      });

      it('GET /suggestions should return status 200 and JSON response with hour suggestions', async () => {
        const response = await request(app).get('/suggestions/?day=Sunday&hour=12:30');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          available: false,
          message: 'The hour requested is not available. Available time for the same day',
          day: 'Sunday',
          time: '11:00'
        });
      });
    it('POST /sendFeedback should return status 400 for empty feedback', async () => {
      const response = await request(app)
        .post('/sendFeedback')
        .send({ feedback: '' });
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Bad Request response. Feedback is required.');
    });
    it('GET /recommendations should return status 400 for invalid request', async () => {
      const response = await request(app).get('/recommendations?invalidParam=value');
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Bad Request response. Invalid number of query parameters. Must be between 1 and 2. Or invalid query values, must be one of [meal, drink, dessert]. Values should not contain numbers or invalid letters');
    });
    it('GET undefined route should return status 404', async () => {
      const response = await request(app).get('/undefinedroute');
      expect(response.status).toBe(404);
    });
});
