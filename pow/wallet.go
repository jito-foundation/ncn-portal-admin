package pow

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

type Wallet struct {
	PriKey ecdsa.PrivateKey `json:"pri_key"`
	PubKey string           `json:"pub_key"`
}

func (w *Wallet) New() {
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		fmt.Printf("%v", err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("cannot assert type: publicKey is not of type *esdsa.PublicKey")
	}

	publicKeyBytes := crypto.FromECDSAPub(publicKeyECDSA)

	w.PriKey = *privateKey
	w.PubKey = hexutil.Encode(publicKeyBytes)
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
	tx.InSig = string(sig)

	return tx
	// fmt.Printf("signature: %x\n", sig)

}
