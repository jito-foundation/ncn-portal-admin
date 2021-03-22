use blockchainlib::*;

fn main() {
    let mut block = Block::new(0, 0, vec![0; 32], 0, "Genesis Block".to_owned(), 0x00fffffffffffffffffffffffffffff);

    block.hash = block.hash();



    println!("{:?}", &block);

    block.mine();

    println!("{:?}", &block);
}
