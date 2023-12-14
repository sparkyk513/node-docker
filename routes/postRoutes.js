const express = require("express");
const postController = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// localhost:3000/
// The protect requires you to login before being able to retrieve the posts (in Postman)
router.route("/").get(protect, postController.getAllPosts).post(protect, postController.createPost);
router.route("/:id").get(protect, postController.getOnePost).patch(protect, postController.updatePost).delete(protect, postController.deletePost);

module.exports = router;