package cli

import (
	"fmt"
	"log"

	"github.com/Aoi1011/tinychain/pow"
)

func ListAddresses() {
	wallets, err := pow.NewWallets()
	if err != nil {
		log.Panic(err)
	}
	addresses := wallets.GetAddresses()

	for _, address := range addresses {
		fmt.Println(address)
	}

}
