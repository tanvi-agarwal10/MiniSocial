const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    createdAt: {
      type: Date,
      default: Date.now,
      index: -1, // For sorting by newest first
    },
  },
  { timestamps: true }
);

// Validate that at least text or imageUrl exists
postSchema.pre('save', function (next) {
  if (!this.text && !this.imageUrl) {
    throw new Error('Post must have either text or imageUrl');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
