"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  date_of_birth: string | null
  loyalty_points: number
  is_b2b: boolean
}

export function useUser() {
  const supabase = createClient()
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchProfile(data.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(id: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()
    setProfile(data)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(updates: Partial<Omit<Profile, "id" | "loyalty_points" | "is_b2b">>) {
    if (!user) return
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
    if (!error) setProfile(p => p ? { ...p, ...updates } : p)
    return error
  }

  return { user, profile, loading, signOut, updateProfile }
}
