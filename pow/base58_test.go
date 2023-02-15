package pow

import (
	"encoding/hex"
	"log"
	"testing"

	"gotest.tools/v3/assert"
)

func TestBase58(t *testing.T) {
	rawHash := "00010966776006953D5567439E5E39F86A0D273BEED61967F6"
	hash, err := hex.DecodeString(rawHash)
	if err != nil {
		log.Fatal(err)
	}

	encoded := Base58Encode(hash)
	assert.Equal(t, "16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM", string(encoded))
}
