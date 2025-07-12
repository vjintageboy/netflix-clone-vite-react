import { useDialog } from '../../context/DialogContext';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function PreviewDialog() {
  const { selectedItem, position, dialogHoverRef, setSelectedItem } = useDialog();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedItem]);

  if (!selectedItem) {
    return null;
  }

  const handleMouseEnter = () => {
    dialogHoverRef.current = true;
  };

  const handleMouseLeave = () => {
    dialogHoverRef.current = false;
    setSelectedItem(null);
  };

  // Tính toán vị trí dialog để center trên card
  const dialogWidth = 320; // 320px = w-80
  const dialogHeight = 340; // Ước tính chiều cao dialog
  const offset = 10; // Khoảng cách từ cạnh màn hình

  // Tính toán vị trí dialog - center trên card
  let calculatedTop = position.top - dialogHeight / 2; // Center theo chiều dọc
  let calculatedLeft = position.left - dialogWidth / 2; // Center theo chiều ngang

  // Đảm bảo dialog không bị che khuất bởi cạnh màn hình
  if (calculatedTop < offset) {
    calculatedTop = offset; // Không để dialog ra ngoài cạnh trên
  }
  if (calculatedTop + dialogHeight > windowSize.height - offset) {
    calculatedTop = windowSize.height - dialogHeight - offset; // Không để dialog ra ngoài cạnh dưới
  }
  if (calculatedLeft < offset) {
    calculatedLeft = offset; // Không để dialog ra ngoài cạnh trái
  }
  if (calculatedLeft + dialogWidth > windowSize.width - offset) {
    calculatedLeft = windowSize.width - dialogWidth - offset; // Không để dialog ra ngoài cạnh phải
  }

  console.log('Dialog rendering at:', { calculatedTop, calculatedLeft, originalPosition: position, windowSize });

  return createPortal(
    <>
      {/* Debug dot - hiển thị vị trí gốc */}
      {/* <div
        className="fixed w-2 h-2 bg-red-500 rounded-full z-[10000] pointer-events-none"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translate(-50%, -50%)',
        }}
      /> */}
      
      {/* Dialog */}
      <div
        className={`fixed z-[9999] bg-gray-900 rounded-lg w-80 shadow-2xl border border-gray-700 pointer-events-auto overflow-hidden ${
          isVisible ? 'dialog-fade-in' : 'dialog-fade-out'
        }`}
        style={{
          top: `${calculatedTop}px`,
          left: `${calculatedLeft}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      <div className="relative h-40">
        <img
          src={selectedItem.image}
          alt={selectedItem.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-lg"></div>
        <div className="absolute bottom-2 left-2 right-2">
          <h2 className="text-lg font-bold text-white mb-1">{selectedItem.title}</h2>
          {selectedItem.rating && (
            <div className="flex items-center">
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-white text-xs ml-1 font-semibold">{selectedItem.rating.toFixed(1)}/10</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex gap-2 mb-3">
          <a
            href={selectedItem.link}
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
        <div className="space-y-2">
          <div>
            <h3 className="text-white font-semibold text-xs mb-1">Thông tin</h3>
            <div className="text-gray-300 text-xs space-y-1">
              {selectedItem.releaseDate && (
                <p><span className="text-white font-medium">Năm:</span> {new Date(selectedItem.releaseDate).getFullYear()}</p>
              )}
              {selectedItem.rating && (
                <p><span className="text-white font-medium">IMDb:</span> {selectedItem.rating.toFixed(1)}/10</p>
              )}
            </div>
          </div>
          {selectedItem.overview && (
            <div>
              <h3 className="text-white font-semibold text-xs mb-1">Mô tả</h3>
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{selectedItem.overview}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>,
    document.body
  );
}
