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
	command := os.Args[1]

	switch command {
	case "wallet":
		fmt.Printf("%s", command)
	case "balance":
		fmt.Printf("%s", command)
	case "transfer":
		fmt.Printf("%s", command)
	default:
		fmt.Printf("Type again")
	}
}
