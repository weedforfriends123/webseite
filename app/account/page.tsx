"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { AccountSidebar } from "@/components/account/AccountSidebar"
import { Dashboard } from "@/components/account/Dashboard"
import { Orders } from "@/components/account/Orders"
import { Profile } from "@/components/account/Profile"
import { Password } from "@/components/account/Password"
import { Payments } from "@/components/account/Payments"
import { Notifications } from "@/components/account/Notifications"
import { Loyalty } from "@/components/account/Loyalty"

export type Section =
  | "dashboard"
  | "orders"
  | "profile"
  | "password"
  | "payments"
  | "notifications"
  | "loyalty"

const VIEWS: Record<Section, React.ComponentType> = {
  dashboard: Dashboard,
  orders: Orders,
  profile: Profile,
  password: Password,
  payments: Payments,
  notifications: Notifications,
  loyalty: Loyalty,
}

export default function AccountPage() {
  const [active, setActive] = useState<Section>("dashboard")
  const View = VIEWS[active]

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <AccountSidebar active={active} setActive={setActive} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <View />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
