package main

import (
	"fmt"

	"github.com/Aoi1011/tinychain/pow"
)

func (cli *CLI) createBlockchain(address string) {
	bc := pow.CreatePowBlockchain(address)
	bc.DB.Close()
	fmt.Println("Done!")
}
