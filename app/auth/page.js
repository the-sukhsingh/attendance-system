"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register,authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    role: 'student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(formData);
    } else {
      register(formData);
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {!isLogin && (
            <>
            {formData.role === 'student' &&
              <input
              type="text"
              placeholder="Roll No"
              className="w-full mb-4 p-2 border rounded"
              value={formData.rollNo}
              onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
              />
            }
              <select
                className="w-full mb-4 p-2 border rounded"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            disabled={authLoading}
          >
            {!authLoading ? isLogin ? 'Login' : 'Sign Up' : 'Loading...'}
          </button>
        </form>
        <button
          className="w-full mt-4 text-blue-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}