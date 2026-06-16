"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { AccountSidebar } from "@/components/account/AccountSidebar"
import { Dashboard } from "@/components/account/Dashboard"
import { Orders } from "@/components/account/Orders"
import { Profile } from "@/components/account/Profile"
import { Password } from "@/components/account/Password"
import { Notifications } from "@/components/account/Notifications"
import { Loyalty } from "@/components/account/Loyalty"
import { AgeVerification } from "@/components/account/AgeVerification"
import { useUser } from "@/lib/hooks/useUser"

export type Section =
  | "dashboard"
  | "orders"
  | "profile"
  | "password"
  | "notifications"
  | "loyalty"
  | "ageverification"

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useUser()
  const [active, setActive] = useState<Section>("dashboard")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div style={{ background: "#bcc0ca", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#35383f] border-t-transparent animate-spin" />
      </div>
    )
  }

  const VIEWS: Record<Section, React.ComponentType<{ user: typeof user; profile: typeof profile; signOut: typeof signOut }>> = {
    dashboard:       Dashboard,
    orders:          Orders,
    profile:         Profile,
    password:        Password,
    notifications:   Notifications,
    loyalty:         Loyalty,
    ageverification: AgeVerification,
  }

  const View = VIEWS[active]

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <Navbar />

      <div
        className="max-w-7xl mx-auto"
        style={{ padding: "clamp(88px,13vh,140px) clamp(16px,5vw,80px) clamp(48px,8vh,100px)" }}
      >
        <div className="flex flex-col md:flex-row gap-10">

          <div className="w-full md:w-64 shrink-0">
            <AccountSidebar active={active} setActive={setActive} user={user} profile={profile} onSignOut={async () => { await signOut(); router.push("/") }} />
          </div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <View user={user} profile={profile} signOut={signOut} />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}
