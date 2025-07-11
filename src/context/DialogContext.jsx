import React, { createContext, useState, useRef, useContext, useCallback, useEffect } from 'react';

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [cardElement, setCardElement] = useState(null);
  const hoverTimerRef = useRef(null);
  const dialogHoverRef = useRef(false);

  // Update dialog position when scrolling
  useEffect(() => {
    if (!selectedItem || !cardElement) return;

    const updatePosition = () => {
      const cardRect = cardElement.getBoundingClientRect();
      const newPosition = {
        top: cardRect.top + cardRect.height / 2, // Center theo chiều dọc của card
        left: cardRect.left + cardRect.width / 2, // Center theo chiều ngang của card
      };
      setPosition(newPosition);
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [selectedItem, cardElement]);

  const showDialog = useCallback((item, cardElement) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      const cardRect = cardElement.getBoundingClientRect();
      // Tính toán vị trí chính xác - dialog xuất hiện center trên card
      const newPosition = {
        top: cardRect.top + cardRect.height / 2, // Center theo chiều dọc của card
        left: cardRect.left + cardRect.width / 2, // Center theo chiều ngang của card
      };
      console.log('Dialog position:', newPosition, 'Element rect:', cardRect, 'Card size:', {width: cardRect.width, height: cardRect.height});
      setPosition(newPosition);
      setCardElement(cardElement);
      setSelectedItem(item);
    }, 600); // Giảm delay để responsive hơn
  }, []);

  const hideDialog = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setTimeout(() => {
      if (!dialogHoverRef.current) {
        setSelectedItem(null);
        setCardElement(null);
      }
    }, 100);
  }, []);

  const value = {
    selectedItem,
    position,
    showDialog,
    hideDialog,
    dialogHoverRef,
    setSelectedItem,
    cardElement,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
