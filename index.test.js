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
    it('GET /recommendations should return status 400 for invalid request', async () => {
      const response = await request(app).get('/recommendations?invalidParam=value');
      expect(response.status).toBe(400);
      expect(response.text).toEqual("\"Invalid query parameter value 'invalidParam'. Must be one of: meal, drink, dessert.\"");
    });
    it('GET undefined route should return status 404', async () => {
      const response = await request(app).get('/undefinedroute');
      expect(response.status).toBe(404);
    });
    it('POST /sendFeedback should return status 400 for empty feedback', async () => {
      const response = await request(app)
        .post('/sendFeedback')
        .send({ feedback: '' });
      expect(response.status).toBe(400);
      expect(response.text).toEqual("\"Bad Request response. Feedback is required.\"");
    });    
    it('POST /login should return status 403 for the incorrect password', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'luismorarod98@gmail.com', password: 'password123' });
      expect(response.status).toBe(403);
      expect(response.text).toEqual("\"Invalid username or Password\"");
    });   
    it('GET /allScheduleSlots should return status 200 and JSON response with all schedule slots', async () => {
      const response = await request(app).get('/allScheduleSlots');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(false);
    });
    it('GET /availableScheduleSlots should return status 200 and JSON response with all available schedule slots', async () => {
      const response = await request(app).get('/availableScheduleSlots');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(false);
    });
    it('GET /userScheduleSlots should return status 200', async () => {
      const response = await request(app)
        .get('/userScheduleSlots?userId=geogd.712@gmail.com');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(false);
    });
    it('GET /bookedScheduleSlots should return status 200 and JSON response with all schedule slots', async () => {
      const response = await request(app).get('/bookedScheduleSlots');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(false);
    });
    it('GET /deleteScheduleSlot should return status 200 ', async () => {
      const response = await request(app)
        .post('/deleteScheduleSlot')
        .send({ scheduleSlotId: 2});
      expect(response.status).toBe(404);
      expect(Array.isArray(response.body)).toBe(false);
    });
});
