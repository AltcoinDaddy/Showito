"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { AlertsList } from "@/components/alerts-list"
import { CreateAlert } from "@/components/create-alert"
import { AlertStats } from "@/components/alert-stats"

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Price Alerts</h1>
          <p className="text-muted-foreground text-lg">Set up notifications for price changes and market events</p>
        </div>

        <AlertStats />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AlertsList />
          </div>
          <CreateAlert />
        </div>
      </main>
    </div>
  )
}
