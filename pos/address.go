package pos

import (
	"encoding/hex"

	"golang.org/x/crypto/sha3"
)

const (
	AddressLength = 20
)

type Address [AddressLength]byte

func BytesToAddress(b []byte) {
	var a Address
	a.SetBytes(b)
	return a
}

func (a Address) Hex() string {
	return string(a.checksumHex())
}

func (a Address) String() string {
	return a.Hex()
}

func (a *Address) checksumHex() []byte {
	buf := a.hex()

	sha := sha3.NewLegacyKeccak256()
	sha.Write(buf[:2])
	hash := sha.Sum(nil)
	for i := 2; i < len(buf); i++ {
		hashByte := hash[(i-2)/2]
		if i%2 == 0 {
			hashByte = hashByte >> 4
		} else {
			hashByte &= 0xf
		}
		if buf[1] > '9' && hashByte > 7 {
			buf[i] -= 32
		}
	}

	return buf[:]
}

func (a *Address) hex() []byte {
	var buf [len(a)*2 + 2]byte
	copy(buf[:2], "0x")
	hex.Encode(buf[2:], a[:])
	return buf[:]
}

func (a *Address) SetBytes(b []byte) {
	if len(b) > len(a) {
		b = b[len(b)-AddressLength:]
	}
	copy(a[AddressLength-len(b):], b)
}
