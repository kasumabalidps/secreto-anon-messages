import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { isOwner } from '../utils';

const SecretForm = ({ userIp }) => {
  const [secretText, setSecretText] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({});
  const [geoLocation, setGeoLocation] = useState({});

  const getExpandedDeviceInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : null,
      plugins: Array.from(navigator.plugins).map(plugin => ({
        name: plugin.name,
        description: plugin.description
      })),
      mimeTypes: Array.from(navigator.mimeTypes).map(mimeType => ({
        type: mimeType.type,
        description: mimeType.description
      })),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touchSupport: 'ontouchstart' in window,
      orientation: screen.orientation ? screen.orientation.type : null,
    };

    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        info.battery = {
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
        setDeviceInfo(info);
      });
    } else {
      setDeviceInfo(info);
    }

    return info;
  };

  useEffect(() => {
    getExpandedDeviceInfo();

    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (secretText.trim()) {
      const { data, error } = await supabase.from('messages').insert([{ 
        content: secretText,
        ip_address: userIp,
        is_owner: isOwner(userIp),
        device_info: deviceInfo,
        geo_location: geoLocation
      }]).select();

      if (error) {
        console.error('Error adding secret:', error);
      } else {
        setSecretText('');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700"
    >
      <h2 className="text-2xl font-semibold mb-2 text-white">Tulis Pesanmu </h2><span className='text-gray-400'>(max 275 karakter ya...)</span>
      <form onSubmit={handleSubmit}>
        <textarea 
          className="w-full px-3 py-2 mt-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          rows="4"
          value={secretText}
          onChange={(e) => setSecretText(e.target.value)}
          placeholder="Jangan lupa bismillah dulu..."
          maxLength={275}
          required
        />
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Kirim Pesan
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SecretForm;