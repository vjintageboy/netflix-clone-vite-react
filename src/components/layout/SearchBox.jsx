import { useState, useEffect } from 'react';

export default function SearchBox() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // TMDb API Key - lấy từ environment variable
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    // Function để search phim từ API
    const searchMovies = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        
        setIsLoading(true);
        try {
            // Tìm kiếm cả phim và TV show
            const [movieResponse, tvResponse] = await Promise.all([
                fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=vi-VN`),
                fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=vi-VN`)
            ]);
            
            const movieData = await movieResponse.json();
            const tvData = await tvResponse.json();
            
            // Thêm media_type cho mỗi kết quả
            const movies = (movieData.results || []).map(item => ({ ...item, media_type: 'movie' }));
            const tvShows = (tvData.results || []).map(item => ({ ...item, media_type: 'tv', title: item.name }));
            
            // Kết hợp và sắp xếp theo popularity
            const allResults = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
            
            setSearchResults(allResults);
        } catch (error) {
            console.error('Error searching movies:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search để tránh gọi API quá nhiều
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery && isSearchOpen) {
                searchMovies(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, isSearchOpen]);

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchMovies(searchQuery);
        }
    };

    const handleMovieClick = (movie) => {
        // Tạo URL để xem phim trên vidsrc.to
        const movieUrl = `https://vidsrc.to/embed/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`;
        
        // Mở trong tab mới
        window.open(movieUrl, '_blank');
        
        // Đóng dropdown search
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.search-container')) {
            setIsSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    useEffect(() => {
        if (isSearchOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSearchOpen]);

    return (
        <div className="search-container relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className={`flex items-center transition-all duration-300 ${
                    isSearchOpen ? 'bg-black border border-white' : 'bg-transparent'
                }`}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Phim, diễn viên, thể loại..."
                        className={`bg-transparent text-white placeholder-gray-400 outline-none focus:outline-none focus:ring-0 transition-all duration-300 ${
                            isSearchOpen ? 'w-60 px-3 py-2' : 'w-0 px-0'
                        }`}
                        style={{
                            opacity: isSearchOpen ? 1 : 0,
                        }}
                    />
                    <button 
                        type="button"
                        onClick={handleSearchToggle}
                        className="hover:opacity-80 transition-opacity !bg-transparent !pr-3 !border-none flex items-center justify-center focus:outline-none focus:ring-0"
                        style={{ outline: 'none', border: 'none' }}
                        aria-label="Tìm kiếm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="text-white"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"
                            ></path>
                        </svg>
                    </button>
                </div>
            </form>
            
            {/* Search Results Dropdown */}
            {isSearchOpen && (searchResults.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-600 rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50 w-[400px]">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
                            <p className="text-sm">Đang tìm kiếm...</p>
                        </div>
                    ) : (
                        <div className="py-3">
                            {searchResults.slice(0, 8).map((movie) => (
                                <div 
                                    key={movie.id} 
                                    className="px-5 py-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
                                    onClick={() => handleMovieClick(movie)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <img 
                                            src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder-movie.jpg'} 
                                            alt={movie.title}
                                            className="w-16 h-20 object-cover rounded-md shadow-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="text-white font-semibold text-base hover:text-blue-400 transition-colors">{movie.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${movie.media_type === 'tv' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                                                    {movie.media_type === 'tv' ? 'TV' : 'Movie'}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-1">{movie.release_date ? new Date(movie.release_date).getFullYear() : (movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A')}</p>
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-2 leading-relaxed">{movie.overview}</p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-yellow-400 text-sm">⭐</span>
                                                <span className="text-gray-300 text-sm font-medium">{movie.vote_average?.toFixed(1)}</span>
                                            </div>
                                            <div className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium">
                                                ▶ Xem ngay
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
