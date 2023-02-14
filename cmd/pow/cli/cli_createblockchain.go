package cli

import (
	"fmt"
	"log"

	"github.com/Aoi1011/tinychain/pow"
)

func CreateBlockchain(address string) {
	if !pow.ValidateAddress(address) {
		log.Panic("ERROR: Address is not valid")
	}
	bc := pow.CreatePowBlockchain(address)
	defer bc.DB.Close()

	UTXOSet := pow.UTXOSet{
		PowBlockchain: bc,
	}
	UTXOSet.Reindex()

	fmt.Println("Done!")
}
