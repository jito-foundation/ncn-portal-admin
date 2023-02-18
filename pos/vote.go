package pos

type Vote struct {
	Height    uint
	BlockHash []byte
	Voter     Address
	IsYes     bool
	Signature []byte
	Hash      []byte
}
