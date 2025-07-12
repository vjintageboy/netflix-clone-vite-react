import { useState, useEffect } from 'react';

export const useVideoPlayer = () => {
  const [isReady, setIsReady] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState(null);

  // Auto-ready timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true);
    setIsReady(false);
  };

  // Handle video load and auto-play
  const handleVideoLoad = (videoElement) => {
    if (videoElement) {
      setVideoRef(videoElement);
      videoElement.play().catch((error) => {
        console.log("Autoplay failed:", error);
        setTimeout(() => {
          videoElement
            .play()
            .catch((e) => console.log("Retry play failed:", e));
        }, 100);
      });
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !videoRef.muted;
      setIsMuted(videoRef.muted);
    }
  };

  // Replay video when ended
  const handleReplay = () => {
    if (videoRef) {
      videoRef.currentTime = 0;
      setVideoEnded(false);
      setIsReady(true);
    }
  };

  return {
    // States
    isReady,
    videoEnded,
    isMuted,
    videoRef,
    // Handlers
    handleVideoEnd,
    handleVideoLoad,
    toggleMute,
    handleReplay,
  };
};
