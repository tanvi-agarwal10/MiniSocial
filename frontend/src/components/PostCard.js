import React, { useState } from 'react';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { postAPI } from '../services/api';
import '../styles/PostCard.css';

const PostCard = ({ post, onPostUpdated }) => {
  const [liked, setLiked] = useState(post.likes.includes(localStorage.getItem('userId')));
  const [likes, setLikes] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLike = async () => {
    try {
      setError('');
      const response = await postAPI.likePost(post._id);
      setLiked(response.data.liked);
      setLikes(response.data.post.likes.length);
      onPostUpdated();
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await postAPI.addComment(post._id, {
        text: commentText,
      });
      setComments(response.data.post.comments);
      setCommentText('');
      onPostUpdated();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <Card className="post-card mb-3">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>@{post.username}</span>
          <small className="text-muted">{formatDate(post.createdAt)}</small>
        </Card.Title>

        {post.text && <Card.Text>{post.text}</Card.Text>}
        {post.imageUrl && (
          <div className="post-image-container">
            <img
              src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${post.imageUrl}`}
              alt="Post"
              className="post-image"
            />
          </div>
        )}

        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}

        <div className="post-actions mt-3">
          <Button
            variant={liked ? 'danger' : 'outline-danger'}
            size="sm"
            onClick={handleLike}
            className="me-2"
          >
            ❤️ {likes}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            💬 {comments.length}
          </Button>
        </div>

        {showComments && (
          <div className="comments-section mt-3 pt-3 border-top">
            {comments.length > 0 ? (
              <div className="comments-list mb-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="comment mb-2">
                    <strong>@{comment.username}</strong>
                    <p className="mb-1">{comment.text}</p>
                    <small className="text-muted">{formatDate(comment.createdAt)}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No comments yet</p>
            )}

            <Form onSubmit={handleCommentSubmit}>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={loading || !commentText.trim()}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Comment'}
              </Button>
            </Form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PostCard;
