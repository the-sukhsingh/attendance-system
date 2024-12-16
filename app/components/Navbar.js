"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-primary-500">Attendance System</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user && (
              <span className="text-[var(--text-secondary)]">
                Welcome, {user?.name}
              </span>
            )}
            {!user ? (
              <Link href="/auth">
                <button className="btn-primary">Login</button>
              </Link>
            ) : (
              <button className="btn-secondary" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
