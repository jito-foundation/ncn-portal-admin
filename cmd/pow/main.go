package main

import (
	"fmt"
	"os"
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
			CreateNewWallet()

		case "balance":
			ShowBalance("Hello")

		case "transfer":
			Transfer()

		default:
			fmt.Println("Type again")
		}

	case "server":
		switch command {
		case "chain":
			CreateNewWallet()

		default:
			fmt.Println("Type again")
		}

	default:
		fmt.Println("Type again")
	}
}
