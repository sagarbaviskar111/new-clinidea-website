import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const StudentReviewVideos = () => {
  const [videos, setVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetch(`${BASE_URL}/api/review-videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error("Error fetching review videos:", err));
  }, []);

  if (videos.length === 0) return null;

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>Student Review Videos</h2>
        <p className="text-muted">Hear directly from our successful students!</p>
      </div>
      <div className="row g-4">
        {videos.slice(0, visibleCount).map(v => {
          const videoId = getYoutubeVideoId(v.youtubeUrl);
          if (!videoId) return null;
          return (
            <div key={v.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <div style={{ width: '100%', aspectRatio: '9/16' }}>
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title={`${v.studentName}'s Review`} 
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
                <div className="card-body bg-light text-center py-3">
                  <h6 className="fw-bold mb-0 text-dark">{v.studentName}</h6>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {visibleCount < videos.length && (
        <div className="text-center mt-5">
          <button className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm" onClick={handleShowMore}>
            Show More Videos <i className="fa fa-arrow-down ms-2"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentReviewVideos;
