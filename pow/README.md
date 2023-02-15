# POW chain

## 1. Basic Prototype

**Block**
Bitcoin blocks store transactions, its version, current timestamp and the hash of the previous block

## 2. Proof-of-Work

"do hard work and prove" mechanism is called proof-of-work.
Requirement:
doing the work is hard
verifying the proof is easy

### **Hasing**

Hashing is a process of obtaining a hash for specified data. A hash is a unique representation of the data it was calculated on.
Hashing functiosn are widely used to check the consistency of data.

### **Hashcash**

Bitcoin uses [Hashcase](https://en.wikipedia.org/wiki/Hashcash)

1. Take some publicly known data (in case of Bitcoin, it's block headers)
2. Add a counter to it. The couter starts at 0.
3. Get a hash of the `data + counter` combination.
4. Check that the hash meets certain requirements
   1. If it does, you're done
   2. if it doesn't, increase the counter and repeat the step3 and step4

In the original Hashcash implementation, the requirement sounds like "first 20 bits of a hash mest be zero".

target as the upper boundary of a range: if a number (a hash) is lower than the boundary, it' valid, and vice versa,

## 3. Persistence and CLI

### **Database Structure**

Bitcoin Core uses two "buckets" to store data:

1. `blocks` stores metadata describing all the blocks in a chain
2. `chainstate` stores the state of a chain, which is all currently unspent tx outputs and some metadata

Also, blocksa are stored as separate files on the disk. This is done for a performance purpose: reading a single block won't require loading all (or some) of them into memory.

### **Serialization**

### **Persistence**

1. Open a DB file
2. Check if there's a blockchain stored in it.
3. If there's a blockchain:
   1. Create a new Blockchain instance
   2. Set the tip of the Blockchain instance to the last block hash stored in the DB.
4. If there's no existing blockchain
   1. Create the genesis block
   2. Store in the DB
   3. Save the genesis block's hash as the last block hash.
   4. Create a new Blockchain instance with its tip pointing at the genesis block.

### **Inspecting Blockchain**

will read them one by one. 

choosing a tip means "voting" for a blockchain

## Libraries

- ~~[ecies](https://ecies.org/go/)~~
- [ecdsa](https://pkg.go.dev/crypto/ecdsa)
- [encoding/gob](https://pkg.go.dev/encoding/gob)

## Database

- [boltdb](https://github.com/boltdb/bolt)

## References

- [blockchain_go](https://github.com/Jeiwan/blockchain_go)
- [How to generate a new Ethereum address in Go](https://www.quicknode.com/guides/web3-sdks/how-to-generate-a-new-ethereum-address-in-go)
