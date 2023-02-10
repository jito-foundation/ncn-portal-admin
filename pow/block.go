package pow

import (
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

type Block struct {
	Height    uint      `json:"height"`
	PreHash   string    `json:"pre_hash"`
	Timestamp time.Time `json:"timestamp"`
	Data      string    `json:"data"`
	Nonce     uint      `json:"nonce"`
	Hash      string    `json:"hash"`
}

func NewBlock() *Block {
	return &Block{
		Height:    0,
		PreHash:   "0",
		Timestamp: time.Now(),
		Data:      "{}",
		Nonce:     0,
		Hash:      HashBlock(0, "0", time.Now(), "{}", 0).String(),
	}
}

func HashBlock(height uint, preHash string, timestamp time.Time, data string, nonce uint) common.Hash {
	return crypto.Keccak256Hash(
		[]byte(fmt.Sprintf("%v,%v,%v,%v,%v", height, preHash, timestamp, data, nonce)))
}
