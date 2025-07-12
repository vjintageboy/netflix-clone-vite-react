import { useEffect, useState } from "react";
import Top10Slider from "./Top10Slider";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function Top10MoviesSlider() {
  const [top10Items, setTop10Items] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch popular movies from TMDB
    const fetchTop10Movies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=vi-VN&page=1`
        );
        const data = await response.json();
        
        // Take only top 10 movies and format for Top10Slider
        const top10Movies = data.results.slice(0, 10).map((movie, index) => ({
          rank: index + 1,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          link: `https://vidsrc.to/embed/movie/${movie.id}`,
          // Additional movie data
          movieId: movie.id,
          overview: movie.overview,
          releaseDate: movie.release_date,
          rating: movie.vote_average
        }));
        
        setTop10Items(top10Movies);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Top 10:", error);
        setLoading(false);
      }
    };

    fetchTop10Movies();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2">Đang tải Top 10...</span>
      </div>
    );
  }

  return <Top10Slider items={top10Items} title="Top 10 Movies" />;
}
