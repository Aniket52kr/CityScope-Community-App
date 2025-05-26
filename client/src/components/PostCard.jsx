import React from 'react';
import { useAuth } from '../context/AuthContext';
import ReactionButtons from './ReactionButtons';
import ReplyBox from './ReplyBox';
import { FaTrash } from 'react-icons/fa';



const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
  };

  const isOwner = user && user._id === post.author?._id;

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 mb-6 border min-h-[280px]">
      {/* Delete Icon - only for owner */}
      {isOwner && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          title="Delete Post"
        >
          <FaTrash />
        </button>
      )}

      {/* Author Info */}
      <div className="flex items-center mb-2">
        <img
          src={
            post.author?.avatar ||
            'https://cdn-icons-png.flaticon.com/512/847/847969.png'
          }
          alt="Author"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{post.author?.name}</h3>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-2">{post.content}</p>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full max-h-90 object-cover rounded mb-2"
        />
      )}

      {/* Tags & Type */}
      <div className="text-sm text-gray-500 mb-2">
        {post.tags.map((tag, index) => (
          <span key={index} className="inline-block bg-gray-200 px-2 py-1 rounded mr-1">
            #{tag}
          </span>
        ))}
        <span className="ml-2 font-medium">{post.type}</span>
      </div>

      {/* Reactions */}
      <ReactionButtons post={post} />

      {/* Replies */}
      <ReplyBox postId={post._id} replies={post.replies || []} />
    </div>
  );
};

export default PostCard;
