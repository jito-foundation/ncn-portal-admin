package pow

import (
	"fmt"
	"strings"
	"time"
)

type PowBlockchain struct {
	Blocks     []Block
	Pool       TxPool
	Wallet     Wallet
	Difficulty uint
	StopFlg    bool
}

func NewPowBlockchain(wallet Wallet, difficulty uint) *PowBlockchain {
	return &PowBlockchain{
		Blocks:     []Block{*NewBlock()},
		Pool:       *NewTxPool(),
		Wallet:     wallet,
		Difficulty: difficulty,
		StopFlg:    false,
	}
}

func (tc *PowBlockchain) LatestBlock() Block {
	len := len(tc.Blocks)
	return tc.Blocks[len-1]
}

func (tc *PowBlockchain) AddBlock(newBlock Block) {
	tc.validBlock(newBlock)
	tc.Blocks = append(tc.Blocks, newBlock)
}

func (tc *PowBlockchain) validBlock(block Block) {
	preBlock := tc.LatestBlock()
	expHash := HashBlock(block.Height, block.PreHash, block.Timestamp, block.Data, block.Nonce)

	if preBlock.Height+1 != block.Height {
		panic(fmt.Sprintf("Invalid height. expected: %v", preBlock.Height+1))
	} else if preBlock.Hash != block.PreHash {
		panic(fmt.Sprintf("Invalid preHash. expected: %v", preBlock.Hash))
	} else if expHash.String() != block.Hash {
		panic(fmt.Sprintf("Invalid hash. expected: %v", expHash))
	}

	ok := checkHash(block, tc.Difficulty)
	if !ok {
		panic(fmt.Sprintf("Invalid hash. expected to start from: %v", strings.Repeat("0", int(tc.Difficulty))))
	}
}

func (tc *PowBlockchain) GenNextBlock() Block {
	var nonce uint = 0
	pre := tc.LatestBlock()
	coinbaseTx := tc.GenCoinbaseTx()

	ticker := time.NewTicker(1 * time.Second / 32)
	done := make(chan bool)

	var block = Block{}

	go func() {
		for {
			select {
			case <-done:
				return
			case t := <-ticker.C:
				data := ""
				block = Block{
					Height:    pre.Height + 1,
					PreHash:   pre.Hash,
					Timestamp: time.Now(),
					Data:      data,
					Nonce:     nonce,
				}

				ok := checkHash(block, tc.Difficulty)
				if ok {
					spentTxs := tc.Pool.txs
					emptyPool := make([]Transaction, len(tc.Pool.txs))
					tc.Pool.txs = emptyPool
					tc.Pool.UpdateUnspentTxs(spentTxs)
					tc.Pool.unspentTxs = append(tc.Pool.unspentTxs, coinbaseTx)
					done <- true
				}
				nonce += 1
				fmt.Println("Tick at", t)
			}
		}
	}()

	// time.Sleep(1 * time.Second / 32)
	// ticker.Stop()

	return block
}

func checkHash(block Block, difficulty uint) bool {
	for i, val := range block.Hash {
		if val != rune(0) {
			return false
		}

		if uint(i)+1 > difficulty {
			break
		}
	}
	return true
}

func (tc *PowBlockchain) StartMining() {
	for {
		if tc.StopFlg {
			break
		}
		block := tc.GenNextBlock()
		tc.AddBlock(block)
		fmt.Printf("new block mined! block number is %d", block.Height)
	}
}

func (tc *PowBlockchain) GenCoinbaseTx() Transaction {
	tx := Transaction{}
	return tc.Wallet.SignTx(tx.NewTransaction("", tc.Wallet.PubKey))
}
