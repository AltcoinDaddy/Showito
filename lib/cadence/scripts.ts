/**
 * Cadence scripts for querying Flow blockchain data
 */

// Get NBA Top Shot collection info
export const GET_TOPSHOT_COLLECTION_INFO = `
import TopShot from 0x0b2a3299cc857e29
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448

pub struct CollectionInfo {
    pub let name: String
    pub let description: String
    pub let totalSupply: UInt64
    pub let squareImage: String?
    pub let bannerImage: String?
    
    init(name: String, description: String, totalSupply: UInt64, squareImage: String?, bannerImage: String?) {
        self.name = name
        self.description = description
        self.totalSupply = totalSupply
        self.squareImage = squareImage
        self.bannerImage = bannerImage
    }
}

pub fun main(): CollectionInfo {
    let collection = TopShot.borrowCollectionPublic()
    
    return CollectionInfo(
        name: "NBA Top Shot",
        description: "Officially licensed NBA collectible highlights",
        totalSupply: TopShot.totalSupply,
        squareImage: nil,
        bannerImage: nil
    )
}
`

// Get user's NBA Top Shot moments
export const GET_USER_TOPSHOT_MOMENTS = `
import TopShot from 0x0b2a3299cc857e29
import NonFungibleToken from 0x1d7e57aa55817448

pub struct MomentInfo {
    pub let id: UInt64
    pub let playID: UInt32
    pub let play: TopShot.Play
    pub let setID: UInt32
    pub let serialNumber: UInt32
    
    init(id: UInt64, playID: UInt32, play: TopShot.Play, setID: UInt32, serialNumber: UInt32) {
        self.id = id
        self.playID = playID
        self.play = play
        self.setID = setID
        self.serialNumber = serialNumber
    }
}

pub fun main(address: Address): [MomentInfo] {
    let account = getAccount(address)
    
    let collectionRef = account
        .getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    let moments: [MomentInfo] = []
    let ids = collectionRef.getIDs()
    
    for id in ids {
        let moment = collectionRef.borrowMoment(id: id)
            ?? panic("Could not borrow moment")
        
        let momentData = TopShot.getMomentData(id: id)
        let play = TopShot.getPlayData(id: momentData.playID)
        
        moments.append(MomentInfo(
            id: id,
            playID: momentData.playID,
            play: play,
            setID: momentData.setID,
            serialNumber: momentData.serialNumber
        ))
    }
    
    return moments
}
`

// Get NFL All Day collection info
export const GET_ALLDAY_COLLECTION_INFO = `
import AllDay from 0xe4cf4bdc1751c65d
import NonFungibleToken from 0x1d7e57aa55817448

pub struct CollectionInfo {
    pub let name: String
    pub let description: String
    pub let totalSupply: UInt64
    
    init(name: String, description: String, totalSupply: UInt64) {
        self.name = name
        self.description = description
        self.totalSupply = totalSupply
    }
}

pub fun main(): CollectionInfo {
    return CollectionInfo(
        name: "NFL All Day",
        description: "Officially licensed NFL collectible highlights",
        totalSupply: AllDay.totalSupply
    )
}
`

// Get user's NFL All Day moments
export const GET_USER_ALLDAY_MOMENTS = `
import AllDay from 0xe4cf4bdc1751c65d
import NonFungibleToken from 0x1d7e57aa55817448

pub struct MomentInfo {
    pub let id: UInt64
    pub let playID: UInt32
    pub let serialNumber: UInt32
    
    init(id: UInt64, playID: UInt32, serialNumber: UInt32) {
        self.id = id
        self.playID = playID
        self.serialNumber = serialNumber
    }
}

pub fun main(address: Address): [MomentInfo] {
    let account = getAccount(address)
    
    let collectionRef = account
        .getCapability(/public/MomentNFTCollection)
        .borrow<&{AllDay.MomentNFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    let moments: [MomentInfo] = []
    let ids = collectionRef.getIDs()
    
    for id in ids {
        let moment = collectionRef.borrowMomentNFT(id: id)
            ?? panic("Could not borrow moment")
        
        moments.append(MomentInfo(
            id: id,
            playID: moment.playID,
            serialNumber: moment.serialNumber
        ))
    }
    
    return moments
}
`

// Check if account has collections set up
export const CHECK_ACCOUNT_SETUP = `
import TopShot from 0x0b2a3299cc857e29
import AllDay from 0xe4cf4bdc1751c65d
import NonFungibleToken from 0x1d7e57aa55817448

pub struct AccountSetup {
    pub let hasTopShotCollection: Bool
    pub let hasAllDayCollection: Bool
    pub let address: Address
    
    init(hasTopShotCollection: Bool, hasAllDayCollection: Bool, address: Address) {
        self.hasTopShotCollection = hasTopShotCollection
        self.hasAllDayCollection = hasAllDayCollection
        self.address = address
    }
}

pub fun main(address: Address): AccountSetup {
    let account = getAccount(address)
    
    let hasTopShot = account
        .getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>() != nil
    
    let hasAllDay = account
        .getCapability(/public/MomentNFTCollection)
        .borrow<&{AllDay.MomentNFTCollectionPublic}>() != nil
    
    return AccountSetup(
        hasTopShotCollection: hasTopShot,
        hasAllDayCollection: hasAllDay,
        address: address
    )
}
`

// Get Flow account balance
export const GET_FLOW_BALANCE = `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")
    
    return vaultRef.balance
}
`