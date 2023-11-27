import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Postings from "./components/Postings";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/postings" element={<PrivateRoute/>}>
          <Route path="/postings" element={<Postings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
