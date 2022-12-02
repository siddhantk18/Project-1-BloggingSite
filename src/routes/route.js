const express = require("express");
const router = express.Router();
const AuthorController = require("../Controller/authorController");
const Blogcontroller = require("../Controller/Blogcontroller");
const Authenticate = require("../Middleware/auth");

router.post("/authors", AuthorController.createAuthor);
router.post("/login", AuthorController.loginAuthor);
router
  .route("/blogs")
  .post(Authenticate.authentication, Blogcontroller.createBlog)
  .get(Authenticate.authentication, Blogcontroller.getBlog)
  .delete(Authenticate.authentication, Blogcontroller.deleteBlogByQuery);

router
  .route("/blogs/:blogId")
  .put(
    Authenticate.authentication,
    Authenticate.authorisation,
    Blogcontroller.updateBlog
  )
  .delete(
    Authenticate.authentication,
    Authenticate.authorisation,
    Blogcontroller.deleteBlog
  );

module.exports = router;
