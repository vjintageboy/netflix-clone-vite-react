# Hướng dẫn Setup API tìm kiếm phim

## 1. Đăng ký TMDb API Key

1. Truy cập: https://www.themoviedb.org/
2. Tạo tài khoản và đăng nhập
3. Đi tới Settings > API
4. Tạo API Key (v3 auth)
5. Copy API Key

## 2. Cấu hình API Key

1. Mở file `.env` trong thư mục root
2. Thay thế `your_api_key_here` bằng API key thực tế:
   ```
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

## 3. Tính năng đã implement

- **Real-time search**: Tìm kiếm tự động khi gõ (debounced 500ms)
- **Multi-search**: Tìm kiếm cả phim (Movie) và series (TV)
- **Dropdown kết quả**: Hiển thị tối đa 8 kết quả với giao diện lớn hơn
- **Thông tin chi tiết**: Poster lớn, tên, năm phát hành, rating, mô tả
- **Loading state**: Hiển thị loading spinner khi tìm kiếm
- **Click to watch**: Nhấn vào phim để xem ngay trên vidsrc.to
- **Responsive design**: Tương thích mobile và desktop với kích thước tối ưu
- **Component tách biệt**: SearchBox được tách thành component riêng trong layout
- **Enhanced UI**: Giao diện search box lớn hơn, dễ nhìn và sử dụng hơn
- **Improved UX**: Placeholder text rõ ràng, icons lớn hơn, spacing tối ưu
- **Clean Code**: VideoControls được tách thành component riêng để Home.jsx sạch hơn
- **Custom Hook**: useVideoPlayer hook tách toàn bộ logic video ra khỏi component
- **Separation of Concerns**: Logic và UI được tách biệt hoàn toàn

## 4. Cấu trúc code

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx           # Navigation bar với search
│   │   ├── Footer.jsx           # Footer component
│   │   └── SearchBox.jsx        # Component tìm kiếm độc lập
│   ├── hero/
│   │   ├── Layer.jsx            # Hero section content
│   │   ├── VideoControls.jsx    # Video control buttons (mute/replay)
│   │   └── useVideoPlayer.js    # Custom hook cho video logic
│   ├── movie/
│   │   ├── MovieSlider.jsx      # Container cho movie sliders
│   │   ├── NetflixSlider.jsx    # Netflix-style slider
│   │   ├── Top10MoviesSlider.jsx # Top 10 movies container
│   │   ├── Top10Slider.jsx      # Top 10 slider component
│   │   └── PreviewDialog.jsx    # Movie preview dialog
│   └── index.js                 # Export tất cả components
├── pages/
│   ├── Home.jsx                 # Trang chủ chính (đã được làm sạch hoàn toàn)
│   └── AfterLogin.jsx           # Trang sau khi đăng nhập
├── context/
│   └── DialogContext.jsx        # Context cho preview dialog
└── ...
```

## 5. Cách sử dụng

1. Nhấn vào icon tìm kiếm trong navbar
2. Gõ tên phim, diễn viên, hoặc thể loại
3. Xem kết quả hiển thị trong dropdown
4. Nhấn vào phim để xem ngay trên vidsrc.to (mở tab mới)

## 6. Có thể mở rộng thêm

- Tìm kiếm theo thể loại
- Tìm kiếm diễn viên
- Lưu lịch sử tìm kiếm
- Tìm kiếm nâng cao với filters
- Tích hợp với routing để chuyển trang chi tiết phim
- Thêm bookmark/watchlist
- Tích hợp với các streaming service khác
