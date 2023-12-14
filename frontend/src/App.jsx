import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Postings from "./components/Postings";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import PostingDetails from "./components/PostingDetails";
import Apply from "./components/Apply";
import CreatePosting from "./components/CreatePosting";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/postings" element={<PrivateRoute />}>
          <Route path="/postings/page/:page" element={<Postings />} />
          <Route path="/postings/:id" element={<PostingDetails />} />
        </Route>
        <Route path="/create-posting" element={<CreatePosting />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/apply/:id" element={<Apply />} />

        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
