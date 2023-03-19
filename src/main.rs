use sha256::digest;

#[derive(Debug)]
pub struct Block {
    index: u32,
    timestamp: u32,
    data: String,
    previous_hash: String,
    hash: String,
}

impl Block {
    pub fn new(index: u32, timestamp: u32, data: String, previous_hash: String) -> Self {
        Block {
            index,
            timestamp,
            data: data.clone(),
            previous_hash: previous_hash.clone(),
            hash: "".to_string(),
        }
    }

    pub fn calculate_hash(&self) -> String {
        let input = format!(
            "{}{}{}{}",
            self.index, self.timestamp, self.data, self.previous_hash
        );
        digest(input)
    }
}

#[derive(Debug)]
pub struct Blockchain {
    chain: Vec<Block>,
}

impl Blockchain {
    pub fn new() -> Self {
        Blockchain {
            chain: vec![Self::create_genesis_block()],
        }
    }

    fn create_genesis_block() -> Block {
        // 2020-01-01 00:00:00
        let mut genesis_block = Block::new(0, 1577804400, "".to_string(), "".to_string());
        genesis_block.hash = genesis_block.calculate_hash();
        genesis_block
    }

    pub fn get_latest_block(&self) -> &Block {
        &self.chain[self.chain.len() - 1]
    }

    pub fn add_block(&mut self, new_block: Block) {
        let mut new_block = new_block;
        new_block.previous_hash = self.get_latest_block().hash.clone();
        new_block.hash = new_block.calculate_hash();
        self.chain.push(new_block);
    }

    pub fn is_chain_valid(&self) -> bool {
        let len = self.chain.len();
        for index in 1..=len {
            let current_block = &self.chain[index];
            let prev_block = &self.chain[index - 1];

            if current_block.hash != current_block.calculate_hash() {
                return false;
            }

            if current_block.previous_hash != prev_block.hash {
                return false;
            }
        }
        true
    }
}

fn main() {
    let mut blockchain = Blockchain::new();

    blockchain.add_block(Block::new(
        1,
        1577804401,
        "Hello".to_string(),
        "".to_string(),
    ));

    println!("{:?}", blockchain);
}
