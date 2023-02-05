package pow

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"strings"
	"time"
)

type Tinycoin struct {
	blocks     []Block
	pool       []TxPool
	wallet     Wallet
	difficulty uint
	stopFlg    bool
}

func (tc *Tinycoin) LatestBlock() Block {
	len := len(tc.blocks)
	return tc.blocks[len-1]
}

func (tc *Tinycoin) AddBlock(newBlock Block) {
	tc.validBlock(newBlock)
	tc.blocks = append(tc.blocks, newBlock)
}

func (tc *Tinycoin) validBlock(block Block) {
	preBlock := tc.LatestBlock()
	expHash := HashBlock(block.height, block.preHash, block.timestamp, block.data, block.nonce)

	if preBlock.height+1 != block.height {
		panic(fmt.Sprintf("Invalid height. expected: %v", preBlock.height+1))
	} else if preBlock.hash != block.preHash {
		panic(fmt.Sprintf("Invalid preHash. expected: %v", preBlock.hash))
	} else if expHash != block.hash {
		panic(fmt.Sprintf("Invalid hash. expected: %v", expHash))
	}

	for i, val := range block.hash {
		if val != rune(0) {
			panic(fmt.Sprintf("Invalid hash. expected to start from: %v", strings.Repeat("0", int(tc.difficulty))))
		}

		if uint(i)+1 > tc.difficulty {
			break
		}
	}
}

func (tc *Tinycoin) GenNextBlock() {
	nonce := 0
	pre := tc.LatestBlock()
	conbaseTx := tc.GenCoinbaseTx()

	ticker := time.NewTicker(5 * time.Millisecond / 32)
	done := make(chan bool)

	go func() {
		for {
			select {
			case <-done:
				return
			case t := <-ticker.C:
				fmt.Println("Tick at", t)
			}
		}
	}()
}

func (tc *Tinycoin) GenCoinbaseTx() Transaction {
	tx := Transaction{}
	return tc.wallet.SignTx(tx.NewTransaction("", tc.wallet.pubKey))
}

type Block struct {
	height    uint
	preHash   string
	timestamp uint
	data      string
	nonce     uint
	hash      string
}

func HashBlock(height uint, preHash string, timestamp uint, data string, nonce uint) string {
	h := crypto.SHA256.New()

	h.Write([]byte(fmt.Sprintf("%v,%v,%v,%v,%v", height, preHash, timestamp, data, nonce)))

	return fmt.Sprintf("%x", h.Sum(nil))
}

type Transaction struct {
	inHash  string
	inSig   string
	outAddr ecdsa.PublicKey
	hash    string
}

func (t *Transaction) NewTransaction(inHash string, outAddr ecdsa.PublicKey) Transaction {
	return Transaction{
		inHash:  inHash,
		outAddr: outAddr,
		inSig:   "",
		hash:    HashTransaction(inHash, outAddr),
	}
}

func HashTransaction(inHash string, outAddr ecdsa.PublicKey) string {
	h := crypto.SHA256.New()

	h.Write([]byte(fmt.Sprintf("%v,%v", inHash, outAddr)))

	return fmt.Sprintf("%x", h.Sum(nil))
}

type TxPool struct {
	txs        []Transaction
	unspentTxs []Transaction
}

func (tp *TxPool) AddTx(newTx Transaction) {
	tp.ValidateTx(tp.unspentTxs, newTx)
	tp.txs = append(tp.txs, newTx)
}

func (tp *TxPool) BalanceOf(address ecdsa.PublicKey) int {
	var tempTxs []Transaction

	for _, unspentTx := range tp.unspentTxs {
		if unspentTx.outAddr == address {
			tempTxs = append(tempTxs, unspentTx)
		}
	}

	return len(tempTxs)
}

func (tp *TxPool) UpdateUnspentTxs(spentTxs []Transaction) {
	for _, spentTx := range spentTxs {
		// check tx was spent
		var index = -1
		for i, unspentTx := range tp.unspentTxs {
			if unspentTx.hash == spentTx.inHash {
				index = i
			}
		}

		if index == -1 {
			return
		}

		// remove from unspent txs
		tp.unspentTxs = append(tp.unspentTxs[:index], tp.unspentTxs[index+1:]...)
	}

	tp.unspentTxs = append(tp.unspentTxs, spentTxs...)
}

func (tp *TxPool) ValidateTx(unspentTxs []Transaction, tx Transaction) {
	// check hash value
	if tx.hash != HashTransaction(tx.inHash, tx.outAddr) {
		panic(fmt.Sprintf("Invalid hash. expected: %v", HashTransaction(tx.inHash, tx.outAddr)))
	}

	// check tx whether already spent
	var found = false
	var exTx Transaction
	for _, unspentTx := range unspentTxs {
		if unspentTx.hash == tx.inHash {
			exTx = unspentTx
			found = true
			break
		}
	}

	if !found {
		panic(fmt.Sprintf("Tx is not found"))
	}

	// check signature is valid
	tp.ValidateSig(tx, exTx.outAddr)
}

func (tp *TxPool) ValidateSig(tx Transaction, address ecdsa.PublicKey) bool {
	return ecdsa.VerifyASN1(&address, []byte(tx.hash), []byte(tx.inSig))
}

type Wallet struct {
	priKey ecdsa.PrivateKey
	pubKey ecdsa.PublicKey
}

func (w *Wallet) SignTx(tx Transaction) Transaction {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		panic(err)
	}

	msg := "hello, world"
	hash := sha256.Sum256([]byte(msg))

	sig, err := ecdsa.SignASN1(rand.Reader, privateKey, hash[:])
	if err != nil {
		panic(err)
	}
	tx.inSig = string(sig)

	return tx
	// fmt.Printf("signature: %x\n", sig)

}

// func toHexString(bytes []byte) string {

// }
