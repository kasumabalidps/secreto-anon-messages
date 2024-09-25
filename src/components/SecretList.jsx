import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { supabase } from '../supabaseClient';
import { reloadPage } from '../utils';

const SecretList = ({ secrets, userIsOwner }) => {
  const deleteSecret = async (secretId) => {
    if (userIsOwner) {
      await supabase.from('messages').delete().match({ id: secretId });
      reloadPage();
    }
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
            >
              <div className="flex flex-col">
                <div className="flex-grow overflow-hidden mb-2">
                  <p className="text-white break-words whitespace-pre-wrap">
                    {secret.is_owner && <span className="font-bold mr-2 text-yellow-400">Owner (👑) </span>}
                    {secret.content}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <p>{new Date(secret.created_at).toLocaleString()}</p>
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