package pos

import "fmt"

	const subsidy = 10

type Transaction struct {
	From      Address
	To        Address
	Amount    uint
	Signature []byte
	hash      []byte
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
