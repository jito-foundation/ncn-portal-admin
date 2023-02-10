package main

import (
	"fmt"
	"net/http"
)

func StartChain() {
	// wallet := readWallet()
	// powChain := pow.NewTinycoin(wallet, 2)

}

func startServer() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello World!")
	})

	http.HandleFunc("/balance/{address}", func(w http.ResponseWriter, r *http.Request) {
		// path := r.URL.Path
		// address := strings.SplitN(path, "/", -1)[1]

	})
}
