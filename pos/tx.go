package pos

import (
	"bytes"
	"crypto/sha256"
	"encoding/gob"
	"fmt"
	"log"
)

const subsidy = 10

type Transaction struct {
	From      Address
	To        Address
	Amount    uint
	Signature []byte
	hash      []byte
}

func (tx Transaction) IsCoinbase() bool {
	return true
}

func (tx Transaction) Serialize() []byte {
	var encoded bytes.Buffer

	enc := gob.NewEncoder(&encoded)
	err := enc.Encode(tx)
	if err != nil {
		log.Panic(err)
	}

	return encoded.Bytes()
}

func (tx *Transaction) Hash() []byte {
	var hash [32]byte

	txCopy := *tx

	hash = sha256.Sum256(txCopy.Serialize())

	return hash[:]

}

func NewCoinbaseTx(data string, to Address) *Transaction {
	if data == "" {
		data = fmt.Sprintf("Reward to %s", to.String())
	}

	tx := Transaction{
		From:      Address{},
		To:        to,
		Amount:    subsidy,
		Signature: []byte{},
		hash:      []byte{},
	}

	return &tx
}
