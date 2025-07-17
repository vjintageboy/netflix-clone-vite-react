import '../index.css'
import { useNavigate } from 'react-router-dom'
import bg1 from "../assets/profile/profile1.jpeg"
import bg2 from "../assets/profile/profile2.jpeg"
import bg3 from "../assets/profile/profile3.jpeg"
import bg4 from "../assets/profile/profile4.jpeg"
import bg5 from "../assets/profile/profile5.jpeg"

const avatars = [bg1, bg2, bg3, bg4];

export default function Afterlogin() {
  const navigate = useNavigate();
  
  return (
    <div className="after-login text-white text-center">
      <h1 className="text-3xl mb-6">Ai đang xem?</h1>

      <div className="btn-profile flex justify-center gap-6 flex-wrap">
        {avatars.map((bg, i) => (
          <a key={i}
          onClick={() => navigate("/home")}
          className="group flex flex-col items-center cursor-pointer gap-1">
            <button
              className="w-40 h-40 rounded bg-cover bg-center mb-2 border-4 border-transparent group-hover:border-white transition-all duration-300"
              style={{ backgroundImage: `url(${bg})` }}
            ></button>
            <span className="group-hover:text-white text-gray-400">Hoàng Anh {i + 1}</span>
          </a>
        ))}
        <a
          onClick={() => navigate("/home")}
          className="group flex flex-col items-center cursor-pointer gap-1">
            <button
              className="w-40 h-40 rounded bg-cover bg-center mb-2 border-4 border-transparent group-hover:border-white transition-all duration-300"
              style={{ backgroundImage: `url(${bg5})` }}
            ></button>
            <span className="group-hover:text-white text-gray-400">Anh Trầm Tính</span>
          </a>
      </div>

      <div className="mt-8">
        <button 
          onClick={() => navigate("/home")} 
          className="border border-gray-400 text-gray-400 hover:text-white hover:border-white px-6 py-2 bg-transparent transition-all duration-300"
        >
          Quản lý hồ sơ
        </button>
      </div>
    </div>
  )
}
