"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthContextType, User } from "../types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciales de administrador
const ADMIN_EMAIL = "admin@srrobot.com"
const ADMIN_PASSWORD = "SrRobot2024!"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("sr-robot-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Verificar credenciales de administrador
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: "admin-1",
        name: "Administrador Sr. Robot",
        email: email,
        isAdmin: true,
      }
      setUser(adminUser)
      localStorage.setItem("sr-robot-user", JSON.stringify(adminUser))
      return true
    }

    // Verificar usuario normal (simulado)
    if (email && password.length >= 6) {
      const normalUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email: email,
        isAdmin: false,
      }
      setUser(normalUser)
      localStorage.setItem("sr-robot-user", JSON.stringify(normalUser))
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        isAdmin: false,
      }
      setUser(newUser)
      localStorage.setItem("sr-robot-user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sr-robot-user")
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
