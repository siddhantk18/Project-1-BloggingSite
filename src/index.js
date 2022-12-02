const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/route");
app.use(express.json());
mongoose
  .connect(process.env.DATABASE_LINK, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MOngoDB connected successfully"))
  .catch((err) => {
    console.log(err.message);
  });
app.use("/", route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
