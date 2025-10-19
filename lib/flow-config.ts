// Flow blockchain configuration and contract addresses

export const FLOW_CONFIG = {
  // Mainnet configuration
  mainnet: {
    accessNode: "https://rest-mainnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/authn",
    contracts: {
      // NBA Top Shot contracts
      topShot: "0x0b2a3299cc857e29",
      topShotMarket: "0xc1e4f4f4c4257510",

      // NFL All Day contracts
      allDay: "0xe4cf4bdc1751c65d",
      allDayMarket: "0x8de96244f54db422",

      // UFC Strike contracts
      ufcStrike: "0x329feb3ab062d289",

      // Flovatar contracts
      flovatar: "0x921ea449dffec68a",
      flovatarMarket: "0x921ea449dffec68a",

      // Core Flow contracts
      nonFungibleToken: "0x1d7e57aa55817448",
      fungibleToken: "0xf233dcee88fe0abe",
      flowToken: "0x1654653399040a61",
    },
  },

  // Testnet configuration
  testnet: {
    accessNode: "https://rest-testnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
    contracts: {
      topShot: "0x877931736ee77cff",
      nonFungibleToken: "0x631e88ae7f1d7c20",
      fungibleToken: "0x9a0766d93b6608b7",
      flowToken: "0x7e60df042a9c0868",
    },
  },
}

// Use mainnet by default
export const NETWORK = process.env.NEXT_PUBLIC_FLOW_NETWORK || "mainnet"
export const CONFIG = FLOW_CONFIG[NETWORK as keyof typeof FLOW_CONFIG]
