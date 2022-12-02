const mongoose = require("mongoose");
const validator = require("validator");
const authorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the title"],
      enum: {
        values: ["Mr", "Mrs", "Miss"],
        message: "Title can be Mr, Mrs, or Miss",
      },
    },

    fname: {
      type: String,
      required: [true, "Please provide your First Name"],
    },
    lname: {
      type: String,
      required: [true, "Please provide your Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your Email-ID"],
      unique: true,
      validate: [validator.isEmail, "Not a valid Email-ID"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password should be greater than 8 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("authors", authorSchema);
