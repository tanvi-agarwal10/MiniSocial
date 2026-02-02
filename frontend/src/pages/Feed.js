import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Pagination } from 'react-bootstrap';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import Navbar from '../components/Navbar';
import '../styles/Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const limit = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await postAPI.getPosts(currentPage, limit);
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handlePostCreated = async () => {
    setShowModal(false);
    // Refetch posts immediately from page 1
    try {
      setLoading(true);
      const response = await postAPI.getPosts(1, limit);
      setPosts(response.data.posts);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to refresh posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdated = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.First
          key="first"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      );
    }

    return items;
  };

  return (
    <>
      <Navbar onCreateClick={() => setShowModal(true)} />
      <Container className="feed-container mt-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        {!loading && posts.length === 0 && (
          <Alert variant="info">No posts yet. Be the first to post!</Alert>
        )}
        <Row>
          <Col md={8} className="mx-auto">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </Col>
        </Row>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>{generatePaginationItems()}</Pagination>
          </div>
        )}
      </Container>

      <CreatePostModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
};

export default Feed;
