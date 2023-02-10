package pow

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

type Transaction struct {
	InHash  string `json:"in_hash"`
	InSig   string `json:"in_sig"`
	OutAddr string `json:"out_addr"`
	Hash    string `json:"hash"`
}

func (t *Transaction) NewTransaction(inHash string, outAddr string) Transaction {
	return Transaction{
		InHash:  inHash,
		OutAddr: outAddr,
		InSig:   "",
		Hash:    HashTransaction(inHash, outAddr).String(),
	}
}

func (t *Transaction) String() string {
	txBytes, err := json.Marshal(t)
	if err != nil {
		log.Fatal(err)
	}
	return string(txBytes)
}

func HashTransaction(inHash string, outAddr string) common.Hash {
	return crypto.Keccak256Hash([]byte(fmt.Sprintf("%v,%v", inHash, outAddr)))
}
