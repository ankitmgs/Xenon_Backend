const mongoose = require("mongoose");
const url = require("./config").db_url;

mongoose
  .connect(url)
  .then(() => {
    console.log("database successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
