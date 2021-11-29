const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();
app.use(bodyParser.json());

app.use("/api/places/", placesRoutes);

app.use("/api/users/", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  //check is response sent
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://fullstack-dre:Xzv5jWOPmhe8zLTL@cluster0.a50wi.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(2000);
  })
  .catch((err) => {
    console.log(err);
  });
