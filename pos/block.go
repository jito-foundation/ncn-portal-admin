package pos

import "time"

type Block struct {
	Height       uint
	PrevBlockHash      []byte
	Timestamp    int64
	Transactions []*Transaction
	Proposer     Address
	StateRoot    string
	Votes        []*Vote
	Signature    []byte
	Hash         []byte
}

func NewBlock(height uint, transactioins []*Transaction, prevBlockHash []byte) *Block {
	block := Block {
		Height: height,
		PrevBlockHash: prevBlockHash,
		Timestamp: time.Now().Unix(),
		Transactions: transactioins,
		Proposer: Address{},
		StateRoot: "",
		Signature: []byte{},
		Hash: []byte{},
	}

	return &block
}
