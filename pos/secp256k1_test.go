package pos

import (
	"crypto/elliptic"
	"testing"

	"gotest.tools/v3/assert"
)

func TestSecp256k1(t *testing.T) {
	_, ok := Secp256k1().(elliptic.Curve)
	assert.Assert(t, ok, "returns the secp256k1 curve")
}
