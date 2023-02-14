package cli

import (
	"fmt"

	"github.com/Aoi1011/tinychain/pow"
)

func CreateBlockchain(address string) {
	bc := pow.CreatePowBlockchain(address)
	bc.DB.Close()

	UTXOSet := pow.UTXOSet{
		PowBlockchain: bc,
	}
	UTXOSet.Reindex()

	fmt.Println("Done!")
}
