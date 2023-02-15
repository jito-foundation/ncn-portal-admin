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

## 4. Transaction 1

### **Bitcoin Transaction**

A tx is a combination of inputs and outputs
Inputs of a new transaction reference outputs of a previous transaction
Outputs are where coins are actually stored

### **Transaction Outputs**

TXOuput store "coins" (Value field)
One important thing about outputs is that they are indivisible, which means that you cannot reference a part of its value.
When an output is referenced in a new transaction, it's spent as a whole.

### **Transaction Inputs**

an input references a previous output:
`Txid` stores the ID of such transaction
`Vout` stores an index of an output in the transaction
`ScriptSig` is a script which provides data to be used in an output's `ScriptPubKey`

### **The egg**

In Bitcoin, outputs come before inputs

When a miner starts mining a block, it adds a coinbase transaction to it. A coinbase transaction is a special type of transactions, which doesn't require previously existing outputs. The egg without a chicken. This is the reward miners get for mining new blocks.

## 5. Addresses

### **Bitcoin address**

If you want to send coins to someone, you need to know their address. In fact, addresses are human readable representation of public keys stored on your computer.

### **Public key cryptography**

a Bitcoin wallet is just a pair of such keys.

### **Digital Signatures**

There's a concept digital signature algorithms recipient.

1. that data wasn't modified while being transfered from a sender to recipient.
2. that data was created by a certain sender
3. that the sender cannot deny sending the data

In order to sign data we need the following the things

1. data to sign
2. private key

full lifecycle of a tx

1. In the beginning, there's a genesis block that contains a coinbase transaction. There are no real inputs in coinbase transaction, so signing is not necessary. The output of the coinbase transaction contains a hashed public key
2. When one sends coins, a transaction is created. Inputs of the transaction will reference outputs from previous transaction.Every input will store a public key (not hashed) and a signature of the whole transaction.
3. Other nodes in the Bitcoin network that receive the transaction will verify it. Besides other things, they will check that: the hash of the public key in an input matches the hash of the referenced output (this ensures that the sender spends only coins belonging to them); the signature is correct (this ensures that the transaction is created by the real owner of the coins).
4. When a miner node is ready to mine a new block, it’ll put the transaction in a block and start mining it.
5. When the blocked is mined, every other node in the network receives a message saying the block is mined and adds the block to the blockchain.
6. After a block is added to the blockchain, the transaction is completed, its outputs can be referenced in new transactions.

### **Elliptic Curve Cryptography**

Bitcoin uses elliptic curves to generate private keys.

### **Base58**

### **Implementing Signatures**

Txs must be signed because this is the only way in Bitcoin to gurantee that one cannot spend coins to belonging to someone else.

## Libraries

- ~~[ecies](https://ecies.org/go/)~~
- [ecdsa](https://pkg.go.dev/crypto/ecdsa)
- [encoding/gob](https://pkg.go.dev/encoding/gob)

## Database

- [boltdb](https://github.com/boltdb/bolt)

## References

- [blockchain_go](https://github.com/Jeiwan/blockchain_go)
- [How to generate a new Ethereum address in Go](https://www.quicknode.com/guides/web3-sdks/how-to-generate-a-new-ethereum-address-in-go)
