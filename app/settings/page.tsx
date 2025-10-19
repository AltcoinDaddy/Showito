"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsProfile } from "@/components/settings-profile"
import { SettingsNotifications } from "@/components/settings-notifications"
import { SettingsDisplay } from "@/components/settings-display"
import { SettingsAPI } from "@/components/settings-api"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <SettingsProfile />
            <SettingsNotifications />
            <SettingsDisplay />
          </div>
          <SettingsAPI />
        </div>
      </main>
    </div>
  )
}
