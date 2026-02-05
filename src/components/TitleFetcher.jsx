// components/TitleFetcher.jsx
import React, { useState, useEffect } from 'react';

const TitleFetcher = ({ url, courseName, sectionName }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaId, setMediaId] = useState('');

  // Extract media ID from URL
  useEffect(() => {
    const extractMediaId = (url) => {
      const patterns = [
        /\/medias\/([^/.]+)/,
        /\/embed\/iframe\/([^?]+)/,
        /wistia\.com\/medias\/([^/.]+)/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
      return null;
    };

    const mediaId = extractMediaId(url);
    if (mediaId) {
      setMediaId(mediaId);
      fetchTitle(mediaId);
    }
  }, [url]);

  const fetchTitle = async (mediaId) => {
    if (!mediaId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/get-title/${mediaId}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
      }
    } catch (error) {
      console.error('Error fetching title:', error);
      setTitle(`Lecture ${mediaId.substring(0, 8)}...`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <span className="loading-title">Loading title...</span>;
  }

  return (
    <span className="video-title">
      {title || `Video ${mediaId.substring(0, 8)}...`}
    </span>
  );
};

export default TitleFetcher;