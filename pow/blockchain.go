package pow

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"strings"
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

// func (tc *Tinycoin) GenNextBlock() {
// 	nonce := 0
// 	pre := tc.LatestBlock()
// 	conbaseTx
// }

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
	outAddr string
	hash    string
}

func (t *Transaction) HashTransaction(inHash string, outAddr string) string {
	h := crypto.SHA256.New()

	h.Write([]byte(fmt.Sprintf("%v,%v", inHash, outAddr)))

	return fmt.Sprintf("%x", h.Sum(nil))
}

type TxPool struct{}

type Wallet struct {
	priKey ecdsa.PrivateKey
	pubKey ecdsa.PublicKey
}

func (w *Wallet) SignTx() {
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
	fmt.Printf("signature: %x\n", sig)

	valid := ecdsa.VerifyASN1(&privateKey.PublicKey, hash[:], sig)
	fmt.Println("signature verified:", valid)
}

// func toHexString(bytes []byte) string {

// }
