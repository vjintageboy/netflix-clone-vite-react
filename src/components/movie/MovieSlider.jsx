import { useEffect, useState } from "react";
import NetflixSlider from "./NetflixSlider";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 

export default function MovieSlider({ 
  endpoint = "trending/movie/week", 
  title = "Trending Movies" 
}) {
  const [items, setItems] = useState([]);
  const API_URL = `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&language=vi-VN&page=1`;

  useEffect(() => {
    console.log("Fetching data for:", title, "endpoint:", endpoint);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response for", title, ":", data);
        const movies = data.results.map((movie) => ({
          title: movie.title || movie.name, // name cho TV shows
          image: `https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`,
          link: `https://vidsrc.to/embed/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`,
          rating: movie.vote_average, // Thêm rating từ API
          overview: movie.overview, // Thêm mô tả phim
          releaseDate: movie.release_date || movie.first_air_date, // Thêm ngày phát hành
        }));
        console.log("Processed movies for", title, ":", movies);
        setItems(movies);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy phim cho", title, ":", err);
      });
  }, [API_URL]);

  return (
    <div className="">
      <NetflixSlider items={items} title={title} />
    </div>
  );
};