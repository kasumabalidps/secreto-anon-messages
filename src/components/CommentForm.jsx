import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getUserIp, isOwner } from '../utils';

const CommentForm = ({ secretId }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const userIp = await getUserIp();
      const { data, error } = await supabase.from('replies').insert([
        { 
          message_id: secretId, 
          content: commentText,
          ip_address: userIp,
          is_owner: isOwner(userIp)
        }
      ]).select();

      if (error) {
        console.error('Error adding comment:', error);
      } else {
        setCommentText('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Tulis komentar..."
        className="w-full px-3 py-2 text-sm text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600"
        maxLength={200}
      />
      <button 
        type="submit" 
        className="transition ease-in-out mt-2 px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-800 border border-gray-500"
      >
        Comment
      </button>
    </form>
  );
};

export default CommentForm;