import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  
  let videoId = null;
  if (url.includes('youtube.com/watch')) {
    const searchPart = url.split('?')[1];
    if (searchPart) {
      const params = new URLSearchParams(searchPart);
      videoId = params.get('v');
    }
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

const ContentPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlLink = params.get('link');
    const urlTitle = params.get('title');
    const urlType = params.get('type');

    if (!urlLink) {
      navigate('/dashboard');
      return;
    }

    let finalLink = urlLink;
    if (urlLink.includes('youtube.com') || urlLink.includes('youtu.be')) {
      finalLink = getYouTubeEmbedUrl(urlLink);
    } else {
      finalLink = urlLink.replace('/view', '/preview');
    }
    setLink(finalLink);
    setTitle(urlTitle || 'Clinidea Recorded Session');
    setType(urlType || 'video');

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location, navigate]);

  const handleClose = () => {
    try {
      window.close();
    } catch (err) {
      console.error("Failed to close window directly:", err);
    }
    setTimeout(() => {
      navigate('/dashboard');
    }, 150);
  };

  if (!link) return null;

  const isDirectVideo = link.endsWith('.mp4') || link.endsWith('.webm') || link.endsWith('.ogg') || link.includes('/uploads/');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: `${windowHeight}px`, backgroundColor: '#000', zIndex: 9999 }}>
      {/* No overlay buttons, purely video player. User can use device back button to navigate back. */}

      {/* Full Screen Video Container */}
      <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isDirectVideo ? (
          <video 
            src={link.startsWith('http') || link.startsWith('/') ? link : `/${link}`} 
            controls 
            autoPlay 
            style={{ width: '100%', height: '100%', outline: 'none' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div style={{ width: '100%', maxWidth: '100%', maxHeight: '100%', aspectRatio: '16/9', position: 'relative' }}>
            <iframe 
              src={link} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              title={title}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPlayer;
