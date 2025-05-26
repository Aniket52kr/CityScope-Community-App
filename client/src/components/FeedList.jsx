import React from 'react';
import PostCard from './PostCard';


const FeedList = ({ posts, onDelete }) => {
  return (
    <div>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No posts yet.</p>
      ) : (
        posts.map(post => (
          <PostCard key={post._id} post={post} onDelete={onDelete} />
        ))
      )}
    </div>
  );
};

export default FeedList;
