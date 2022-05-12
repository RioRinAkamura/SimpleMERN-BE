const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth")

const Post = require("../models/Post");

// @Route POST api/posts
// @desc Cerate post
// @access Private
router.post("/", verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    // Simple valication
    if (!title) {
        res.status(400).json({ success: false, message: "Title is required" });
    }
    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith("https://") ? url : `https://${url}`,
            status: status || "TO LEARN",
            user: req.userId,
        });

        await newPost.save();
        res.status(200).json({ success: true, message: "Happy learning", post: newPost });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @Route GET api/posts
// @desc Get posts
// @access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate("user", ["username"])
        res.status(200).json({ success: true, posts })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }
})


// @Route PUT api/posts
// @desc Update posts
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body

    // simple validation
    if (!title) {
        res.status(400).json({ success: false, message: "Title is required" });
    }

    try {
        let updatedPost = {
            title,
            description,
            url: (url.startsWith("https://") ? url : `https://${url}`) || '',
            status: status || "TO LEARN",
        };

        const postUpdateCondition = { _id: req.params.id, user: req.userId }
        updatedPost = await Post.findByIdAndUpdate(postUpdateCondition, updatedPost, { new: true })

        //User not authorised to update post 
        if (!updatedPost) {
            res.status(401).json({ success: false, message: "Post not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Updated successfully!", post: updatedPost })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route DELETE api/posts
// @desc Delete posts
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
    try {

        const postDeleteCondition = { _id: req.params.id, user: req.userId }

        const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

        // User not authorised of post not found
        if (!deletedPost) {
            res.status(401).json({ success: false, message: "Post not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Deleted successfully!", post: deletedPost })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
})




module.exports = router;
