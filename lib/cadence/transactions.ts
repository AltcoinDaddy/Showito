// Cadence transaction scripts for Flow blockchain interactions

export const BUY_MOMENT = `
import TopShot from 0x0b2a3299cc857e29
import TopShotMarketV3 from 0xc1e4f4f4c4257510
import FungibleToken from 0xf233dcee88fe0abe
import FlowToken from 0x1654653399040a61

transaction(saleID: UInt64, price: UFix64) {
  let paymentVault: @FungibleToken.Vault
  let collection: &TopShot.Collection
  let mainFlowVault: &FlowToken.Vault
  
  prepare(acct: AuthAccount) {
    // Get the buyer's collection
    self.collection = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
      ?? panic("Cannot borrow moment collection")
    
    // Get the buyer's Flow vault
    self.mainFlowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
      ?? panic("Cannot borrow Flow vault")
    
    // Withdraw payment
    self.paymentVault <- self.mainFlowVault.withdraw(amount: price)
  }
  
  execute {
    // Purchase the moment
    TopShotMarketV3.purchase(
      saleID: saleID,
      buyerCollection: self.collection,
      buyerPayment: <-self.paymentVault
    )
  }
}
`

export const LIST_MOMENT_FOR_SALE = `
import TopShot from 0x0b2a3299cc857e29
import TopShotMarketV3 from 0xc1e4f4f4c4257510
import FungibleToken from 0xf233dcee88fe0abe

transaction(momentID: UInt64, price: UFix64) {
  let collection: &TopShot.Collection
  let saleCollection: &TopShotMarketV3.SaleCollection
  
  prepare(acct: AuthAccount) {
    // Get the seller's collection
    self.collection = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
      ?? panic("Cannot borrow moment collection")
    
    // Get or create sale collection
    if acct.borrow<&TopShotMarketV3.SaleCollection>(from: /storage/topshotSaleCollection) == nil {
      let saleCollection <- TopShotMarketV3.createSaleCollection()
      acct.save(<-saleCollection, to: /storage/topshotSaleCollection)
      acct.link<&TopShotMarketV3.SaleCollection{TopShotMarketV3.SalePublic}>(
        /public/topshotSaleCollection,
        target: /storage/topshotSaleCollection
      )
    }
    
    self.saleCollection = acct.borrow<&TopShotMarketV3.SaleCollection>(from: /storage/topshotSaleCollection)
      ?? panic("Cannot borrow sale collection")
  }
  
  execute {
    // Withdraw moment from collection
    let moment <- self.collection.withdraw(withdrawID: momentID) as! @TopShot.NFT
    
    // List moment for sale
    self.saleCollection.listForSale(
      token: <-moment,
      price: price
    )
  }
}
`

export const CANCEL_LISTING = `
import TopShot from 0x0b2a3299cc857e29
import TopShotMarketV3 from 0xc1e4f4f4c4257510

transaction(saleID: UInt64) {
  let saleCollection: &TopShotMarketV3.SaleCollection
  let collection: &TopShot.Collection
  
  prepare(acct: AuthAccount) {
    self.saleCollection = acct.borrow<&TopShotMarketV3.SaleCollection>(from: /storage/topshotSaleCollection)
      ?? panic("Cannot borrow sale collection")
    
    self.collection = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
      ?? panic("Cannot borrow moment collection")
  }
  
  execute {
    // Cancel the listing and return moment to collection
    let moment <- self.saleCollection.withdraw(saleID: saleID)
    self.collection.deposit(token: <-moment)
  }
}
`

export const TRANSFER_MOMENT = `
import TopShot from 0x0b2a3299cc857e29
import NonFungibleToken from 0x1d7e57aa55817448

transaction(recipient: Address, momentID: UInt64) {
  let transferToken: @NonFungibleToken.NFT
  
  prepare(acct: AuthAccount) {
    // Get the sender's collection
    let collection = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
      ?? panic("Cannot borrow moment collection")
    
    // Withdraw the moment
    self.transferToken <- collection.withdraw(withdrawID: momentID)
  }
  
  execute {
    // Get the recipient's collection
    let recipient = getAccount(recipient)
    let receiverRef = recipient.getCapability(/public/MomentCollection)
      .borrow<&{TopShot.MomentCollectionPublic}>()
      ?? panic("Cannot borrow recipient's collection")
    
    // Deposit the moment
    receiverRef.deposit(token: <-self.transferToken)
  }
}
`

export const SETUP_ACCOUNT = `
import TopShot from 0x0b2a3299cc857e29
import NonFungibleToken from 0x1d7e57aa55817448

transaction {
  prepare(acct: AuthAccount) {
    // Check if collection already exists
    if acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection) == nil {
      // Create a new empty collection
      let collection <- TopShot.createEmptyCollection()
      
      // Save it to storage
      acct.save(<-collection, to: /storage/MomentCollection)
      
      // Create a public capability for the collection
      acct.link<&{TopShot.MomentCollectionPublic}>(
        /public/MomentCollection,
        target: /storage/MomentCollection
      )
    }
  }
}
`
