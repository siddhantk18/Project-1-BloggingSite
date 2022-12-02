const BlogModel = require("../Models/blogModel");
const AuthorModel = require("../Models/authorModel");
const { isValidObjectId } = require("mongoose");

exports.createBlog = async (req, res) => {
  try {
    if (req.body.isPublished == true) {
      req.body.publishedAt = Date.now();
    }
    if (req.authorId == req.body.authorId) {
      if (!isValidObjectId(req.body.authorId)) {
        return res
          .status(400)
          .json({ status: false, message: "Author ID is not Valid" });
      }
      const checkAuthor = await AuthorModel.findById(req.body.authorId);
      if (!checkAuthor) {
        return res
          .status(404)
          .json({ status: false, msg: "No author exist with this ID" });
      }
      const blog = await BlogModel.create(req.body);
      return res.status(201).json({
        status: true,
        data: blog,
      });
    } else {
      return res.status(403).json({
        status: false,
        msg: "You are not authorised to create a blog with this author ID",
      });
    }
  } catch (err) {
    return res.status(400).send({ status: false, error: err.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const listOfBlogs = await BlogModel.find({
        $and: [{ isDeleted: false }, { isPublished: true }],
      });
      if (listOfBlogs.length == 0) {
        return res
          .status(404)
          .json({ status: false, msg: "No such blog exist" });
      }
      return res.status(200).json({ status: true, data: listOfBlogs });
    } else {
      const blogs = await BlogModel.find({
        $and: [
          req.query,
          {
            isDeleted: false,
            isPublished: true,
          },
        ],
      });
      if (blogs.length == 0) {
        return res
          .status(404)
          .json({ status: false, msg: "No such blog exist" });
      }
      return res.status(200).json({ status: true, data: blogs });
    }
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { category, title, body, tags, subCategory, isPublished } = req.body;
    if (!isValidObjectId(req.params.blogId)) {
      return res.status(400).json({ status: false, msg: "Invalid ID" });
    }
    const blog = await BlogModel.findOne({
      _id: req.params.blogId,
      isDeleted: false,
    });

    if (!blog) {
      return res.status(404).json({
        status: false,
        msg: "Blog either does not exist or is deleted",
      });
    }
    if (tags && subCategory) {
      if (tags.length == 0 || subCategory.length == 0) {
        return res
          .status(400)
          .json({ status: false, msg: "Please do not leave the field empty" });
      }
    }
    if (isPublished == true) {
      const updatedBlog = await BlogModel.findOneAndUpdate(
        { isDeleted: false, _id: req.params.blogId },

        {
          $set: {
            category,
            title,
            body,
            isPublished,
            updatedAt: Date.now(),
            publishedAt: Date.now(),
          },
          $push: { tags, subCategory },
        },
        { new: true }
      );
      if (!updatedBlog) {
        return res.status(404).json({
          status: false,
          msg: "Either the blog does not exist with this ID or is deleted",
        });
      }
      return res.status(200).json({ status: true, data: updatedBlog });
    } else {
      const updatedBlog = await BlogModel.findOneAndUpdate(
        { isDeleted: false, _id: req.params.blogId },

        {
          $set: {
            category,
            title,
            body,
            isPublished,
            updatedAt: Date.now(),
          },
          $push: { tags, subCategory },
        },
        { new: true }
      );
      if (!updatedBlog) {
        return res.status(404).json({
          status: false,
          msg: "Either the blog does not exist with this ID or is deleted",
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "successfull", data: updatedBlog });
    }
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.blogId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid ID provided" });
    }

    const deleteBlog = await BlogModel.findOneAndUpdate(
      {
        _id: req.params.blogId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: Date.now(),
        },
      }
    );
    if (!deleteBlog) {
      return res.status(404).json({
        status: false,
        msg: "Blog either does not exist or is deleted",
      });
    }
    return res.status(200).json({ status: true });
  } catch (err) {
    return res.status(500).json({ status: false, msg: err.message });
  }
};

exports.deleteBlogByQuery = async (req, res) => {
  try {
    let data = req.query;
    if (Object.keys(req.query).length == 0) {
      return res
        .status(400)
        .json({ status: false, msg: "You must choose one category" });
    }
    const blog = await BlogModel.find({
      $and: [data, { isDeleted: false }],
    });
    if (blog.length == 0) {
      return res.status(404).json({ status: false, msg: "No such blog exist" });
    }
    for (let i = 0; i < blog.length; i++) {
      if (blog[i].authorId == req.authorId) {
        var deletedBlog = await BlogModel.updateMany(
          data,
          { $set: { isDeleted: true, deletedAt: Date.now() } },
          { new: true }
        );
        if (deletedBlog.matchedCount == 0) {
          return res
            .status(404)
            .json({ status: false, msg: "No such blog exist" });
        }
        return res.status(200).json({ status: true });
      }
    }
    return res.status(403).json({ status: false, msg: "Authorization failed" });
  } catch (err) {
    return res.status(500).json({ status: false, msg: err.message });
  }
};
