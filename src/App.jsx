import { BrowserRouter, Routes, Route } from "react-router-dom";
import AfterLogin from "./pages/AfterLogin";
import Home from "./pages/Home";
import { DialogProvider } from "./context/DialogContext";

export default function App() {
  return (
    <BrowserRouter>
      <DialogProvider>
        <Routes>
          <Route path="/" element={<AfterLogin />} />
          <Route path="/profiles" element={<AfterLogin />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </DialogProvider>
    </BrowserRouter>
  );
}
