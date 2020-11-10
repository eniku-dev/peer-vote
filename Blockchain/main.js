const { Blockchain, Vote } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('dadf0f321c18f1f58bbc94e54fd0f3b3833152da093baac09a33066161459dd7');

// From that we can calculate your public key (which doubles as your voter address)
const myVoterAddress = myKey.getPublic('hex');




// Create new instance of Blockchain class
const app = new Blockchain();

app.getAllVotes()

/*
// Create a vote & sign it with your key
const tx1 = new Vote(myVoterAddress, 'cand two', true);
tx1.signVote(myKey);
app.addVotes(tx1);

// Mine block
app.minePendingVotes();

// Create second vote
const tx2 = new Vote(myVoterAddress, 'cand one', true);
tx2.signVote(myKey);
app.addVotes(tx2);

// Mine block
app.minePendingVotes();
/*
console.log();
console.log(`cand one votes ${app.getCandVotes("cand two")}`);

// Uncomment this line if you want to test tampering with the chain
// app.chain[1].transactions[0].amount = 10;


console.log()
console.log('all the votes ' ,app.getAllVotes())
*/
// Check if the chain is valid
console.log();
console.log('Blockchain valid?', app.isChainValid() ? 'Yes' : 'No');
//*/