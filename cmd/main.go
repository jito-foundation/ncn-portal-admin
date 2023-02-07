package main

import (
	"fmt"
	"os"

	"github.com/Aoi1011/tinychain/cmd/pow"
)

type Student struct {
	name   string
	rollno int
	phone  int64
	city   string
}

func main() {
	command := os.Args[1]

	switch command {
	case "wallet":
		pow.CreateNewWallet()
	case "balance":
		pow.ShowBalance("Hello")
	case "transfer":
		fmt.Printf("%s", command)
	default:
		fmt.Printf("Type again")
	}
}
