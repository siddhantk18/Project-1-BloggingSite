const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide the title of the Blog"],
  },
  body: {
    type: String,
    trim: true,
    required: [true, "Please provide the body"],
  },
  tags: {
    type: [String],
  },
  category: {
    type: String,
    required: [true, "Please mention the category"],
  },
  authorId: {
    type: ObjectId,
    ref: "authors",
    required: [true, "Please provide the author ID"],
  },
  subcategory: {
    type: [String],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Blogs", BlogSchema);
