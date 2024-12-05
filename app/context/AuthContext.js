'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (formData) => {
    setAuthLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return false
      } else {
        setUser(data.user)
        localStorage.setItem('currentUser', JSON.stringify(data.user))

        window.location.href = data.user.role == "teacher" ? '/' : '/student-dashboard'
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (formData) => {
    setAuthLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return false
      }
      alert(data.message + " Please login to continue.")
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('classes')
    document.cookie = `token=; expires=${Date.now}; path=/`;
    window.location.href = '/auth'
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
