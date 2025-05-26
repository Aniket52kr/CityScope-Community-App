import React, { useState } from 'react';
import axios from 'axios';

const reactionEmojis = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
};

const ReactionButtons = ({ post }) => {
  const [reactions, setReactions] = useState(post.reactions || []);
  const [selectedType, setSelectedType] = useState(
    reactions.find(r => r.user === post.author?._id)?.type || ''
  );

  const handleReaction = async (type) => {
    const isSame = selectedType === type;
    const updated = isSame
      ? reactions.filter(r => r.user !== post.author?._id)
      : [...reactions, { user: post.author?._id, type }];

    setSelectedType(isSame ? '' : type);
    setReactions(updated);

    try {
      await axios.post(`/api/posts/${post._id}/reaction`, { type }, { withCredentials: true });
    } catch (err) {
      alert('Failed to update reaction');
      setReactions(reactions); // rollback
    }
  };

  return (
    <div className="flex space-x-2 mt-2">
      {Object.keys(reactionEmojis).map((type) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            selectedType === type ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          {reactionEmojis[type]} {reactions.filter(r => r.type === type).length}
        </button>
      ))}
    </div>
  );
};

export default ReactionButtons;