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
	side := os.Args[1]
	command := os.Args[2]

	switch side {
	case "client":
		switch command {
		case "wallet":
			pow.CreateNewWallet()

		case "balance":
			pow.ShowBalance("Hello")

		case "transfer":
			pow.Transfer()

		default:
			fmt.Println("Type again")
		}

	case "server":
		switch command {
		case "chain":
			pow.CreateNewWallet()

		default:
			fmt.Println("Type again")
		}

	default:
		fmt.Println("Type again")
	}
}
