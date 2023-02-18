package pos

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"fmt"
	"hash"
	"log"

	"golang.org/x/crypto/sha3"
)


type Wallet struct {
	PrivateKey ecdsa.PrivateKey
	PublicKey  []byte
}

func NewWallet() *Wallet {
	private, public := newKeyPair()
	wallet := Wallet{private, public}

	return &wallet
}

func (w *Wallet) CreateWallet() string {
	// wallet := NewWallet()
	address := fmt.Sprintf("%s\n", w.GetAddress())

	// ws.Wallets[address] = wallet

	return address
}

func (w Wallet) GetAddress() []byte {
	// pubKeyHash := HashPubKey(w.PublicKey)
	address := PubkeyToAddress(w.PrivateKey.PublicKey)

	fmt.Printf("Pubkeyhash: %s\n", address.String())
	// prepend the version of the address generation algorithm to the hash
	//	versionedPayload := append([]byte{version}, pubKeyHash...)
	//	checksum := checksum(versionedPayload)
	//
	//	fullPayload := append(versionedPayload, checksum...)
	//	address := Base58Encode(fullPayload)
	//
	//	return address
	return []byte{}
}


type KeccakState interface {
	hash.Hash
	Read([]byte) (int, error)
}

func NewKeccakState() KeccakState {
	return sha3.NewLegacyKeccak256().(KeccakState)
}

// func HashPubKey(pubKey []byte) []byte {
// 	b := make([]byte, 32)
// 	d := sha3.NewLegacyKeccak256().(KeccakState)
// 	for _, b := range pubKey {
// 		d.Write(b)
// 	}
// 	hash := sha3.NewLegacyKeccak256()
// 	return hash.Sum(pubKey)
// 	publicSHA256 := sha256.Sum256(pubKey)
//
// 	RIPEMD160Hasher := ripemd160.New()
// 	_, err := RIPEMD160Hasher.Write(publicSHA256[:])
// 	if err != nil {
// 		log.Panic(err)
// 	}
// 	publicRIPEMD160 := RIPEMD160Hasher.Sum(nil)
//
// 	return publicRIPEMD160
// }

func FromECDSAPub(pub *ecdsa.PublicKey) []byte {
	if pub == nil || pub.X == nil || pub.Y == nil {
		return nil
	}
	return elliptic.Marshal(Secp256k1(), pub.X, pub.Y)
}

func PubkeyToAddress(p ecdsa.PublicKey) Address {
	pubBytes := FromECDSAPub(&p)
	return BytesToAddress(Keccak256(pubBytes[1:])[12:])
}

func Keccak256(data ...[]byte) []byte {
	b := make([]byte, 32)
	d := NewKeccakState()
	for _, b := range data {
		d.Write(b)
	}
	d.Read(b)
	return b
}

func ValidateAddress(address string) bool {
	//pubKeyHash := Base58Decode([]byte(address))
	//actualChecksum := pubKeyHash[len(pubKeyHash)-addressChecksumLen:]
	//version := pubKeyHash[0]
	//pubKeyHash = pubKeyHash[1 : len(pubKeyHash)-addressChecksumLen]
	//targetChecksum := checksum(append([]byte{version}, pubKeyHash...))

	//return bytes.Compare(actualChecksum, targetChecksum) == 0
	return true
}

// ECDSA is based on eliptic curves
func newKeyPair() (ecdsa.PrivateKey, []byte) {
	curve := Secp256k1()
	private, err := ecdsa.GenerateKey(curve, rand.Reader)
	if err != nil {
		log.Fatal(err)
	}
	pubKey := append(private.PublicKey.X.Bytes(), private.PublicKey.Y.Bytes()...)

	return *private, pubKey
}

// func checksum(payload []byte) []byte {
// 	firstSHA := sha256.Sum256(payload)
// 	secondSHA := sha256.Sum256(firstSHA[:])
//
// 	return secondSHA[:addressChecksumLen]
// }
