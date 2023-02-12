package main

import (
	"sync"

	"github.com/Aoi1011/tinychain/pow"
)

const difficulty = 1

type Block struct {
	Index      int
	Timestamp  string
	Data       int
	Hash       string
	PrevHash   string
	Difficulty int
	Nonce      string
}

var Blockchain []Block

type Message struct {
	Data int
}

var mutex = &sync.Mutex{}

func main() {
	bc := pow.NewPowBlockchain()

	defer bc.DB.Close()

	cli := pow.CLI{bc}
	cli.Run()

}
