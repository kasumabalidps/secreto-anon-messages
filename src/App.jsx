import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SecretForm from './components/SecretForm';
import SecretList from './components/SecretList';
import Footer from './components/Footer'
import { supabase } from './supabaseClient';
import { getUserIp, isOwner } from './utils';

function App() {
  const [secrets, setSecrets] = useState([]);
  const [userIp, setUserIp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSecrets();
    fetchUserIp();
  }, []);

  const fetchUserIp = async () => {
    const ip = await getUserIp();
    setUserIp(ip);
  };

  const fetchSecrets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        replies (*)
      `)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching secrets:', error);
    else setSecrets(data || []);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-4 text-center uppercase"
        >
          Secreto by Nando 📝
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl mb-12 text-center text-gray-300"
        >
          Kirim Pesan Anonim ke Gweh
        </motion.p>
        
        <div className="space-y-12">
          <SecretForm userIp={userIp} />
          <SecretList secrets={secrets} userIsOwner={isOwner(userIp)} />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;