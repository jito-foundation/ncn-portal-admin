package pow

import "bytes"

type TXInput struct {
	Txid      []byte
	Vout      int
	Signature []byte
	PubKey    []byte
}

// The UsesKey method checks that an input uses a specific key to unlock an output
func (in *TXInput) UsesKey(publicKeyHash []byte) bool {
	lockingHash := HashPubKey(in.PubKey)

	return bytes.Compare(lockingHash, publicKeyHash) == 0
}
