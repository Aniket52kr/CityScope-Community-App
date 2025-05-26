import React, { useState } from 'react';
import axios from 'axios';

const ReplyBox = ({ postId, replies }) => {
  const [replyText, setReplyText] = useState('');
  const [replyList, setReplyList] = useState(replies || []);
  const [isSending, setIsSending] = useState(false);
 
  const api_url = process.env.REACT_APP_API_URL;
  const handleReply = async () => {
    if (!replyText.trim()) return;

    setIsSending(true);

    try {
      const response = await axios.post(
        `${api_url}/api/posts/${postId}/reply`,
        { content: replyText },
        { withCredentials: true }
      );

      const savedReply = response.data;

      // Ensure that the reply has author name and avatar
      if (!savedReply.author || !savedReply.author.name) {
        throw new Error('Author not populated');
      }

      setReplyList(prev => [...prev, savedReply]);
      setReplyText('');
    } catch (err) {
      console.error(err);
      alert('Failed to send reply or get author info.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-2 border-t pt-2">
      <div className="flex">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 p-1 border rounded"
          disabled={isSending}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleReply();
            }
          }}
        />
        <button
          onClick={handleReply}
          disabled={isSending}
          className={`bg-blue-500 text-white px-3 ml-2 rounded ${
            isSending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSending ? 'Sending...' : 'Reply'}
        </button>
      </div>

      <div className="mt-2">
        {replyList.length > 0 && <h4 className="text-sm font-semibold mb-1">Replies:</h4>}
        {replyList.map((reply) => {
          const author = reply.author || {};
          const authorName = author.name || 'Anonymous';
          const authorAvatar = author.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

          return (
            <div key={reply._id || reply.createdAt || Math.random()} className="flex items-start mt-1">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-6 h-6 rounded-full mr-2"
              />
              <div>
                <strong className="text-sm">{authorName}</strong>
                <p className="text-sm">{reply.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReplyBox;
