"use client"

import { useCallback } from "react"

export function useAuth() {
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Signup failed")
    }

    // server sends back a message like "Verification email sent"
    return res.json()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // if you use cookies/sessions
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Signin failed")
    }

    return res.json()
  }, [])

  return { signUp, signIn }
}
