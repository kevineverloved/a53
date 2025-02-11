import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function BurgerMenu({ isOpen, toggleMenu }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={`burger-menu ${isOpen ? "open" : ""}`}>
      <div className="menu-items">
        <Link to="/dashboard" className="menu-item" onClick={toggleMenu}>
          Dashboard
        </Link>
        <Link to="/roadrules" className="menu-item" onClick={toggleMenu}>
          Road Rules
        </Link>
        <Link to="/profile" className="menu-item" onClick={toggleMenu}>
          Profile
        </Link>
        <button onClick={handleLogout} className="menu-item">
          Logout
        </button>
      </div>
    </div>
  );
}

export default BurgerMenu; 