package cli

import (
	"fmt"
	"log"

	"github.com/Aoi1011/tinychain/pow"
)

func Send(from, to string, amount int) {
	if !pow.ValidateAddress(from) {
		log.Panic("ERROR: Sender address is not valid")
	}
	if !pow.ValidateAddress(to) {
		log.Panic("ERROR: Recipient address is not valid")
	}

	bc := pow.NewPowBlockchain(from)
	defer bc.DB.Close()

	tx := pow.NewUTXOTransaction(from, to, amount, bc)
	bc.MineBlock([]*pow.Transaction{tx})
	fmt.Println("Success!")
}
