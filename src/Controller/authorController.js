const AuthorModel = require("../Models/authorModel");
const jwt = require("jsonWebToken");
exports.createAuthor = async (req, res) => {
  try {
    const author = await AuthorModel.create(req.body);
    res.status(201).json({ status: true, data: author });
  } catch (err) {
    return res.status(400).json({ status: false, msg: err.message });
  }
};

exports.loginAuthor = async (req, res) => {
  try {
    const findAuthor = await AuthorModel.findOne({
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });
    if (!findAuthor) {
      return res
        .status(400)
        .json({ status: false, msg: "Émail or Password is incorrect" });
    }
    const token = jwt.sign(
      { authorId: findAuthor._id },
      process.env.SECRET_KEY
    );
    return res.status(200).send({ status: true, data: { token } });
  } catch (err) {
    return res.status(500).json({ status: false, msg: err.message });
  }
};
