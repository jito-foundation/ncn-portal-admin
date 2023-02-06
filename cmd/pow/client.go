package pow

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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
	_, err := os.Create("wallet/wallet.json")
	if err != nil {
		log.Fatal(err)
	}

	content, err := json.Marshal(wallet)
	if err != nil {
		fmt.Println(err)
	}

	err = ioutil.WriteFile("wallet/wallet.json", content, 0644)
	if err != nil {
		log.Fatal(err)
	}
}
