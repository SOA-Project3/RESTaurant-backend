const express = require("express");
const morgan = require("morgan"); 
const cors = require("cors"); 
const bodyParser = require('body-parser');
const menu = require("./models/menu.json"); 
const port = 5555; 

const app = express(); //Main express app
const router = express.Router(); 
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("tiny")); //Log request
app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Use the cors middleware
app.use(cors());

const booking = require("./controllers/Booking");
router.get("/allScheduleSlots", booking.allScheduleSlots); 
router.get("/availableScheduleSlots", booking.availableScheduleSlots); 
router.get("/bookedScheduleSlots", booking.bookedScheduleSlots); 
router.get("/userScheduleSlots", booking.userScheduleSlots); 
router.put("/bookScheduleSlot", booking.bookScheduleSlot); 
router.put("/cancelScheduleSlot", booking.cancelScheduleSlot); 
router.put("/updateScheduleSlotQuantity", booking.updateScheduleSlotQuantity); 
router.delete("/deleteScheduleSlot", booking.deleteScheduleSlot); 
router.post("/createScheduleSlot", booking.createScheduleSlot); 


const recommendationController = require("./controllers/Recommendations");
router.get("/recommendations", recommendationController.getRecommendation); 

const hourSuggestion = require("./controllers/HourSuggestions");
router.get("/suggestions", hourSuggestion.getHourSuggestion); 

const submitFeedback = require("./controllers/ChatBot");
router.post("/sendFeedback", submitFeedback.submitFeedback); 

const getFeedback = require("./controllers/ChatBot");
router.get("/getFeedback", getFeedback.getFeedback); 

const auth = require("./controllers/Authenticator");
router.post("/login", auth.login); 
router.post("/register", auth.register); 
router.get("/getUserbyId", auth.userById); 
router.get("/deleteUser", auth.deleteUser); 
router.get("/resetPassword", auth.resetPassword); 
router.post("/updatePassword", auth.updatePassword); 



app.get('/menu', (req, res) => {
    res.json(menu);
  });

app.use(router); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    app
};