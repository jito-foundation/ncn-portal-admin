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

## Libraries

- ~~[ecies](https://ecies.org/go/)~~
- [ecdsa](https://pkg.go.dev/crypto/ecdsa)
- [encoding/gob](https://pkg.go.dev/encoding/gob)

## Database

- [boltdb](https://github.com/boltdb/bolt)

## References

- [blockchain_go](https://github.com/Jeiwan/blockchain_go)
- [How to generate a new Ethereum address in Go](https://www.quicknode.com/guides/web3-sdks/how-to-generate-a-new-ethereum-address-in-go)
