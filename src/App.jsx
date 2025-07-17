// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AfterLogin from "./pages/AfterLogin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { DialogProvider } from "./context/DialogContext";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Component để bảo vệ route
const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>; // Hoặc một spinner loading
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};


export default function App() {
  return (
    <BrowserRouter>
      <DialogProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AfterLogin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profiles" 
            element={
              <ProtectedRoute>
                <AfterLogin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </DialogProvider>
    </BrowserRouter>
  );
}