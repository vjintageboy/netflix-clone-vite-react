import "../index.css";
import "../App.css";
import { useRef, useState, useEffect } from "react";

export default function NetflixSlider({ items, title={title} }) {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  // Add for pagination logic
  const [activeIndex, setActiveIndex] = useState(0);
  const [numPages, setNumPages] = useState(0);
  // Dialog preview state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  // const hoveredCardRef = useRef(null); // Không cần nữa
  const [dialogHovered, setDialogHovered] = useState(false);

  // Calculate number of pages
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const calculatePages = () => {
      const pages = Math.ceil(slider.scrollWidth / slider.clientWidth);
      setNumPages(pages > 1 ? pages : 0);
    };
    calculatePages();
    const resizeObserver = new window.ResizeObserver(calculatePages);
    resizeObserver.observe(slider);
    return () => resizeObserver.disconnect();
  }, [items]);

  // Update active dot on scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || numPages === 0) return;
    const handleScroll = () => {
      const scrollPos = slider.scrollLeft;
      const slideWidth = slider.clientWidth;
      if (slider.scrollWidth - scrollPos - slideWidth < 1) {
        setActiveIndex(numPages - 1);
      } else {
        setActiveIndex(Math.round(scrollPos / slideWidth));
      }
    };
    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [numPages]);

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging || !sliderRef.current) return;
      e.preventDefault();
      const x = e.pageX - sliderRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  const scrollNext = () => {
    if (sliderRef.current && activeIndex < numPages - 1) {
      sliderRef.current.scrollBy({ left: sliderRef.current.clientWidth, behavior: "smooth" });
    }
  };
  
  const scrollPrev = () => {
    if (sliderRef.current && activeIndex > 0) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.clientWidth, behavior: "smooth" });
    }
  };

  // Mouse drag functions
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle movie click
  const handleMovieClick = (e, item) => {
    e.preventDefault();
    if (isDragging) return;
    // Direct navigation to movie
    window.open(item.link, '_blank');
  };

  // Handle movie hover
  const handleMovieHover = (item, index) => {
    if (isDragging) return;
    // Clear any existing timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    // Set timer for showing dialog after 300ms
    const timer = setTimeout(() => {
      setSelectedMovie(item);
      setHoveredIndex(index);
      setShowDialog(true);
    }, 300);
    setHoverTimer(timer);
  };

  // Handle mouse leave
  const handleMouseLeave = (index) => {
    // Clear hover timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    // Delay close, chỉ đóng nếu chuột không ở dialog và vẫn là card này
    const closeTimer = setTimeout(() => {
      if (!dialogHovered && hoveredIndex === index) {
        setShowDialog(false);
        setSelectedMovie(null);
        setHoveredIndex(null);
      }
    }, 100);
    setHoverTimer(closeTimer);
  };

  // Close dialog
  const closeDialog = () => {
    setShowDialog(false);
    setSelectedMovie(null);
    setHoveredIndex(null);
    setDialogHovered(false);
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };
  // Không cần effect cập nhật vị trí dialog nữa



  if (!items || items.length === 0) {
    return <div className="text-white p-4">Loading movies...</div>;
  }

  return (
    <div className="group relative w-full mt-15 mx-auto flex flex-col items-center" style={{height: '200px'}}>
      {/* Dialog sẽ được render trong từng card bên dưới */}

      {/* Pagination dots - Netflix style */}
      {numPages > 0 && (
        <ul
          className="absolute top-1 right-14 list-none p-0 flex gap-1 z-10"
          style={{
            margin: '-20px 0 12px',
          }}
        >
          {Array.from({ length: numPages }).map((_, index) => (
            <li
              key={index}
              className={`w-2 h-0.5 transition-colors duration-300 ${index === activeIndex ? "bg-white" : "bg-neutral-500"}`}
            ></li>
          ))}
        </ul>
      )}
      <div className="absolute top-0 left-16 p-0 z-11 text-[1.4vw] font-black text-white" style={{ margin: '-30px 0 12px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontWeight: '900' }}>
       {title}
      </div>

      {/* Outer wrapper for buttons and slider */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Prev button - Netflix style */}
        <button
          onClick={scrollPrev}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-14 h-42 bg-black/40 text-white flex justify-center items-center z-20 transition-opacity duration-300 hover:bg-black/60 ${
            activeIndex === 0 || numPages === 0 
              ? 'opacity-0 cursor-not-allowed' 
              : 'opacity-0 group-hover:opacity-100 cursor-pointer'
          }`}
          aria-label="Video trước"
          disabled={activeIndex === 0 || numPages === 0}
        >
          <span className="text-4xl font-light">&#8249;</span>
        </button>

        {/* The main scrolling container */}
        <div
          ref={sliderRef}
          className="flex space-x-3 overflow-x-auto overflow-y-hidden scroll-smooth select-none px-16 py-4 w-full netflix-slider-hide-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-60 h-42 rounded-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10 relative"
              onMouseEnter={() => handleMovieHover(item, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <a 
                href={item.link} 
                aria-label={item.title}
                onClick={(e) => handleMovieClick(e, item)}
                className="block w-full h-full cursor-pointer"
              >
                <div className="absolute top-0 left-0 text-white text-xs font-bold px-2 py-1 rounded z-10">
                 <img src="/netflix-logo-icon.svg" alt="Netflix Logo" className="h-5" />
                </div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Movie info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-white text-sm font-bold truncate">{item.title}</h3>
                  {item.rating && (
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400 text-xs">IMDb</span>
                      <span className="text-white text-xs ml-1">{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </a>
              {/* Dialog preview nằm trong card */}
              {showDialog && selectedMovie && (hoveredIndex === index || dialogHovered) && (
                <div
                  className="absolute z-50 bg-gray-900 rounded-lg w-80 shadow-2xl border border-gray-700 pointer-events-auto transition-all duration-200 ease-out"
                  style={{
                    top: '-10px',
                    left: '50%',
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'auto',
                    animation: 'fadeIn 0.2s ease-in-out'
                  }}
                  onMouseEnter={() => {
                    setDialogHovered(true);
                    setHoveredIndex(index);
                    if (hoverTimer) {
                      clearTimeout(hoverTimer);
                      setHoverTimer(null);
                    }
                  }}
                  onMouseLeave={() => {
                    setDialogHovered(false);
                    closeDialog();
                  }}
                >
                  {/* Movie image - Compact header */}
                  <div className="relative h-40">
                    <img
                      src={selectedMovie.image}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-lg"></div>
                    {/* Movie title overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h2 className="text-lg font-bold text-white mb-1">{selectedMovie.title}</h2>
                      {selectedMovie.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-white text-xs ml-1 font-semibold">{selectedMovie.rating.toFixed(1)}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Movie details */}
                  <div className="p-3">
                    {/* Action buttons */}
                    <div className="flex gap-2 mb-3">
                      <a
                        href={selectedMovie.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-3 py-1.5 rounded-md font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1 text-xs"
                      >
                        <span>▶</span> Xem ngay
                      </a>
                      <button className="bg-gray-700 text-white px-3 py-1.5 rounded-md font-semibold hover:bg-gray-600 transition-colors text-xs">
                        + Danh sách
                      </button>
                    </div>
                    {/* Movie info */}
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-white font-semibold text-xs mb-1">Thông tin</h3>
                        <div className="text-gray-300 text-xs space-y-1">
                          {selectedMovie.releaseDate && (
                            <p><span className="text-white font-medium">Năm:</span> {new Date(selectedMovie.releaseDate).getFullYear()}</p>
                          )}
                          {selectedMovie.rating && (
                            <p><span className="text-white font-medium">IMDb:</span> {selectedMovie.rating.toFixed(1)}/10</p>
                          )}
                        </div>
                      </div>
                      {selectedMovie.overview && (
                        <div>
                          <h3 className="text-white font-semibold text-xs mb-1">Mô tả</h3>
                          <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{selectedMovie.overview}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next button - Netflix style */}
        <button
          onClick={scrollNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-14 h-42 bg-black/40 text-white flex justify-center items-center z-20 transition-opacity duration-300 hover:bg-black/60 ${
            activeIndex === numPages - 1 || numPages === 0 
              ? 'opacity-0 cursor-not-allowed' 
              : 'opacity-0 group-hover:opacity-100 cursor-pointer'
          }`}
          aria-label="Xem video khác"
          disabled={activeIndex === numPages - 1 || numPages === 0}
        >
          <span className="text-4xl font-light">&#8250;</span>
        </button>
      </div>
    </div>
  );
}