package cli

import (
	"fmt"
	"log"

	"github.com/Aoi1011/tinychain/pow"
)

func GetBalance(address string) {
	if !pow.ValidateAddress(address) {
		log.Panic("ERROR: Address is not valid")
	}

	bc := pow.NewPowBlockchain(address)
	defer bc.DB.Close()

	balance := 0
	pubKeyHash := pow.Base58Decode([]byte(address))
	pubKeyHash = pubKeyHash[1 : len(pubKeyHash)-4]
	UTXOs := bc.FindUTXO(pubKeyHash)

	for _, out := range UTXOs {
		balance += out.Value
	}

	fmt.Printf("Balance of '%s': %d\n", address, balance)
}
