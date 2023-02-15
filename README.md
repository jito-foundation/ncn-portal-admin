# Tiny Chain

## Overview

1. New blockchain

2. Write block

3. Add block

4. Create Block

5. Validate Block, if (Genesis block)

6. Generate Hash

7. Validate Hash

![overview blockchain](./assets/img/Screenshot%20from%202023-02-10%2013-59-14.png)

## Transaction

In Bitcoin, payments are realized in completely different way. There are:

1. No accounts.
2. No balances.
3. No addresses.
4. No coins.
5. No senders and receivers

**Transaction Outputs**

```golang
type TXOutput struct {
	Value 		int
	ScriptPubKey 	string
}
```

value - outputs that store "coins"
ScriptPubKey - will store an arbitrary string (user defined wallet address)

**Transaction Inputs**

```golang
type TXInput struct {
	Txid 		[]byte
	Vout 		int
	ScriptSig 	string
}
```

an input references a previous output:
Txid - stores the ID of such transaction
Vout - stores an index of an output in the transaction
ScriptSig - a script which provides data to be used in an output's ScriptPubKey

## References

- [Build Blockchain from scratch](https://www.youtube.com/watch?v=19zTYCAQRZg)
- https://www.youtube.com/watch?v=GI50JL6JO5k
- https://github.com/openreachtech/tinychain/blob/main/pow/blockchain.js
- https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54#.dttbm9afr5
- https://github.com/AkhilSharma90/GO-proof-of-work-blockchain/blob/master/main.go
