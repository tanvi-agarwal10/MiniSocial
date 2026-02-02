const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check that either text or image exists
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must have either text or image' });
    }

    const post = new Post({
      authorId: userId,
      username: user.username,
      text: text || null,
      imageUrl,
    });

    await post.save();
    await post.populate('authorId', 'username email');

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get posts with pagination
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('authorId', 'username email')
      .populate('comments.userId', 'username email');

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ message: 'Post unliked', post, liked: false });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      return res.json({ message: 'Post liked', post, liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = {
      userId,
      username: user.username,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.userId', 'username email');

    res.json({
      message: 'Comment added',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('authorId', 'username email')
      .populate('comments.userId', 'username email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
