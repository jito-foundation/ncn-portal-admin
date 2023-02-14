package pow

import (
	"bytes"
	"crypto/ecdsa"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/boltdb/bolt"
)

const dbFile = "blockchain.db"
const blocksBucket = "blocks"
const genesisCoinbaseData = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"

type PowBlockchain struct {
	Tip []byte
	DB  *bolt.DB
}

func CreatePowBlockchain(address string) *PowBlockchain {
	if dbExists() {
		fmt.Println("Blockchain already exists.")
		os.Exit(1)
	}

	var tip []byte

	cbtx := NewCoinbaseTx(address, genesisCoinbaseData)
	genesis := NewGenesisBlock(cbtx)

	// open a BoltDB file
	db, err := bolt.Open(dbFile, 0600, nil)
	if err != nil {
		log.Panic(err)
	}

	err = db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucket([]byte(blocksBucket))
		if err != nil {
			log.Panic(err)
		}

		err = b.Put(genesis.Hash, genesis.Serialize())
		if err != nil {
			log.Panic(err)
		}

		err = b.Put([]byte("l"), genesis.Hash)
		if err != nil {
			log.Panic(err)
		}

		tip = genesis.Hash

		return nil
	})
	if err != nil {
		log.Panic(err)
	}

	bc := PowBlockchain{tip, db}

	return &bc
}

func NewPowBlockchain() *PowBlockchain {
	if dbExists() == false {
		fmt.Println("No existing blockchain found. Create one first")
		os.Exit(1)
	}

	var tip []byte
	db, err := bolt.Open(dbFile, 0600, nil)
	if err != nil {
		log.Panic(err)
	}

	err = db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(blocksBucket))
		tip = b.Get([]byte("l"))
		return nil
	})
	if err != nil {
		log.Panic(err)
	}

	bc := PowBlockchain{tip, db}

	return &bc
}

// finds a transaction in the blockchain by its ID
func (bc *PowBlockchain) FindTransaction(ID []byte) (Transaction, error) {
	bci := bc.Iterator()

	for {
		block := bci.Next()

		for _, tx := range block.Transactions {
			if bytes.Compare(tx.ID, ID) == 0 {
				return *tx, nil
			}
		}

		if len(block.PrevBlockHash) == 0 {
			break
		}
	}

	return Transaction{}, errors.New("Transaction is not found")
}

// finds unspent outputs for a public key hash, used to get balance
func (bc *PowBlockchain) FindUTXO() map[string]TXOutputs {
	UTXO := make(map[string]TXOutputs)
	spentTXOs := make(map[string][]int)
	bci := bc.Iterator()

	for {
		block := bci.Next()

		for _, tx := range block.Transactions {
			txID := hex.EncodeToString(tx.ID)

		Outputs:
			for outIdx, out := range tx.Vout {
				// Was the output spent?
				// need to check if an output was already referenced in an input
				if spentTXOs[txID] != nil {
					for _, spentOutIdx := range spentTXOs[txID] {
						if spentOutIdx == outIdx {
							continue Outputs
						}
					}
				}

				outs := UTXO[txID]
				outs.Outputs = append(outs.Outputs, out)
				UTXO[txID] = outs
			}

			// gather all inputs that could unlock outputs locked with the provided address
			if !tx.IsCoinbase() {
				for _, in := range tx.Vin {
					inTxID := hex.EncodeToString(in.Txid)
					spentTXOs[inTxID] = append(spentTXOs[inTxID], in.Vout)
				}
			}
		}

		if len(block.PrevBlockHash) == 0 {
			break
		}

	}

	return UTXO
}

func (bc *PowBlockchain) Iterator() *BlockchainIterator {
	bci := &BlockchainIterator{bc.Tip, bc.DB}
	return bci
}

func (bc *PowBlockchain) MineBlock(transactions []*Transaction) *Block {
	var lastHash []byte

	for _, tx := range transactions {
		if bc.VerifyTransaction(tx) != true {
			log.Panic("ERROR: Invalid transaction")
		}
	}

	err := bc.DB.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(blocksBucket))
		lastHash = b.Get([]byte("l"))

		return nil
	})
	if err != nil {
		log.Panic(err)
	}

	newBlock := NewBlock(transactions, lastHash)

	err = bc.DB.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(blocksBucket))
		err := b.Put(newBlock.Hash, newBlock.Serialize())
		if err != nil {
			log.Panic(err)
		}

		err = b.Put([]byte("l"), newBlock.Hash)
		if err != nil {
			log.Panic(err)
		}

		bc.Tip = newBlock.Hash

		return nil
	})
	if err != nil {
		log.Panic(err)
	}

	return newBlock
}

// find transaction it references, and sign it
func (bc *PowBlockchain) SignTransaction(tx *Transaction, privKey ecdsa.PrivateKey) {
	prevTXs := make(map[string]Transaction)

	for _, vin := range tx.Vin {
		prevTX, err := bc.FindTransaction(vin.Txid)
		if err != nil {
			log.Panic(err)
		}
		prevTXs[hex.EncodeToString(prevTX.ID)] = prevTX
	}

	tx.Sign(privKey, prevTXs)
}

// verify the transaction
func (bc *PowBlockchain) VerifyTransaction(tx *Transaction) bool {
	if tx.IsCoinbase() {
		return true
	}

	prevTXs := make(map[string]Transaction)

	for _, vin := range tx.Vin {
		prevTX, err := bc.FindTransaction(vin.Txid)
		if err != nil {
			log.Panic(err)
		}
		prevTXs[hex.EncodeToString(prevTX.ID)] = prevTX
	}

	return tx.Verify(prevTXs)
}

func dbExists() bool {
	if _, err := os.Stat(dbFile); os.IsNotExist(err) {
		return false
	}

	return true
}

// // finds the enough number of outputs holding required amount
// func (bc *PowBlockchain) FindSpendableOutputs(pubKeyHash []byte, amount int) (int, map[string][]int) {
// 	unspentOutputs := make(map[string][]int)
// 	unspentTXs := bc.FindUnspentTransactions(pubKeyHash)
// 	accumulated := 0

// Work:
// 	for _, tx := range unspentTXs {
// 		txID := hex.EncodeToString(tx.ID)

// 		for outIdx, out := range tx.Vout {
// 			if out.IsLockedWithKey([]byte(pubKeyHash)) && accumulated < amount {
// 				accumulated += out.Value
// 				unspentOutputs[txID] = append(unspentOutputs[txID], outIdx)

// 				if accumulated >= amount {
// 					break Work
// 				}
// 			}
// 		}
// 	}

// 	return accumulated, unspentOutputs
// }

// // finds transactions with unspent outputs
// func (bc *PowBlockchain) FindUnspentTransactions(pubKeyHash []byte) []Transaction {
// 	var unspentTXs []Transaction
// 	spentTXOs := make(map[string][]int)
// 	bci := bc.Iterator()

// 	for {
// 		block := bci.Next()

// 		for _, tx := range block.Transactions {
// 			txID := hex.EncodeToString(tx.ID)

// 		Outputs:
// 			for outIdx, out := range tx.Vout {
// 				// Was the output spent?
// 				// need to check if an output was already referenced in an input
// 				if spentTXOs[txID] != nil {
// 					for _, spentOut := range spentTXOs[txID] {
// 						if spentOut == outIdx {
// 							continue Outputs
// 						}
// 					}
// 				}

// 				// check every block in a blockchain
// 				if out.IsLockedWithKey(pubKeyHash) {
// 					unspentTXs = append(unspentTXs, *tx)
// 				}
// 			}

// 			// gather all inputs that could unlock outputs locked with the provided address
// 			if !tx.IsCoinbase() {
// 				for _, in := range tx.Vin {
// 					if in.UsesKey(pubKeyHash) {
// 						inTxID := hex.EncodeToString(in.Txid)
// 						spentTXOs[inTxID] = append(spentTXOs[inTxID], in.Vout)
// 					}
// 				}
// 			}
// 		}

// 		if len(block.PrevBlockHash) == 0 {
// 			break
// 		}
// 	}

// 	return unspentTXs
// }
