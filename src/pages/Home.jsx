import "../index.css";
import bg1 from "../assets/home/1234.webp";
import vd1 from "../assets/home/smaller-0708.mp4";
import Navbar from "./Navbar.jsx";
import Layer from "./Layer.jsx";
import MovieSlider from "./MovieSlider.jsx";
import Top10MoviesSlider from "./Top10MoviesSlider.jsx";  
import PreviewDialog from "./PreviewDialog.jsx";
import { useState, useEffect } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setIsReady(false);
  };

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

  return (
    <>

      <Navbar />

      <div className="text-white h-screen flex items-center justify-center w-full relative overflow-hidden">
        {/* Background fallback */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-1000 ${
            isReady && !videoEnded ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${bg1})` }}
        >
          <div className="absolute w-[60%] h-full bg-gradient-to-r from-gray-900/100 to-transparent"></div>
        </div>

        {/* Video layer */}
        {isReady && !videoEnded && (
          <video
            ref={handleVideoLoad}
            src={vd1}
            playsInline
            muted={isMuted}
            preload="auto"
            onEnded={handleVideoEnd}
            onCanPlay={(e) => {
              console.log("Video can play, forcing play...");
              e.target.play().catch((err) => console.log("Play error:", err));
            }}
            onLoadedData={(e) => {
              console.log("Video loaded, trying to play...");
              e.target.play().catch((err) => console.log("Play error:", err));
            }}
            onError={(e) => console.log("Video error:", e)}
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0 animate-fade-in"
            style={{ animation: "fadeIn 1s ease-in-out forwards" }}
          ></video>
        )}

        {/* Layer content (trái) */}
        <div className="absolute top-0 bottom-[35%] left-[4%] w-[36%] z-10 flex flex-col justify-end">
          {/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/}
          <Layer {...{ isPlay: isReady && !videoEnded }} />
          {/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/}
        </div>

        {!isReady && videoEnded && (
          <div className="absolute bottom-[35%] right-0 z-10 flex items-center justify-end pr-8">
            {/* Button-layer (phải) */}
            <button
              aria-label="Phát lại"
              onClick={handleReplay}
              className="bg-transparent border border-white text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(139,133,133,0.4)]"
              type="button"
            >
              <div className="flex items-center justify-center">
                <div
                  className="flex items-center justify-center"
                  role="presentation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.6625 7C18.9328 4.00995 15.7002 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H24C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C16.1752 0 19.8508 2.13204 22 5.36482V2H24V8C24 8.55228 23.5523 9 23 9H17V7H20.6625Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        )}

        {isReady && !videoEnded && (
          <div className="absolute bottom-[35%] right-0 z-10 flex items-center justify-end pr-8">
            {/* Button-layer (phải) */}
            <button
              aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              className="bg-transparent border border-white text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(139,133,133,0.4)]"
              type="button"
              onClick={toggleMute}
            >
              <div className="flex items-center justify-center">
                <div
                  className="flex items-center justify-center"
                  role="presentation"
                >
                  {isMuted ? (
                    // Muted icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    // Unmuted icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* MovieSlider overlay on video - appears at bottom of hero section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-8">
            <MovieSlider />
          </div>
        </div>
      </div>
      
      {/* Additional MovieSliders section - appears after hero section */}
      <div className="bg-black py-8 space-y-12">
        <MovieSlider endpoint="movie/popular" title="Popular Movies" />
        <MovieSlider endpoint="movie/top_rated" title="Top Rated Movies" />
        <MovieSlider endpoint="movie/now_playing" title="Now Playing" />
        <Top10MoviesSlider timeWindow="week" title="Top 10 trending tuần này" />
        <MovieSlider endpoint="movie/upcoming" title="Upcoming Movies" />
        <MovieSlider endpoint="tv/popular" title="Popular TV Shows" />
        <MovieSlider endpoint="tv/top_rated" title="Top Rated TV Shows" />
        <MovieSlider endpoint="trending/all/week" title="Trending This Week" />
      </div>

      {/* Preview Dialog - Đặt ở cuối để có z-index cao nhất */}
      <PreviewDialog />
    </>
  );
}
