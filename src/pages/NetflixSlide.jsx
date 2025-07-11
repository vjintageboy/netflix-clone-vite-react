import "../index.css";
import "../App.css";
import { useRef, useState, useEffect } from "react";
import { useDialog } from '../context/DialogContext';

export default function NetflixSlider({ items, title = "Trending" }) {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const { showDialog, hideDialog } = useDialog();

  console.log("NetflixSlider received:", { items: items?.length || 0, title });

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

  const handleMovieClick = (e, item) => {
    e.preventDefault();
    if (isDragging) return;
    window.open(item.link, '_blank');
  };

  if (!items || items.length === 0) {
    return <div className="text-white p-4">Loading movies...</div>;
  }

  return (
    <div className="group relative w-full mt-15 mx-auto flex flex-col items-center" style={{height: '200px'}}>
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
          onMouseLeave={hideDialog}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-60 h-42 rounded-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10 relative"
              onMouseEnter={(e) => showDialog(item, e.currentTarget)}
              onMouseLeave={hideDialog}
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