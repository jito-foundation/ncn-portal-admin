package main

import (
	"fmt"
	"net/http"
)

func CreateNewWallet() {
	// wallet := pow.Wallet{}
	// wallet.New()

	// fmt.Printf("wallet address is %s", wallet.PubKey)

	// if err := os.Mkdir("wallet", os.ModePerm); err != nil {
	// 	log.Fatal(err)
	// }
	// _, err := os.Create("wallet/wallet.json")
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// content, err := json.Marshal(wallet)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// err = ioutil.WriteFile("wallet/wallet.json", content, 0644)
	// if err != nil {
	// 	log.Fatal(err)
	// }
}

func ShowBalance(addr string) {
	requestURL := fmt.Sprintf("http://localhost:3000/balance/%s", addr)
	res, err := http.Get(requestURL)
	if err != nil {
		fmt.Printf("error making http request: %s\n", err)
	}

	fmt.Printf("client: got response")
	fmt.Printf("response: %s\n", res.Status)
}

func Transfer() {
	// wallet := readWallet()

	// requestURL := fmt.Sprintf("http://localhost:3000/unspentTxs")
	// res, err := http.Get(requestURL)
	// if err != nil {
	// 	fmt.Printf("error making http request: %s\n", err)
	// }

	// defer res.Body.Close()

	// txs := []pow.Transaction{}
	// err = json.NewDecoder(res.Body).Decode(&txs)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// var unspentTx pow.Transaction
	// for _, tx := range txs {
	// 	if tx.OutAddr == wallet.PubKey {
	// 		unspentTx = tx
	// 	}
	// }

	// requestURL = fmt.Sprintf("http://localhost:3000/sendTransaction")
	// txBytes, err := json.Marshal(unspentTx)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// r, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(txBytes))
	// if err != nil {
	// 	panic(err)
	// }

	// r.Header.Add("Content-Type", "application/json")

	// client := http.Client{}
	// response, err := client.Do(r)
	// if err != nil {
	// 	panic(err)
	// }

	// fmt.Printf("Response: %s", response.Status)
}
