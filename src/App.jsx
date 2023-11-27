import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Postings from "./components/Postings";
import PageNotFound from "./components/PageNotFound";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/postings" element={<PrivateRoute />}>
          <Route path="/postings" element={<Postings />} />
        </Route>
        <Route path='/404' element={<PageNotFound />} />
        <Route path='*' element={<Navigate to='/404'/>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
