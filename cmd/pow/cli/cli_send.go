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

	bc := pow.NewPowBlockchain()
	UTXOSet := pow.UTXOSet{
		PowBlockchain: bc,
	}
	defer bc.DB.Close()

	tx := pow.NewUTXOTransaction(from, to, amount, &UTXOSet)
	cbTx := pow.NewCoinbaseTx(from, "")
	txs := []*pow.Transaction{cbTx, tx}

	newBlock := bc.MineBlock(txs)
	UTXOSet.Update(newBlock)
	fmt.Println("Success!")
}
