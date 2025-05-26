import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import FeedList from '../components/FeedList';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(''); // URL or base64 string

  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const userRes = await axios.get('/api/auth/me', { withCredentials: true });
      const postRes = await axios.get(`/api/posts?author=${userRes.data._id}`, {
        withCredentials: true,
      });

      setUser(userRes.data);
      setPosts(postRes.data);

      // Initialize edit form fields
      setName(userRes.data.name || '');
      setBio(userRes.data.bio || '');
      setAvatar(userRes.data.avatar || '');

    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setUpdating(true);
  setError('');

  try {
    const res = await axios.put(
      `/api/users/profile`,  // pass user id here
      { name, bio, avatar },
      { withCredentials: true }
    );

    setUser(res.data);
    setEditMode(false);
  } catch (err) {
    console.error('Failed to update profile:', err);
    setError('Failed to update profile. Please try again.');
  } finally {
    setUpdating(false);
  }
};


if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  if (error) return (
    <div className="text-center mt-10 text-red-600">
      <p>{error}</p>
      <button
        onClick={fetchProfile}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  );

  if (!user) return <p className="text-center mt-10">Not logged in.</p>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-xl">

      {!editMode ? (
        <>
          <ProfileCard user={user} />
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-4">

  {/* Name input */}
  <div>
    <label className="block font-semibold mb-1">Name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="w-full border p-2 rounded"
    />
  </div>

  {/* Avatar file upload */}
  <div>
    <label className="block font-semibold mb-1">Profile Picture</label>
    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { 
        alert("File is too large. Max size is 20MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);  // base64 string
      };
      reader.readAsDataURL(file);
    }
  }}
  className="w-full"
/>

    {avatar && (
      <img
        src={avatar}
        alt="avatar preview"
        className="mt-2 w-24 h-24 rounded-full object-cover"
      />
    )}
  </div>

  {/* Bio input */}
  <div>
    <label className="block font-semibold mb-1">Bio</label>
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      rows={3}
      className="w-full border p-2 rounded"
      placeholder="Tell us about yourself"
    />
  </div>

  <div className="flex space-x-2">
    <button
      type="submit"
      disabled={updating}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
    >
      {updating ? 'Saving...' : 'Save Changes'}
    </button>
    <button
      type="button"
      onClick={() => setEditMode(false)}
      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
      disabled={updating}
    >
      Cancel
    </button>
  </div>

  {error && <p className="text-red-600">{error}</p>}
</form>

      )}

      <h2 className="text-xl font-semibold mt-8 mb-4">Your Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-600">You haven’t made any posts yet.</p>
      ) : (
        <FeedList posts={posts} />
      )}
    </div>
  );
};

export default Profile;
