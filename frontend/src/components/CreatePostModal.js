import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { postAPI } from '../services/api';
import '../styles/CreatePostModal.css';

const CreatePostModal = ({ show, onHide, onPostCreated }) => {
  const [formData, setFormData] = useState({
    text: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleTextChange = (e) => {
    setFormData((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.text.trim()) {
      setError('Post must have text content');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('text', formData.text);
      // Note: Image upload disabled due to Render's ephemeral storage
      // For production, use S3/Cloudinary integration

      await postAPI.createPost(data);
      setFormData({ text: '', image: null });
      setPreview(null);
      onPostCreated();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create post';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ text: '', image: null });
    setPreview(null);
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>What's on your mind?</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write something..."
              value={formData.text}
              onChange={handleTextChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add an image (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </Form.Group>

          {preview && (
            <div className="image-preview mb-3">
              <img src={preview} alt="Preview" className="img-fluid rounded" />
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
