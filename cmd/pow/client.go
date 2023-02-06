package pow

import (
	"fmt"
	"log"
	"os"

	"github.com/Aoi1011/tinychain/pow"
)

func CreateNewWallet() {
	wallet := pow.Wallet{}
	wallet.New()

	fmt.Printf("wallet address is %s", wallet.PubKey)

	if err := os.Mkdir("wallet", os.ModePerm); err != nil {
		log.Fatal(err)
	}
	os.Create("wallet/wallet.json")
}
