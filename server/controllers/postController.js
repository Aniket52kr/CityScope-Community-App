import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import Reaction from '../models/Reaction.js';


// Supported post types
const validTypes = ['Recommend a place', 'Ask for help', 'Share a local update', 'Event announcement'];

// Create a new post and save it to the database
export const createPost = async (req, res) => {
  try {
    // 🔍 Accessing fields from req.body and req.file
    const { content, type, tags } = req.body;

    // Log full request for debugging
    console.log('[Post] Raw request body:', req.body);
    console.log('[Post] File uploaded:', req.file ? req.file.originalname : 'No image');

    // Validate required fields
    if (!content || !type) {
      return res.status(400).json({ message: 'Content and type are required' });
    }

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid post type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Safely parse tags
    let parsedTags = [];
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags); // If sent as stringified JSON
      } catch {
        parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean); // Fallback to comma-separated
      }
    }

    // Build post object
    const post = new Post({
      author: req.user._id,
      content: content.trim(),
      type,
      tags: parsedTags,
      imageUrl: req.file?.path, // Cloudinary URL from multer
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);

  } catch (error) {
    console.error('[Post] Error creating post:', error.message);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get all posts (user feed), optionally filtered by type or tags
export const getPosts = async (req, res) => {
  try {
    const { type, tag } = req.query;
    let query = {};

    if (type && validTypes.includes(type)) {
      query.type = type;
    }

    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get a post by its ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Delete a post by its ID
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all replies related to this post
    await Reply.deleteMany({ post: post._id });

    // Delete all reactions related to this post
    await Reaction.deleteMany({ post: post._id });

    // Now delete the post itself
    await post.deleteOne();

    res.json({ message: 'Post and all associated replies and reactions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};


// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: 'Post like status updated', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update like status' });
  }
};

// Reply to a post
export const replyToPost = async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Reply content is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const reply = new Reply({
      post: post._id,
      author: req.user._id,
      content,
    });

    const savedReply = await reply.save();

    // Populate author info (name, avatar) before sending reply
    await savedReply.populate('author', 'name avatar');

    post.replies.push(savedReply._id);
    await post.save();

    res.status(201).json(savedReply);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reply' });
  }
};

// Upload image handler with Cloudinary URL fix
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Cloudinary returns the uploaded image URL in req.file.path
    const imageUrl = req.file.path;

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed' });
  }
};