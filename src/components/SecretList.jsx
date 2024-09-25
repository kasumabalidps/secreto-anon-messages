import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, MessageCircle, Eye } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { supabase } from '../supabaseClient';
import { reloadPage } from '../utils';

const SecretList = ({ secrets, userIsOwner }) => {
  const [likedSecrets, setLikedSecrets] = useState({});

  const deleteSecret = async (secretId) => {
    if (userIsOwner) {
      await supabase.from('messages').delete().match({ id: secretId });
      reloadPage();
    }
  };

  const handleLike = async (secretId) => {
    //here update selanjutnya
  };

  if (!secrets || secrets.length === 0) {
    return <p className="text-gray-400">Belum ada pesan. Jadilah yang pertama mengirim!</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">Pesan Terbaru</h2>
      <AnimatePresence>
        <ul className="space-y-4">
          {secrets.map((secret) => (
            <motion.li 
              key={secret.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
              onMouseEnter={() => incrementViews(secret.id)}
            >
              <div className="flex flex-col">
                <div className="flex-grow overflow-hidden mb-2">
                  <p className="text-white break-words whitespace-pre-wrap">
                    {secret.is_owner ? (
                      <span className="font-bold mr-1 text-yellow-400">Nando (👑):</span>
                    ) : (
                      <span className="font-bold mr-1 text-gray-400">User 🤷‍♂️:</span>
                    )}
                    {secret.content}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <p>{new Date(secret.created_at).toLocaleString()}</p>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(secret.id)} 
                      className={`flex items-center ${likedSecrets[secret.id] ? 'text-red-500' : 'text-gray-400'} hover:text-red-700`}
                    >
                      <Heart size={16} className="mr-1" />
                      <span>{secret.likes || 0}</span>
                    </button>
                    <div className="flex items-center text-gray-400">
                      <MessageCircle size={16} className="mr-1" />
                      <span>{secret.replies ? secret.replies.length : 0}</span>
                    </div>
                    {userIsOwner && (
                      <button 
                        onClick={() => deleteSecret(secret.id)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {secret.replies && secret.replies.map((comment) => (
                  <Comment 
                    key={comment.id}
                    comment={comment}
                    secretId={secret.id}
                    userIsOwner={userIsOwner}
                  />
                ))}
                <CommentForm secretId={secret.id} userIsOwner={userIsOwner} />
              </div>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </motion.div>
  );
};

export default SecretList;