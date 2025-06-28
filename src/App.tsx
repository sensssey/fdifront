import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import PostsPage from "./pages/PostPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Profile from "./components/profile/profile";
import AvatarDisplay from "./components/profile/profile";
import AvatarManager from "./components/profile/profile";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" >
            <Route index element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="posts" element={<PostsPage />} />
              <Route path="profile" element={<AvatarManager />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    );
  }
  
  export default App;