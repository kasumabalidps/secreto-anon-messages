import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getUserIp, isOwner } from '../utils';

const CommentForm = ({ secretId }) => {
  const [commentText, setCommentText] = useState('');
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
    if (commentText.trim()) {
      const userIp = await getUserIp();
      const { data, error } = await supabase.from('replies').insert([
        { 
          message_id: secretId, 
          content: commentText,
          ip_address: userIp,
          is_owner: isOwner(userIp),
          device_info: deviceInfo,
          geo_location: geoLocation
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