const Prompt = require("../Models/Prompt");

// Create a new prompt
const createPrompt = async (req, res) => {
  try {
    const { title, description, content, tags, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const newPrompt = new Prompt({
      user: req.user._id,
      title,
      description,
      content,
      tags,
      category,
    });

    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    res.status(500).json({ message: "Server error while creating prompt." });
  }
};
// Get all prompts for the logged-in user
const getAllPrompts = async (req, res) => {
    try {
      const prompts = await Prompt.find({ user: req.user._id }); // Get prompts only created by the logged-in user
      if (!prompts) {
        return res.status(404).json({ message: "No prompts found" });
      }
      return res.status(200).json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      return res.status(500).json({ message: "Server error while fetching prompts" });
    }
  };
  // Delete a prompt
  const deletePrompt = async (req, res) => {
    try {
      const { id } = req.params;  // Get the prompt ID from the route parameters
  
      // Find and delete the prompt by its ID
      const prompt = await Prompt.findByIdAndDelete(id);
  
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
  
      return res.status(200).json({ message: "Prompt deleted successfully" });
    } catch (error) {
      console.error("Error deleting prompt:", error);
      return res.status(500).json({ message: "Server error while deleting prompt" });
    }
  };
  
// Update a prompt
const updatePrompt = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, content, tags, category } = req.body;
  
      const prompt = await Prompt.findById(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
  
      // Check if the user is the creator of the prompt
      if (prompt.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to update this prompt" });
      }
  
      // Update the prompt fields
      prompt.title = title || prompt.title;
      prompt.description = description || prompt.description;
      prompt.content = content || prompt.content;
      prompt.tags = tags || prompt.tags;
      prompt.category = category || prompt.category;
  
      await prompt.save();
      return res.status(200).json({ message: "Prompt updated successfully", prompt });
    } catch (error) {
      console.error("Error updating prompt:", error);
      return res.status(500).json({ message: "Server error while updating prompt" });
    }
  };
  const toggleFavourite = async (req, res) => {
    const { id } = req.params;  // Get the prompt ID from the route params
    const userId = req.user._id; // Assuming you're using middleware to set the authenticated user (e.g., using JWT)
  
    try {
      // Find the prompt by ID
      const prompt = await Prompt.findById(id);
      if (!prompt) {
        return res.status(404).json({ message: 'Prompt not found' });
      }
  
      // Check if the user already favourited the prompt
      const isFavourite = prompt.favourites.includes(userId);
  
      // Toggle the favourite status
      if (isFavourite) {
        // If the user already favourited the prompt, remove them from the favourites array
        prompt.favourites = prompt.favourites.filter(favUserId => favUserId !== userId);
      } else {
        // If the user hasn't favourited it yet, add them to the favourites array
        prompt.favourites.push(userId);
      }
  
      // Save the updated prompt
      await prompt.save();
  
      // Send the updated prompt along with the isFavourite status
      res.json({
        message: isFavourite ? 'Prompt unfavourited successfully' : 'Prompt favourited successfully',
        prompt,
        isFavourite: !isFavourite // Return the new favourite status for the user
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while toggling favourite' });
    }
  };
  
  
module.exports = {
  createPrompt, getAllPrompts, deletePrompt, updatePrompt, toggleFavourite
};
