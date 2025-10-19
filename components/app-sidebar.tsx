"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Grid3x3, TrendingUp, Bell, Settings, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "DASHBOARD", href: "/dashboard", icon: BarChart3 },
  { name: "COLLECTIONS", href: "/collections", icon: Grid3x3 },
  { name: "TRENDS", href: "/trends", icon: TrendingUp },
  { name: "ALERTS", href: "/alerts", icon: Bell },
  { name: "SETTINGS", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { address, connect, disconnect } = useWallet()

  return (
    <div className="w-64 border-r-4 border-white bg-black h-screen flex flex-col">
      {/* Logo */}
      <div className="border-b-4 border-white p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-white flex items-center justify-center">
            <BarChart3 className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tight">SHOWITO</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-mono text-sm tracking-wider transition-colors border-2",
                isActive
                  ? "bg-white text-black border-white"
                  : "border-white/20 hover:border-white hover:bg-white hover:text-black",
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={2.5} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Wallet Connection */}
      <div className="border-t-4 border-white p-4">
        {address ? (
          <div className="space-y-3">
            <div className="border-2 border-white p-3 bg-black">
              <div className="text-xs font-mono text-white/60 mb-1">CONNECTED</div>
              <div className="text-sm font-mono truncate">{address}</div>
            </div>
            <Button
              onClick={disconnect}
              variant="outline"
              className="w-full border-2 border-white hover:bg-white hover:text-black font-mono text-sm bg-transparent"
            >
              DISCONNECT
            </Button>
          </div>
        ) : (
          <Button
            onClick={connect}
            className="w-full bg-white text-black hover:bg-white/90 font-mono text-sm border-2 border-white"
          >
            <Wallet className="mr-2 h-4 w-4" strokeWidth={2.5} />
            CONNECT WALLET
          </Button>
        )}
      </div>
    </div>
  )
}
