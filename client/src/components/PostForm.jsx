import React, { useState } from 'react';
import apiClient from '../services/apiClient';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('Recommend a place');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validTypes = ['Recommend a place', 'Ask for help', 'Share a local update', 'Event announcement'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (!validTypes.includes(type)) {
      setError('Invalid post type selected');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', type);
  
    if (tags) {
      formData.append('tags', tags);
    }

    if (image) {
      formData.append('image', image);
    }

    try {
      await apiClient.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
      });

      window.location.reload(); // Or clear form
    } catch (err) {
      const message =err.response?.data?.message || err.message || 'Failed to create post';

      setError(message);
      console.error('[Post] Create failed:', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 mb-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening in your neighborhood?"
        className="w-full p-3 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        rows="3"
        required
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        {validTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Add tags (comma-separated)"
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-2"
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default PostForm;