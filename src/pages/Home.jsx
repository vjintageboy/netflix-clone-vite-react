import "../index.css";
import bg1 from "../assets/home/1234.webp";
import Navbar from "../components/layout/Navbar.jsx";
import Layer from "../components/hero/Layer.jsx";
import VideoControls from "../components/hero/VideoControls.jsx";
import { useVideoPlayer } from "../components/hero/useVideoPlayer.js";
import MovieSlider from "../components/movie/MovieSlider.jsx";
import Top10MoviesSlider from "../components/movie/Top10MoviesSlider.jsx";  
import PreviewDialog from "../components/movie/PreviewDialog.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function Home() {
  // Video player logic đã được tách ra thành custom hook
  const {
    isReady,
    videoEnded,
    isMuted,
    handleVideoEnd,
    handleVideoLoad,
    toggleMute,
    handleReplay,
  } = useVideoPlayer();

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
            src="/assets/home/smaller-0708.mp4"
            ref={handleVideoLoad}
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
          <Layer {...{ isPlay: isReady && !videoEnded }} />
        </div>

        {/* Video Controls (phải) */}
        <VideoControls
          isReady={isReady}
          videoEnded={videoEnded}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onReplay={handleReplay}
        />
        
        {/* MovieSlider overlay on video - appears at bottom of hero section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-8">
            <MovieSlider />
          </div>
        </div>
      </div>
      
      {/* Additional MovieSliders section - appears after hero section */}
      <div className="bg-black py-8 space-y-12">
        <MovieSlider endpoint="movie/popular" title="Phim Nổi Bật" />
        <MovieSlider endpoint="movie/top_rated" title="Phim Đánh Giá Cao" />
        <MovieSlider endpoint="movie/now_playing" title="Phim Đang Chiếu" />
        <Top10MoviesSlider timeWindow="week" title="Top 10 trending tuần này" />
        <MovieSlider endpoint="movie/upcoming" title="Phim Sắp Chiếu" />
        <MovieSlider endpoint="tv/popular" title="Chương Trình TV Nổi Bật" />
        <MovieSlider endpoint="tv/top_rated" title="Chương Trình TV Đánh Giá Cao" />
        <MovieSlider endpoint="trending/all/week" title="Xu Hướng Tuần Này" />
      </div>

      {/* Footer */}
      <div className="justify-center items-center flex w-full bg-black">
        <Footer />
      </div>
      {/* Preview Dialog - Đặt ở cuối để có z-index cao nhất */}
      <PreviewDialog />
    </>
  );
}
