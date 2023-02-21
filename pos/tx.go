package pos

import (
	"bytes"
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

func NewCoinbaseTx(data string, to Address) *Transaction {
	if data == "" {
		data = fmt.Sprintf("Reward to %s", to.String())
	}	

	tx := Transaction {
		From: Address{},
		To: to,
		Amount: subsidy,
		Signature: []byte{},
		hash: []byte{},
	}

	return &tx
}
