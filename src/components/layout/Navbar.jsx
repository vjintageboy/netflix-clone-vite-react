import { useEffect, useState } from 'react';
import bg5 from "../../assets/profile/profile5.jpeg"
import { faBorderNone } from '@fortawesome/free-solid-svg-icons';
import SearchBox from './SearchBox';
import icon from "../../assets/home/caret_icon.svg"

// CSS để loại bỏ outline cho tất cả button
const buttonStyles = `
  button:focus,
  button:active,
  button:focus-visible {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications, setNotifications] = useState(3); 

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Inject CSS to remove button outlines
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = buttonStyles;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <header
            className={`
        fixed top-0 w-full z-50 transition-colors duration-500
        ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/70 to-transparent'}
      `}
        >
            <div className="flex items-center justify-between h-[68px] px-[4%] text-white">
                {/* Left side - Logo and Navigation */}
                <nav className="flex items-center gap-6 text-sm">
                    <a href="/" className="text-[#e50914] cursor-pointer inline-block text-[1.8em] mr-[5px] align-middle no-underline">
                        <img src="/netflix-3.svg" alt="Netflix Logo" className="h-6" />
                    </a>
                    <div className="hidden md:flex gap-6">
                        <a href="#" className='!text-white hover:text-gray-300'>Trang chủ</a>
                        <a href="#" className='!text-white hover:text-gray-300'>Phim</a>
                        <a href="#" className='!text-white hover:text-gray-300'>Series</a>
                        <a href="#" className='!text-white hover:text-gray-300'>Mới & Phổ biến</a>
                        <a href="#" className='!text-white hover:text-gray-300'>Danh sách của tôi</a>
                        <a href="#" className='!text-white hover:text-gray-300'>Duyệt tìm theo ngôn ngữ</a>
                    </div>
                </nav>

                {/* Right side - Search, Notifications, Avatar */}
                <div className="flex items-center gap-4">
                {/* Search */}
                <SearchBox />

                {/* Notifications */}
                <button 
                    className="relative hover:opacity-80 transition-opacity !bg-transparent !pl-0 border-none focus:outline-none focus:ring-0" 
                    style={{ outline: 'none', border: 'none' }}
                    aria-label="Thông báo"
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
                            d="M13.0002 4.07092C16.3924 4.55624 19 7.4736 19 11V15.2538C20.0489 15.3307 21.0851 15.4245 22.1072 15.5347L21.8928 17.5232C18.7222 17.1813 15.4092 17 12 17C8.59081 17 5.27788 17.1813 2.10723 17.5232L1.89282 15.5347C2.91498 15.4245 3.95119 15.3307 5.00003 15.2538V11C5.00003 7.47345 7.60784 4.55599 11.0002 4.07086V2H13.0002V4.07092ZM17 15.1287V11C17 8.23858 14.7614 6 12 6C9.2386 6 7.00003 8.23858 7.00003 11V15.1287C8.64066 15.0437 10.3091 15 12 15C13.691 15 15.3594 15.0437 17 15.1287ZM8.62593 19.3712C8.66235 20.5173 10.1512 22 11.9996 22C13.848 22 15.3368 20.5173 15.3732 19.3712C15.3803 19.1489 15.1758 19 14.9533 19H9.0458C8.82333 19 8.61886 19.1489 8.62593 19.3712Z"
                        ></path>
                    </svg>
                    {notifications > 0 && (
                        <span className="absolute -top-1 -right-0 bg-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none font-medium">
                            {notifications}
                        </span>
                    )}
                </button>

                {/* Avatar */}
                <a
                    href="/profiles"
                    className="relative group flex items-center space-x-1"
                    aria-label="Tài khoản & cài đặt"
                >
                    <img
                        src={bg5}
                        alt="Avatar"
                        className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="caret group-hover:inline-block">
                        <img src={icon} alt="dropdown" className="w-3 h-3" />
                    </span>
                </a>
                </div>
            </div>
        </header>
    );
}
