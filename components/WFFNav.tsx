"use client"

import { Wind, Package, Candy, Flower2, Layers, User, Briefcase } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function WFFNav() {
  return (
    <NavBar
      items={[
        { name: "Vapes",   url: "/shop/vapes",   icon: Wind },
        { name: "Pods",    url: "/shop/pods",    icon: Package },
        { name: "Edibles", url: "/shop/edibles", icon: Candy },
        { name: "Blüten",  url: "/shop/blueten", icon: Flower2 },
        { name: "Hasch",   url: "/shop/hasch",   icon: Layers },
        { name: "Konto",   url: "/account",      icon: User },
        { name: "B2B",     url: "/b2b",          icon: Briefcase },
      ]}
    />
  )
}
