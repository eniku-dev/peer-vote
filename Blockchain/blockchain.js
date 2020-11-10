const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Vote {

  constructor(voter, cand, hasVoted) {
    this.voter = voter;
    this.cand = cand;
    this.hasVoted = hasVoted;
    this.timestamp = Date.now();
  }

  /**
   * Creates a SHA256 hash of the votes
   */
  calculateHash() {
    return crypto.createHash('sha256').update(this.voter + this.cand + this.hasVoted + this.timestamp).digest('hex');
  }

  /**
   * Signs a vote with the given signingKey (which is an Elliptic keypair
   * object that contains a private key). The signature is then stored inside the
   * votes object and later stored on the blockchain.
   */
  signVote(signingKey) {
    // You can only vote from the account that is linked to your
    // key. So here we check if the voter matches your publicKey
    if (signingKey.getPublic('hex') !== this.voter) {
      throw new Error('wrong signing key used!');
    }
    

    // Calculate the hash of this vote, sign it with the key
    // and store it inside the vote object
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signature = sig.toDER('hex');
  }

  /**
   * Checks if the signature is valid (vote has not been tampered with).
   * It uses the voter as the public key.
   */
  isValid() {
    // If the votes doesn't have a voter address we throw an error
    if (this.voter === null){
        throw new Error("there must be a voter address")
    }

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this vote');
    }

    const publicKey = ec.keyFromPublic(this.voter, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  
  constructor(timestamp, votes, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.votes = votes;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   */
  calculateHash() {
    return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.votes) + this.nonce).digest('hex');
  }

  /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   */
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

   // debug(`Block mined: ${this.hash}`);
   console.log(`Block mined: ${this.hash}`)
  }

  /**
   * Validates all the votes inside this block (signature + hash) and
   * returns true if everything checks out. False if the block is invalid.
   */
  hasValidVotes() {
    for (const tx of this.votes) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingVotes = [];
   // this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.parse('2020-08-11'), [], '0');
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Takes all the pending votes, puts them in a Block and starts the
   * mining process.
   */
  //miningRewardAddress
  minePendingVotes() {
    const block = new Block(Date.now(), this.pendingVotes, this.getLatestBlock().hash);
    
    block.mineBlock(this.difficulty);
    console.log('Block successfully mined!');
    
    this.chain.push(block);
    
    this.pendingVotes = [];
    
    return block;
  }

  /**
   * Add a new vote to the list of pending votes (to be added
   * next time the mining process starts). This verifies that the given
   * vote is properly signed.
   */
  addVotes(vote) {
    if (!vote.voter || !vote.cand) {
      throw new Error('Votes must include a voter and a candidate');
    }

    // Verify the transactiion
    if (!vote.isValid()) {
      throw new Error('Cannot add invalid Votes to chain');
    }
    
    this.pendingVotes.push(vote);
    
  }

  /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) votes inside of them.
   */
  isChainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];

      if (!currentBlock.hasValidVotes()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Vote = Vote;