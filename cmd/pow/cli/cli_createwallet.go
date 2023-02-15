package cli

import (
	"fmt"

	"github.com/Aoi1011/tinychain/pow"
)

func CreateWallet() {
	wallets, _ := pow.NewWallets()
	address := wallets.CreateWallet()
	wallets.SaveToFile()

	fmt.Printf("Your new address: %s\n", address)
}
