import React from 'react';
import { Trash2 } from 'lucide-react';

const Comment = ({ comment, secretId, userIsOwner, onDelete }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(comment.id, secretId);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex flex-col">
        <div className="flex-grow overflow-hidden mb-2">
          <p className="text-sm text-gray-300 break-words whitespace-pre-wrap">
            {comment.is_owner ? (
              <span className="font-bold mr-1 text-yellow-400">Nando 👑:</span>
            ) : (
              <span className="font-bold mr-1 text-gray-400">User 🤷‍♂️:</span>
            )}
            {comment.content}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <p>{new Date(comment.created_at).toLocaleString()}</p>
          {userIsOwner && (
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
