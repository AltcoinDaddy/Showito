"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"

interface WalletModalProps {
  open: boolean
  onClose: () => void
}

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connect } = useWallet()

  const handleConnect = async (walletType: string) => {
    await connect()
    onClose()
  }

  const wallets = [
    {
      name: "Dapper Wallet",
      description: "Official Flow wallet for NFTs",
      type: "dapper",
    },
    {
      name: "Blocto",
      description: "Cross-chain wallet solution",
      type: "blocto",
    },
    {
      name: "Lilico",
      description: "Flow blockchain wallet",
      type: "lilico",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>Choose a wallet to connect to Showito</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.type}
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent"
              onClick={() => handleConnect(wallet.type)}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded" />
                <div className="text-left">
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-sm text-muted-foreground">{wallet.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
