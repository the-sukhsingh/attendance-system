"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="bg-gray-800 py-4 px-8 flex justify-between items-center sticky top-0 left-0 z-10">
        <Link href="/">
          <h1 className="text-white text-2xl">Attendance System</h1>
        </Link>
        <div className="flex items-center">
          {user && <h2 className="text-white mr-4">Welcome {user?.name}</h2>}
          {!user ? (
            <>
              <Link href="/auth">
                <p className="text-white mr-4">Login</p>
              </Link>
              <Link href="/auth">
                <p className="text-white">Register</p>
              </Link>
            </>
          ) : (
            <button
              className="bg-blue-500 text-white p-2 rounded-lg"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
