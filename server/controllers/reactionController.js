// controllers/reactionController.js
import Reaction from '../models/Reaction.js';

const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

export const toggleReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const postId = req.params.id;

    if (!postId || !type) {
      return res.status(400).json({ message: 'postId and type are required' });
    }

    if (!validReactions.includes(type)) {
      return res.status(400).json({
        message: `Invalid reaction type. Must be one of: ${validReactions.join(', ')}`,
      });
    }

    const existingReaction = await Reaction.findOne({
      user: req.user._id,
      post: postId,
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        await existingReaction.deleteOne();
        return res.json({ message: 'Reaction removed' });
      } else {
        existingReaction.type = type;
        const updatedReaction = await existingReaction.save();
        return res.json(updatedReaction);
      }
    }

    const newReaction = await Reaction.create({
      user: req.user._id,
      post: postId,
      type,
    });

    res.status(201).json(newReaction);
  } catch (error) {
    console.error('Error toggling reaction:', error);
    res.status(500).json({ message: 'Failed to toggle reaction', error: error.message });
  }
};

export const getReactionsByPost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const reactions = await Reaction.find({ post: postId }).populate('user', 'name avatar');

    res.json(reactions);
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ message: 'Failed to fetch reactions' });
  }
};
