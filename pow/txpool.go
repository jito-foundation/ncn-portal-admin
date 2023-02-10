package pow

import (
	"crypto/ecdsa"
	"fmt"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

type TxPool struct {
	txs        []Transaction
	unspentTxs []Transaction
}

func NewTxPool() *TxPool {
	return &TxPool{
		txs:        []Transaction{},
		unspentTxs: []Transaction{},
	}
}

func (tp *TxPool) AddTx(newTx Transaction) {
	tp.ValidateTx(tp.unspentTxs, newTx)
	tp.txs = append(tp.txs, newTx)
}

func (tp *TxPool) BalanceOf(address string) int {
	var tempTxs []Transaction

	for _, unspentTx := range tp.unspentTxs {
		if unspentTx.OutAddr == address {
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
			if unspentTx.Hash == spentTx.InHash {
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
	if tx.Hash != HashTransaction(tx.InHash, tx.OutAddr).String() {
		panic(fmt.Sprintf("Invalid hash. expected: %v", HashTransaction(tx.InHash, tx.OutAddr)))
	}

	// check tx whether already spent
	var found = false
	var exTx Transaction
	for _, unspentTx := range unspentTxs {
		if unspentTx.Hash == tx.InHash {
			exTx = unspentTx
			found = true
			break
		}
	}

	if !found {
		panic(fmt.Sprintf("Tx is not found"))
	}

	// check signature is valid
	tp.ValidateSig(tx, exTx.OutAddr)
}

func (tp *TxPool) ValidateSig(tx Transaction, address string) bool {
	publicKeyBytes, err := hexutil.Decode(address)
	if err != nil {
		fmt.Printf("Fail to decode address")
		return false
	}

	pubKey, err := crypto.ToECDSA(publicKeyBytes)
	if err != nil {
		fmt.Printf("Fail to ECDSA")
		return false
	}
	return ecdsa.VerifyASN1(&pubKey.PublicKey, []byte(tx.Hash), []byte(tx.InSig))
}
