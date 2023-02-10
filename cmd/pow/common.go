package main

import (
	"encoding/json"
	"io/ioutil"
	"log"

	"github.com/Aoi1011/tinychain/pow"
)

func readWallet() pow.Wallet {
	content, err := ioutil.ReadFile("wallet/wallet.json")
	if err != nil {
		log.Fatal(err)
	}

	wallet := pow.Wallet{}
	err = json.Unmarshal(content, &wallet)
	if err != nil {
		log.Fatal(err)
	}

	return wallet
}
