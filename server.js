const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const passport   = require('./config/passport');
const session    = require('express-session');
const cookieParser = require("cookie-parser");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
app.use(express.static("client/build"));
app.use(express.static("client/public"));
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(cookieParser('keyboard cat'));
app.use(passport.initialize());
app.use(passport.session());

// Routes
// Define API routes here
require("./routes/api-routes")(app);
require("./routes/api-routes-login")(app);

// ============ multer ============
mongoose.Promise = global.Promise;
const dbConfig = process.env.MONGODB_URI || "mongodb://localhost/eventkeeper";
mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//================ end of multer =================

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
