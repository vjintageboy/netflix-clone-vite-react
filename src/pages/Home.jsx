import '../index.css'
import bg1 from "../assets/home/background.webp"
import Navbar from './Navbar.jsx'
import Layer from './Layer.jsx'
export default function Home() {
  return (
    <>
      {/* NavBar */}
      <Navbar />
      <div
        className="text-white text-center h-screen flex items-center justify-center w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bg1})` }}
      >
      {/* Layer */}
        <div className="relative z-10 ">
          <Layer />
        </div>
      </div>
    </>
  );
}