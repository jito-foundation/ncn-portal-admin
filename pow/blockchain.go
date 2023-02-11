package pow

type PowBlockchain struct {
	Blocks []*Block
}

func NewPowBlockchain() *PowBlockchain {
	return &PowBlockchain{
		[]*Block{NewGenesisBlock()},
	}
}

func (bc *PowBlockchain) AddBlock(data string) {
	prevBlock := bc.Blocks[len(bc.Blocks)-1]
	newBlock := NewBlock(data, prevBlock.PrevBlockHash)
	bc.Blocks = append(bc.Blocks, newBlock)
}

func NewGenesisBlock() *Block {
	return NewBlock("Genesis Block", []byte{})
}

func (tc *PowBlockchain) validBlock(block Block) {
	// preBlock := tc.Blocks[len(tc.Blocks)-1]
	// block.SetHash()

	// if preBlock.Hash != block.PrevBlockHash {
	// 	panic(fmt.Sprintf("Invalid preHash. expected: %v", preBlock.Hash))
	// } else if expHash.String() != block.Hash {
	// 	panic(fmt.Sprintf("Invalid hash. expected: %v", expHash))
	// }

	// ok := checkHash(block, tc.Difficulty)
	// if !ok {
	// 	panic(fmt.Sprintf("Invalid hash. expected to start from: %v", strings.Repeat("0", int(tc.Difficulty))))
	// }
}

func (tc *PowBlockchain) GenNextBlock() Block {
	// var nonce uint = 0
	// pre := tc.LatestBlock()
	// coinbaseTx := tc.GenCoinbaseTx()

	// ticker := time.NewTicker(1 * time.Second / 32)
	// done := make(chan bool)

	var block = Block{}

	// go func() {
	// 	for {
	// 		select {
	// 		case <-done:
	// 			return
	// 		case t := <-ticker.C:
	// 			data := ""
	// 			block = Block{
	// 				Height:    pre.Height + 1,
	// 				PreHash:   pre.Hash,
	// 				Timestamp: time.Now(),
	// 				Data:      data,
	// 				Nonce:     nonce,
	// 			}

	// 			ok := checkHash(block, tc.Difficulty)
	// 			if ok {
	// 				spentTxs := tc.Pool.txs
	// 				emptyPool := make([]Transaction, len(tc.Pool.txs))
	// 				tc.Pool.txs = emptyPool
	// 				tc.Pool.UpdateUnspentTxs(spentTxs)
	// 				tc.Pool.unspentTxs = append(tc.Pool.unspentTxs, coinbaseTx)
	// 				done <- true
	// 			}
	// 			nonce += 1
	// 			fmt.Println("Tick at", t)
	// 		}
	// 	}
	// }()

	// time.Sleep(1 * time.Second / 32)
	// ticker.Stop()

	return block
}

func checkHash(block Block, difficulty uint) bool {
	// prefix := strings.Repeat("0", int(difficulty))

	// return strings.HasPrefix(block.Hash, prefix)
	return true
}

func (tc *PowBlockchain) StartMining() {
	// for {
	// 	if tc.StopFlg {
	// 		break
	// 	}
	// 	block := tc.GenNextBlock()
	// 	tc.AddBlock(block)
	// 	fmt.Printf("new block mined! block number is %d", block.Height)
	// }
}

func (tc *PowBlockchain) GenCoinbaseTx() Transaction {
	tx := Transaction{}
	// return tc.Wallet.SignTx(tx.NewTransaction("", tc.Wallet.PubKey))
	return tx
}
