const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("dotenv").config();
const app = express();
const ModReview = require('./src/models/ModReviewModel');

// mongoose connection
let uri = 'mongodb+srv://dbUser:dbUserPassword@modq1-msbla.gcp.mongodb.net/modq?retryWrites=true';
let options = {useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(uri, options).catch(err => console.log(err.reason));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// fs.readdirSync(__direname + '/models').forEach(function(filename) {
//     if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
// });

// // Default test response
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "Working test"
//     });
// });

// Assigning directory to respective var names
const usersRoutes = require('./src/routes/users');
const modReviewRoutes = require('./src/routes/modReviews');

// Routes for handling requests (for endpoints)
app.use(cors());
app.use(express.json());

// GET Request for ALL mod reviews
app.use(router.get("/", (req, res, next) => {
    console.log("HOMEPAGE to GET ALL mod reviews");
    ModReview.find()
      .then((modreviews) => res.json(modreviews))
      .catch((err) => res.status(400).json("Error: " + err));
  })
);

app.use('/users', usersRoutes);
app.use('/modReviews', modReviewRoutes);



// Reaches this when no routes are found
app.use((req, res, next) => {
    const error = new Error('No endpoint (route) found');
    error.status = 404;
    next(error);
})

// Reaches this when other parts of code throws error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
