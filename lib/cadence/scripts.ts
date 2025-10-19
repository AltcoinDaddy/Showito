// Cadence scripts for reading data from Flow blockchain

export const GET_COLLECTION_IDS = `
import NonFungibleToken from 0x1d7e57aa55817448

pub fun main(address: Address): [UInt64] {
  let account = getAccount(address)
  
  let collectionRef = account.getCapability(/public/MomentCollection)
    .borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow collection reference")
  
  return collectionRef.getIDs()
}
`

export const GET_TOP_SHOT_MOMENTS = `
import TopShot from 0x0b2a3299cc857e29

pub struct MomentData {
  pub let id: UInt64
  pub let playID: UInt32
  pub let play: String
  pub let setID: UInt32
  pub let serialNumber: UInt32
  
  init(id: UInt64, playID: UInt32, play: String, setID: UInt32, serialNumber: UInt32) {
    self.id = id
    self.playID = playID
    self.play = play
    self.setID = setID
    self.serialNumber = serialNumber
  }
}

pub fun main(address: Address, momentID: UInt64): MomentData? {
  let account = getAccount(address)
  
  let collectionRef = account.getCapability(/public/MomentCollection)
    .borrow<&{TopShot.MomentCollectionPublic}>()
  
  if collectionRef == nil {
    return nil
  }
  
  let moment = collectionRef!.borrowMoment(id: momentID)
  if moment == nil {
    return nil
  }
  
  let momentData = moment!.data
  
  return MomentData(
    id: momentID,
    playID: momentData.playID,
    play: "Moment",
    setID: momentData.setID,
    serialNumber: momentData.serialNumber
  )
}
`

export const GET_ALL_MOMENTS = `
import TopShot from 0x0b2a3299cc857e29

pub fun main(address: Address): [UInt64] {
  let account = getAccount(address)
  
  let collectionRef = account.getCapability(/public/MomentCollection)
    .borrow<&{TopShot.MomentCollectionPublic}>()
    ?? panic("Could not borrow moment collection")
  
  return collectionRef.getIDs()
}
`

export const GET_PLAY_METADATA = `
import TopShot from 0x0b2a3299cc857e29

pub fun main(playID: UInt32): {String: String} {
  return TopShot.getPlayMetaData(playID: playID) ?? {}
}
`

export const GET_SET_NAME = `
import TopShot from 0x0b2a3299cc857e29

pub fun main(setID: UInt32): String {
  return TopShot.getSetName(setID: setID) ?? "Unknown Set"
}
`

export const GET_MOMENT_METADATA = `
import TopShot from 0x0b2a3299cc857e29
import MetadataViews from 0x1d7e57aa55817448

pub struct NFTData {
  pub let id: UInt64
  pub let name: String
  pub let description: String
  pub let thumbnail: String
  pub let serialNumber: UInt32
  pub let playID: UInt32
  pub let setID: UInt32
  
  init(
    id: UInt64,
    name: String,
    description: String,
    thumbnail: String,
    serialNumber: UInt32,
    playID: UInt32,
    setID: UInt32
  ) {
    self.id = id
    self.name = name
    self.description = description
    self.thumbnail = thumbnail
    self.serialNumber = serialNumber
    self.playID = playID
    self.setID = setID
  }
}

pub fun main(address: Address, momentID: UInt64): NFTData? {
  let account = getAccount(address)
  
  let collection = account.getCapability(/public/MomentCollection)
    .borrow<&{TopShot.MomentCollectionPublic}>()
    ?? panic("Could not borrow moment collection")
  
  let nft = collection.borrowMoment(id: momentID)
    ?? panic("Moment does not exist")
  
  let metadata = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
  
  return NFTData(
    id: momentID,
    name: metadata.name,
    description: metadata.description,
    thumbnail: metadata.thumbnail.uri(),
    serialNumber: nft.data.serialNumber,
    playID: nft.data.playID,
    setID: nft.data.setID
  )
}
`

export const GET_MARKET_LISTINGS = `
import TopShotMarketV3 from 0xc1e4f4f4c4257510

pub fun main(): [UInt64] {
  return TopShotMarketV3.getSaleIDs()
}
`

export const GET_LISTING_DETAILS = `
import TopShotMarketV3 from 0xc1e4f4f4c4257510

pub struct ListingData {
  pub let momentID: UInt64
  pub let price: UFix64
  pub let seller: Address
  
  init(momentID: UInt64, price: UFix64, seller: Address) {
    self.momentID = momentID
    self.price = price
    self.seller = seller
  }
}

pub fun main(saleID: UInt64): ListingData? {
  let saleCollection = TopShotMarketV3.borrowSaleCollection()
  let sale = saleCollection.borrowSale(saleID: saleID)
  
  if sale == nil {
    return nil
  }
  
  return ListingData(
    momentID: sale!.momentID,
    price: sale!.price,
    seller: sale!.seller
  )
}
`
