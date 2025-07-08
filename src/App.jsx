import { BrowserRouter, Routes, Route } from "react-router-dom";
import AfterLogin from "./pages/AfterLogin";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AfterLogin />} />
        <Route path="/profiles" element={<AfterLogin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
