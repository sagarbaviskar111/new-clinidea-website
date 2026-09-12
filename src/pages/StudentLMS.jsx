import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

function StudentLMS() {
  const [contents, setContents] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [userContext, setUserContext] = useState({ fullName: '' });
  const navigate = useNavigate();

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch profile to get student's real full name
      try {
        const profileUrl = `${BASE_URL}/api/student/profile`;
        const pRes = await fetch(profileUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.profile && pData.profile.user) {
            setUserContext(pData.profile.user);
          }
        }
      } catch (err) {
        console.error("Failed to fetch student profile", err);
      }

      const res = await fetch(`${BASE_URL}/api/student/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.contents)) {
          setContents(data.contents);
          setEnrolledBatches(data.enrolledBatches || []);
        } else if (Array.isArray(data)) {
          setContents(data);
        }
      } else {
        console.error("Failed to fetch LMS content");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Group content by Module Name -> Category
  const groupedContent = contents.reduce((acc, curr) => {
    const mod = curr.moduleName || 'General';
    if (!acc[mod]) acc[mod] = {};
    
    let cat = curr.category;
    if (cat === 'PPTs') cat = 'Presentations'; // handle any old data
    if (!cat) {
      if (curr.contentType === 'video') cat = 'Recorded Sessions';
      else if (curr.contentType === 'ppt') cat = 'Presentations';
      else cat = 'Additional Study Material';
    }
    
    if (!acc[mod][cat]) acc[mod][cat] = [];
    
    acc[mod][cat].push(curr);
    return acc;
  }, {});

  const getIcon = (type) => {
    switch(type) {
      case 'video': return 'fa-video text-danger';
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'ppt': return 'fa-file-powerpoint text-warning';
      default: return 'fa-file-alt text-primary';
    }
  };

  const getCategoryIcon = (category) => {
    if (category === 'Recorded Sessions') return 'fa-play-circle text-danger';
    if (category === 'Presentations') return 'fa-desktop text-warning';
    return 'fa-book text-primary';
  };

  const Thumbnail = ({ item, active }) => {
    const [imgError, setImgError] = React.useState(false);
    if (imgError || !item.driveFileId) {
      return (
        <div className={`d-flex justify-content-center align-items-center rounded ${active ? 'bg-light bg-opacity-25' : 'bg-light'}`} style={{ width: '60px', height: '45px', flexShrink: 0 }}>
          <i className={`fa ${getIcon(item.contentType)} ${active ? 'text-white' : ''}`}></i>
        </div>
      );
    }
    return (
      <img loading="lazy" src={`https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w200`} 
        onError={() => setImgError(true)}
        className="rounded shadow-sm" 
        style={{ width: '60px', height: '45px', objectFit: 'cover', flexShrink: 0, border: active ? '2px solid white' : '1px solid var(--color-border)' }} 
        alt="thumb" 
      />
    );
  };

  return (
    <div className="container-fluid py-4 py-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 px-lg-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Learning Management System</h2>
          <p className="text-muted mb-0">Access your course materials, recorded sessions, and presentations.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {enrolledBatches.map(batch => (
            <a 
              key={batch.id} 
              href={`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${batch.id}_General#userInfo.displayName="${encodeURIComponent(userContext.fullName || 'Student')}"&config.prejoinPageEnabled=false`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-danger fw-semibold px-4 py-2 shadow-sm rounded-pill d-flex align-items-center gap-2 text-decoration-none" 
              style={{ transition: 'all 0.3s' }}
            >
              <i className="fa fa-video"></i> Join Live Class: {batch.name}
            </a>
          ))}
          <Link to="/dashboard" className="btn btn-white border fw-semibold px-4 py-2 shadow-sm rounded-pill d-flex align-items-center gap-2 hover-bg-light" style={{ color: '#334155' }}>
            <i className="fa fa-arrow-left"></i> Dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      ) : contents.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center py-5 mx-lg-3">
          <div className="card-body py-5">
            <div className="mb-4"><i className="fa fa-folder-open text-muted opacity-25" style={{ fontSize: '5rem' }}></i></div>
            <h3 className="fw-bold text-dark mb-3">No Content Available</h3>
            <p className="text-muted fs-5 mb-0">You are either not enrolled in any batches, or your mentors haven't uploaded any content yet.</p>
          </div>
        </div>
      ) : (
        <div className="row px-lg-3">
          
          {/* Content Viewer / Player (Order 1 on mobile if active, Order 1 on Desktop always) */}
          <div className={`col-lg-8 mb-4 order-1 order-lg-1 ${!activeVideo ? 'd-none d-lg-block' : ''}`}>
            {activeVideo ? (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: 'all 0.3s' }}>
                {/* Video Player Area */}
                <div 
                  id="content-viewer-container" 
                  className="position-relative w-100 rounded-bottom-4" 
                  style={{ 
                    width: '100%',
                    height: activeVideo.contentType === 'video' ? 'auto' : '70vh', 
                    aspectRatio: activeVideo.contentType === 'video' ? '16/9' : 'auto', 
                    backgroundColor: '#000', 
                    overflow: 'hidden',
                    border: '1px solid #1e293b',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                  }}
                >
                  {(() => {
                    const link = activeVideo.driveWebViewLink || activeVideo.localFileUrl;
                    if (!link) {
                      return (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white-50">
                          <i className="fa fa-exclamation-circle mb-2" style={{ fontSize: '2rem' }}></i>
                          <p>Content link unavailable</p>
                        </div>
                      );
                    }
                    const isDirectVideo = link.endsWith('.mp4') || link.endsWith('.webm') || link.endsWith('.ogg') || link.includes('/uploads/') || link.includes('cloudinary');
                    
                    if (activeVideo.contentType === 'video') {
                      return isDirectVideo ? (
                        <video 
                          src={link.startsWith('http') || link.startsWith('/') ? link : `/${link}`} 
                          controls 
                          controlsList="nodownload"
                          onContextMenu={e => e.preventDefault()}
                          autoPlay 
                          style={{ width: '100%', height: '100%', outline: 'none' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#0f172a', color: '#fff', position: 'absolute', inset: 0 }}>
                          {activeVideo.driveFileId && (
                            <img src={`https://drive.google.com/thumbnail?id=${activeVideo.driveFileId}&sz=w800`} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} alt="thumbnail" />
                          )}
                          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px' }}>
                            <i className="fa fa-play-circle mb-3" style={{ fontSize: '5rem', color: '#fff', cursor: 'pointer', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} onClick={() => window.open(link, '_blank')}></i>
                            <h4 className="fw-bold mb-3">{activeVideo.title}</h4>
                            <button className="btn btn-danger btn-lg px-4 rounded-pill fw-bold shadow-lg d-flex align-items-center mx-auto" onClick={() => window.open(link, '_blank')} style={{ gap: '8px' }}>
                              <i className="fa fa-external-link-alt"></i> Play Video Natively
                            </button>
                            <p className="text-white-50 mt-3 small max-w-sm mx-auto">Click to open directly in the native player for the best fullscreen experience and perfect controls.</p>
                          </div>
                        </div>
                      );
                    } else {
                      // For PDFs, PPTs, etc. use the iframe
                      const iframeSrc = link.includes('drive.google.com') ? link.replace('/view', '/preview') : (link.startsWith('http') || link.startsWith('/') ? link : `/${link}`);
                      return (
                        <iframe 
                          src={iframeSrc} 
                          width="100%" 
                          height="100%" 
                          frameBorder="0"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          webkitallowfullscreen="true"
                          mozallowfullscreen="true"
                          style={{ border: 'none', backgroundColor: '#000' }}
                          title={activeVideo.title}
                        ></iframe>
                      );
                    }
                  })()}
                  {/* Transparent overlay over the top right to block any remaining click targets */}
                  {(() => {
                    const link = activeVideo.driveWebViewLink || activeVideo.localFileUrl;
                    const isDirectVideo = link && (link.endsWith('.mp4') || link.endsWith('.webm') || link.endsWith('.ogg') || link.includes('/uploads/') || link.includes('cloudinary'));
                    if (!isDirectVideo) {
                      return <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '60px', zIndex: 10 }}></div>;
                    }
                    return null;
                  })()}
                </div>

                {/* Video Details Area */}
                <div className="card-body p-4 bg-white">
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div className="flex-grow-1">
                      <div className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill fw-semibold">
                        <i className={`fa ${getCategoryIcon(activeVideo.category || 'Recorded Sessions')} me-2`}></i>
                        {(activeVideo.category || 'Content').toUpperCase()}
                      </div>
                      <h3 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>{activeVideo.title}</h3>
                      <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{activeVideo.description || 'No description provided for this content.'}</p>
                    </div>
                    
                    <div className="d-flex gap-2 shrink-0">
                      <button 
                        className="btn btn-light border fw-semibold px-3 py-2 rounded-3 hover-shadow d-none d-md-flex align-items-center"
                        title="Maximize Player"
                        onClick={() => {
                          const elem = document.getElementById('content-viewer-container');
                          if (elem) {
                            if (elem.requestFullscreen) elem.requestFullscreen();
                            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
                            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
                          }
                        }}
                      >
                        <i className="fa fa-expand me-2"></i> Fullscreen
                      </button>
                      <button 
                        className="btn btn-danger bg-opacity-10 text-danger border-0 fw-semibold px-3 py-2 rounded-3 d-lg-none"
                        onClick={() => {
                          setActiveVideo(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <i className="fa fa-times me-2"></i> Close Video
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column justify-content-center align-items-center text-center p-5" style={{ minHeight: '60vh', backgroundColor: '#fff' }}>
                <div className="rounded-circle bg-light d-flex justify-content-center align-items-center mb-4" style={{ width: '120px', height: '120px' }}>
                  <i className="fa fa-play-circle text-primary opacity-50" style={{ fontSize: '4rem' }}></i>
                </div>
                <h3 className="fw-bold text-dark mb-2">Select Content to View</h3>
                <p className="text-muted fs-5 max-w-md">Choose a module and category from the course content list to start your learning journey.</p>
              </div>
            )}
          </div>

          {/* Module List Sidebar (Order 2 on mobile if active, Order 2 on Desktop always) */}
          <div className="col-lg-4 mb-4 order-2 order-lg-2">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column" style={{ maxHeight: 'calc(100vh - 130px)', backgroundColor: '#fff' }}>
              
              <div className="card-header bg-white border-bottom py-4 px-4 sticky-top z-1">
                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center">
                  <i className="fa fa-list-ul text-primary me-3 bg-primary bg-opacity-10 p-2 rounded"></i> 
                  Course Curriculum
                </h5>
              </div>

              <div className="card-body p-0 overflow-auto custom-scrollbar">
                <div className="accordion accordion-flush" id="moduleAccordion">
                  {Object.keys(groupedContent).map((moduleName, index) => (
                    <div className="accordion-item border-bottom" key={`mod-${index}`}>
                      <h2 className="accordion-header">
                        <button 
                          className={`accordion-button ${index !== 0 ? 'collapsed' : ''} bg-white px-4 py-3`} 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#collapse${index}`} 
                          style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.05rem', boxShadow: 'none' }}
                        >
                          <span className="d-flex align-items-center gap-2">
                            <i className="fa fa-folder text-warning fs-5"></i> {moduleName}
                          </span>
                        </button>
                      </h2>
                      <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#moduleAccordion">
                        <div className="accordion-body p-0" style={{ backgroundColor: '#f8fafc' }}>
                          
                          {/* Nested Categories */}
                          {['Recorded Sessions', 'Presentations', 'Additional Study Material'].map((category, catIndex) => {
                            const items = groupedContent[moduleName][category];
                            if (!items || items.length === 0) return null;

                            return (
                              <div className="mb-0" key={`cat-${index}-${catIndex}`}>
                                <div className="px-4 py-2 bg-light border-top border-bottom text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                  <i className={`fa ${getCategoryIcon(category)} me-2`}></i> {category}
                                </div>
                                <div className="list-group list-group-flush">
                                  {items.map(item => {
                                    const isActive = activeVideo?.id === item.id;
                                    return (
                                      <button 
                                        key={item.id} 
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-3 transition-all ${isActive ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                                        onClick={() => {
                                          setActiveVideo(item);
                                          if (window.innerWidth < 992) {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }
                                        }}
                                        style={{ borderLeft: isActive ? '4px solid var(--color-primary) !important' : '4px solid transparent !important' }}
                                      >
                                        <Thumbnail item={item} active={isActive} />
                                        <div className="text-start flex-grow-1 min-w-0">
                                          <span className={`d-block text-truncate fw-semibold mb-1 ${isActive ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                                            {item.title}
                                          </span>
                                          <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.75rem' }}>
                                            <span className="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill px-2 py-1">
                                              {item.contentType.toUpperCase()}
                                            </span>
                                            {isActive && <span className="text-primary fw-medium"><i className="fa fa-play me-1"></i> Playing</span>}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-shadow:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .transition-all { transition: all 0.2s ease-in-out; }
        .min-w-0 { min-width: 0; }
        .list-group-item.active { border-color: transparent; }
      `}} />
    </div>
  );
}

export default StudentLMS;
