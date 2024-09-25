import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from './supabaseClient';

const SecretsContext = createContext();

const secretsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SECRETS':
      return action.payload;
    case 'ADD_SECRET':
      return [action.payload, ...state];
    case 'DELETE_SECRET':
      return state.filter(secret => secret.id !== action.payload);
    case 'ADD_COMMENT':
      return state.map(secret =>
        secret.id === action.payload.messageId
          ? { ...secret, replies: [...(secret.replies || []), action.payload.comment] }
          : secret
      );
    case 'DELETE_COMMENT':
      return state.map(secret => ({
        ...secret,
        replies: (secret.replies || []).filter(reply => reply.id !== action.payload)
      }));
    default:
      return state;
  }
};

export const SecretsProvider = ({ children }) => {
  const [secrets, dispatch] = useReducer(secretsReducer, []);

  useEffect(() => {
    fetchSecrets();
    const channel = supabase.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleMessagesChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, handleRepliesChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSecrets = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, replies(*)')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching secrets:', error);
    else dispatch({ type: 'SET_SECRETS', payload: data || [] });
  };

  const handleMessagesChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      dispatch({ type: 'ADD_SECRET', payload: payload.new });
    } else if (payload.eventType === 'DELETE') {
      dispatch({ type: 'DELETE_SECRET', payload: payload.old.id });
    }
  };

  const handleRepliesChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      dispatch({
        type: 'ADD_COMMENT',
        payload: { messageId: payload.new.message_id, comment: payload.new }
      });
    } else if (payload.eventType === 'DELETE') {
      dispatch({ type: 'DELETE_COMMENT', payload: payload.old.id });
    }
  };

  return (
    <SecretsContext.Provider value={{ secrets, dispatch }}>
      {children}
    </SecretsContext.Provider>
  );
};

export const useSecrets = () => useContext(SecretsContext);