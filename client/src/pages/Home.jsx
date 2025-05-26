// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import PostForm from '../components/PostForm';
import FeedList from '../components/FeedList';
import axios from 'axios';

const api_url = process.env.REACT_APP_API_URL;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${api_url}/api/posts`, { withCredentials: true });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${api_url}/api/posts/${postId}`, { withCredentials: true });
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-black">CityPulse Feed</h1>
      <PostForm />
      {loading ? (
        <p>Loading feed...</p>
      ) : (
        <FeedList posts={posts} onDelete={handleDeletePost} />
      )}
    </div>
  );
};

export default Home;
