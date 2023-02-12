package main

import (
	"github.com/Aoi1011/tinychain/pow"
)

func main() {
	bc := pow.NewPowBlockchain()

	defer bc.DB.Close()

	cli := pow.CLI{bc}
	cli.Run()
}
