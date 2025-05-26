import Reply from '../models/Reply.js';

// Add a new reply to a post
export const addReply = async (req, res) => {
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ message: 'postId and content are required' });
  }

  try {
    const reply = new Reply({
      author: req.user._id,
      post: postId,
      content,
    });

    const savedReply = await reply.save();
    const populatedReply = await savedReply.populate('author', 'name avatar');

    res.status(201).json(populatedReply);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
};

// Get all replies for a given post
export const getRepliesByPost = async (req, res) => {
  try {
    const replies = await Reply.find({ post: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Failed to fetch replies' });
  }
};

// Edit an existing reply (must be own reply)
export const editReply = async (req, res) => {
  const { replyId, content } = req.body;

  if (!replyId || !content) {
    return res.status(400).json({ message: 'replyId and content are required' });
  }

  try {
    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this reply' });
    }

    reply.content = content;
    const updatedReply = await reply.save();
    const populatedUpdatedReply = await updatedReply.populate('author', 'name avatar');

    res.json(populatedUpdatedReply);
  } catch (error) {
    console.error('Error editing reply:', error);
    res.status(500).json({ message: 'Failed to edit reply' });
  }
};

// Delete a reply (must be own reply)
export const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this reply' });
    }

    await reply.deleteOne();
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: 'Failed to delete reply' });
  }
};
