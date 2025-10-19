import Link from "next/link"
import { ArrowRight, BarChart3, Bell, TrendingUp, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b-4 border-white">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 border-2 border-white flex items-center justify-center">
              <BarChart3 className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">SHOWITO</span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 font-bold border-2 border-white px-6">
              LAUNCH APP
            </Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block border-2 border-white px-4 py-2 font-mono text-sm">FLOW BLOCKCHAIN</div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                NFT
                <br />
                ANALYTICS
                <br />
                <span className="text-white/40">REDEFINED</span>
              </h1>
            </div>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg font-mono">
              Real-time insights. Portfolio tracking. Market intelligence. Everything you need to dominate Flow NFTs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-bold text-base px-8 border-2 border-white"
                >
                  GET STARTED
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/collections">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white hover:bg-white hover:text-black font-bold text-base px-8 bg-transparent"
                >
                  EXPLORE
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-4 border-white p-6 bg-black">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm font-mono text-white/60 mb-1">TOTAL VOLUME</div>
                  <div className="text-4xl font-bold font-mono">$2.4M</div>
                </div>
                <div className="border-2 border-white px-3 py-1 font-mono text-sm">+24.5%</div>
              </div>
              <div className="h-32 border-2 border-white/20 flex items-end gap-1 p-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
                  <div key={i} className="flex-1 bg-white" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-4 border-white p-6 bg-black">
                <div className="text-sm font-mono text-white/60 mb-2">COLLECTIONS</div>
                <div className="text-3xl font-bold font-mono">500+</div>
              </div>
              <div className="border-4 border-white p-6 bg-black">
                <div className="text-sm font-mono text-white/60 mb-2">FLOOR AVG</div>
                <div className="text-3xl font-bold font-mono">12.5Ƒ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold mb-16 tracking-tighter">FEATURES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-4 border-white p-8 bg-black hover:bg-white hover:text-black transition-colors group">
              <BarChart3 className="h-12 w-12 mb-6" strokeWidth={2.5} />
              <h3 className="text-2xl font-bold mb-4 tracking-tight">REAL-TIME ANALYTICS</h3>
              <p className="text-lg leading-relaxed opacity-70 font-mono">
                Track floor prices, volumes, and market health across all Flow collections with live data updates.
              </p>
            </div>

            <div className="border-4 border-white p-8 bg-black hover:bg-white hover:text-black transition-colors group">
              <Wallet className="h-12 w-12 mb-6" strokeWidth={2.5} />
              <h3 className="text-2xl font-bold mb-4 tracking-tight">PORTFOLIO TRACKING</h3>
              <p className="text-lg leading-relaxed opacity-70 font-mono">
                Connect your wallet to monitor NFT holdings, values, and profit/loss calculations in real-time.
              </p>
            </div>

            <div className="border-4 border-white p-8 bg-black hover:bg-white hover:text-black transition-colors group">
              <TrendingUp className="h-12 w-12 mb-6" strokeWidth={2.5} />
              <h3 className="text-2xl font-bold mb-4 tracking-tight">MARKET TRENDS</h3>
              <p className="text-lg leading-relaxed opacity-70 font-mono">
                Discover trending collections, analyze market sentiment, and identify opportunities before everyone
                else.
              </p>
            </div>

            <div className="border-4 border-white p-8 bg-black hover:bg-white hover:text-black transition-colors group">
              <Bell className="h-12 w-12 mb-6" strokeWidth={2.5} />
              <h3 className="text-2xl font-bold mb-4 tracking-tight">PRICE ALERTS</h3>
              <p className="text-lg leading-relaxed opacity-70 font-mono">
                Set custom alerts for floor price changes, volume spikes, and rare trait listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border-4 border-white p-8 text-center bg-black">
              <div className="text-5xl md:text-6xl font-bold font-mono mb-2">500+</div>
              <div className="text-sm font-mono text-white/60 uppercase tracking-wider">Collections</div>
            </div>
            <div className="border-4 border-white p-8 text-center bg-black">
              <div className="text-5xl md:text-6xl font-bold font-mono mb-2">2.5M</div>
              <div className="text-sm font-mono text-white/60 uppercase tracking-wider">NFTs Indexed</div>
            </div>
            <div className="border-4 border-white p-8 text-center bg-black">
              <div className="text-5xl md:text-6xl font-bold font-mono mb-2">50K+</div>
              <div className="text-sm font-mono text-white/60 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="border-4 border-white p-8 text-center bg-black">
              <div className="text-5xl md:text-6xl font-bold font-mono mb-2">24/7</div>
              <div className="text-sm font-mono text-white/60 uppercase tracking-wider">Live Updates</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-none">
              READY TO
              <br />
              DOMINATE
              <br />
              FLOW NFTs?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl font-mono">
              Join thousands of collectors and traders using Showito to make data-driven decisions.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold text-lg px-10 py-6 border-2 border-white"
              >
                LAUNCH APP NOW
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-4 border-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-sm">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 border-2 border-white flex items-center justify-center">
                <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span>© 2025 SHOWITO</span>
            </div>
            <div className="flex gap-8 uppercase">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/collections" className="hover:underline">
                Collections
              </Link>
              <Link href="/settings" className="hover:underline">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
