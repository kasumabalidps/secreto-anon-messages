import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, MessageCircle, Eye } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { supabase } from '../supabaseClient';

const SecretList = ({ secrets: initialSecrets, userIsOwner }) => {
  const [secrets, setSecrets] = useState(initialSecrets);
  const [likedSecrets, setLikedSecrets] = useState({});

  useEffect(() => {
    const messageChannel = supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleMessageChange)
      .subscribe();

    const replyChannel = supabase
      .channel('replies_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, handleReplyChange)
      .subscribe();

    fetchLikedSecrets();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(replyChannel);
    };
  }, []);

  const fetchLikedSecrets = async () => {
    const userIP = await getUserIP();
    const { data: likes, error } = await supabase
      .from('likes')
      .select('message_id')
      .eq('user_ip', userIP);

    if (error) {
      console.error('Error fetching liked secrets:', error);
      return;
    }

    const likedSecretIds = likes.map(like => like.message_id);
    setLikedSecrets(
      likedSecretIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
  };

  const handleMessageChange = (payload) => {
    const { eventType, new: newMessage, old: oldMessage } = payload;

    setSecrets(prevSecrets => {
      switch (eventType) {
        case 'INSERT':
          return [newMessage, ...prevSecrets];
        case 'UPDATE':
          return prevSecrets.map(secret =>
            secret.id === newMessage.id ? { ...secret, ...newMessage } : secret
          );
        case 'DELETE':
          return prevSecrets.filter(secret => secret.id !== oldMessage.id);
        default:
          return prevSecrets;
      }
    });
  };

  const handleReplyChange = (payload) => {
    const { eventType, new: newReply, old: oldReply } = payload;

    setSecrets(prevSecrets => {
      return prevSecrets.map(secret => {
        if (secret.id === newReply.message_id) {
          let updatedReplies = secret.replies || [];
          switch (eventType) {
            case 'INSERT':
              updatedReplies = [...updatedReplies, newReply];
              break;
            case 'UPDATE':
              updatedReplies = updatedReplies.map(reply =>
                reply.id === newReply.id ? { ...reply, ...newReply } : reply
              );
              break;
            case 'DELETE':
              updatedReplies = updatedReplies.filter(reply => reply.id !== oldReply.id);
              break;
          }
          return { ...secret, replies: updatedReplies };
        }
        return secret;
      });
    });
  };

  const getUserIP = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  };

  const deleteSecret = async (secretId) => {
    if (userIsOwner) {
      const { error } = await supabase.from('messages').delete().match({ id: secretId });
      if (error) {
        console.error('Error deleting secret:', error);
      }
    }
  };

  const handleLike = async (secretId) => {
    const userIP = await getUserIP();
    
    if (likedSecrets[secretId]) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ user_ip: userIP, message_id: secretId });

      if (error) {
        console.error('Error unliking secret:', error);
        return;
      }

      setLikedSecrets(prev => ({ ...prev, [secretId]: false }));
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({ user_ip: userIP, message_id: secretId });

      if (error) {
        console.error('Error liking secret:', error);
        return;
      }

      setLikedSecrets(prev => ({ ...prev, [secretId]: true }));
    }
  };

  const deleteComment = async (commentId, secretId) => {
    if (userIsOwner) {
      try {
        const { error } = await supabase
          .from('replies')
          .delete()
          .match({ id: commentId });
        
        if (error) {
          throw error;
        }
        
        setSecrets(prevSecrets => 
          prevSecrets.map(secret => 
            secret.id === secretId
              ? { ...secret, replies: secret.replies.filter(reply => reply.id !== commentId) }
              : secret
          )
        );

        console.log('Comment deleted successfully');
      } catch (error) {
        console.error('Error deleting comment:', error.message);
      }
    }
  };

  const formatLikeCount = (count) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
    return (count / 1000000).toFixed(1) + 'M';
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
                      <span className="font-bold mr-1 text-yellow-400">Nando 👑:</span>
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
                      <span>{formatLikeCount(secret.like_count)}</span>
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
                    onDelete={deleteComment}
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