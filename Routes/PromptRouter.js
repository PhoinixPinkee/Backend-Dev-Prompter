const express = require("express");
const router = express.Router();
const {
  createPrompt,
  getAllPrompts,
  deletePrompt,
  updatePrompt,
  toggleFavourite,
} = require("../Controllers/promptController");
const authMiddleware = require("../Middlewares/authUser");
const Prompt = require("../Models/Prompt");
// ⭐ Toggle Favourite
router.post("/favourite/:id", authMiddleware, async (req, res) => {
    try {
      const promptId = req.params.id;
      const userId = req.user._id;
  
      const prompt = await Prompt.findById(promptId);
      if (!prompt) return res.status(404).json({ message: "Prompt not found" });
  
      const isFavourited = prompt.favourites.includes(userId);
  
      if (isFavourited) {
        prompt.favourites.pull(userId); // remove from favourites
      } else {
        prompt.favourites.push(userId); // add to favourites
      }
  
      await prompt.save();
  
      res.json({
        message: isFavourited ? "Removed from favourites" : "Added to favourites",
        isFavourited: !isFavourited,
      });
    } catch (err) {
      console.error("Favourite toggle error:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // 📦 Get All Favourited Prompts
  router.get("/favourites", authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
  
      const favouritePrompts = await Prompt.find({ favourites: userId }).sort({ createdAt: -1 });
  
      res.json(favouritePrompts);
    } catch (err) {
      console.error("Fetch favourites error:", err);
      res.status(500).json({ message: "Failed to fetch favourites" });
    }
  });
  router.post('/:id/toggle-favourite', authMiddleware, toggleFavourite);
// Route for creating a prompt
router.post("/create", authMiddleware, createPrompt);

// Route to get all prompts created by the logged-in user
router.get("/", authMiddleware, getAllPrompts);

// Route to delete a prompt
router.delete("/:id", authMiddleware, deletePrompt);

// Route to update a prompt
router.put("/:id", authMiddleware, updatePrompt);

module.exports = router;
