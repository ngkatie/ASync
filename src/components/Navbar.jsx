import { Box } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import asyncLogo from "/async.png";
import { doSignOut } from "../firebase/FirebaseFunctions"

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "120px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        color: "black",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
          paddingBottom: 2,
        }}
      >
        <Box
          component="img"
          src={asyncLogo}
          alt="ASync logo"
          sx={{
            width: 50,
            height: 50,
            paddingLeft: 5,
          }}
        ></Box>
        <Box
          sx={{
            paddingRight: 5,
          }}
        >
          {currentUser 
            ? <Link to="/" style={{ marginRight: 20 }} onClick={doSignOut}>Log Out</Link>
            : <Link to="/login" style={{ marginRight: 20 }}>Log In</Link>
          }
          {currentUser 
            ? <Link to="/postings">View Postings</Link>
            : <Link to="/register">Create an account</Link>
          }
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
