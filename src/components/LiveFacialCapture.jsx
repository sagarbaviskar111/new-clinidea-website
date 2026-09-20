import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

let modelLoadPromise = null;
function ensureModelLoaded() {
  if (!modelLoadPromise) {
    modelLoadPromise = faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  }
  return modelLoadPromise;
}

// Captures a live selfie via the device camera (not a file upload) for identity
// verification. Uses face-api.js (TinyFaceDetector, running fully client-side) to
// confirm a face is actually visible before allowing capture, and re-validates the
// captured frame itself before accepting it.
const LiveFacialCapture = ({ onCapture, capturedUrl, uploading }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    setModelLoading(true);
    ensureModelLoaded()
      .then(() => setModelReady(true))
      .catch(() => setError('Could not load the face-detection model. Please refresh and try again.'))
      .finally(() => setModelLoading(false));
  }, []);

  const stopDetectionLoop = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const stopCamera = () => {
    stopDetectionLoop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
    setFaceDetected(false);
  };

  useEffect(() => () => stopCamera(), []);

  const startDetectionLoop = () => {
    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      const result = await faceapi.detectSingleFace(videoRef.current, DETECTOR_OPTIONS);
      setFaceDetected(!!result);
    }, 400);
  };

  const startCamera = async () => {
    setError(null);
    setWarning(null);

    if (!window.isSecureContext) {
      setError(`Camera access needs a secure connection (HTTPS or localhost). You're on "${window.location.origin}", which the browser blocks. Open the site via http://localhost instead of an IP address, or use HTTPS.`);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support camera capture. Please try the latest Chrome, Edge, or Firefox.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      startDetectionLoop();
    } catch (err) {
      const messages = {
        NotAllowedError: 'Camera permission was denied. Click the camera/lock icon in your browser\'s address bar, allow camera access for this site, then try again.',
        PermissionDeniedError: 'Camera permission was denied. Click the camera/lock icon in your browser\'s address bar, allow camera access for this site, then try again.',
        NotFoundError: 'No camera was found on this device.',
        NotReadableError: 'Your camera is already in use by another application. Close it and try again.',
        OverconstrainedError: 'No camera on this device matches the required settings.'
      };
      setError(messages[err.name] || `Could not access your camera (${err.name || 'unknown error'}: ${err.message || 'no details'}).`);
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setWarning(null);
    setCapturing(true);
    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      // Re-validate the actual captured frame (not just the live feed) before accepting it.
      const result = await faceapi.detectSingleFace(canvas, DETECTOR_OPTIONS);
      if (!result) {
        setWarning('No clear face was detected in that photo. Please face the camera directly, ensure good lighting, and try again.');
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) onCapture(blob);
        stopCamera();
      }, 'image/jpeg', 0.9);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div>
      {error && <p className="text-danger small mb-2">{error}</p>}
      {warning && <p className="text-danger small mb-2"><i className="fa fa-exclamation-triangle me-1"></i>{warning}</p>}

      {capturedUrl && !cameraOn ? (
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <img src={capturedUrl} alt="Captured face" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1.5px solid var(--color-border)' }} />
          <span className="text-success small"><i className="fa fa-check-circle me-1"></i>Face verified</span>
          <button type="button" className="reg-link-btn" onClick={startCamera}>
            <i className="fa fa-camera me-1"></i>Retake Photo
          </button>
        </div>
      ) : cameraOn ? (
        <div>
          <video
            ref={videoRef}
            style={{ width: '100%', maxWidth: 320, borderRadius: 10, background: '#000', border: `2px solid ${faceDetected ? '#22c55e' : '#ef4444'}` }}
            muted playsInline
          />
          <p className={`small mt-2 mb-0 fw-bold ${faceDetected ? 'text-success' : 'text-danger'}`}>
            <i className={`fa ${faceDetected ? 'fa-check-circle' : 'fa-exclamation-circle'} me-1`}></i>
            {faceDetected ? 'Face detected — you can capture now' : 'No face detected — position your face in the frame'}
          </p>
          <div className="mt-2 d-flex gap-2">
            <button
              type="button"
              className="reg-submit-btn"
              style={{ width: 'auto', padding: '0.6rem 1.2rem' }}
              onClick={capturePhoto}
              disabled={!faceDetected || capturing}
            >
              {capturing ? <><span className="spinner-border spinner-border-sm me-2"></span>Verifying...</> : <><i className="fa fa-camera me-1"></i>Capture Photo</>}
            </button>
            <button type="button" className="reg-back-btn" onClick={stopCamera}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" className="reg-back-btn" onClick={startCamera} disabled={uploading || modelLoading || !modelReady}>
          {modelLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Loading face detector...</> : <><i className="fa fa-video me-1"></i>Start Live Facial Verification</>}
        </button>
      )}

      {uploading && <p className="text-muted small mt-2"><span className="spinner-border spinner-border-sm me-1"></span>Uploading...</p>}
      {!modelReady && !modelLoading && !error && <p className="text-muted small mt-1">Face detector not yet ready.</p>}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default LiveFacialCapture;
