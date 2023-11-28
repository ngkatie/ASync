import { Navigate, Outlet } from "react-router";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute() {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? <Outlet/> : <Navigate to="/" replace={true}/>;
}

export default PrivateRoute;