const express = require('express')

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Blockchain, Vote } = require('./blockchain');

const crypto = require('crypto-js');

const EC = require('elliptic').ec;

// You can use any elliptic curve you want
const ec = new EC('secp256k1');

// Generate a new key pair and convert them to hex-strings
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');
const keys = {publicKey: publicKey,privateKey: privateKey}

//pouch db
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var db = new PouchDB('db');

// Your private key goes here
//const myKey = ec.keyFromPrivate('dadf0f321c18f1f58bbc94e54fd0f3b3833152da093baac09a33066161459dd7');

// From that we can calculate your public key (which doubles as your voter address)
//const myVoterAddress = myKey.getPublic('hex');




// Create new instance of Blockchain class
const block = new Blockchain();

/*create key
app.get('/keys',(req,res) => {
    //res.send(keys)
    /*db.post({
        // id: 'mydoc',
         title: 'Heroes'
       }).then(function (response) {
         // handle response
         console.log(response)
       }).catch(function (err) {
         console.log(err);
       });
      
      db.get('7cdedb29-3f81-4b8e-8cb0-94789688f54d').then(function (doc) {
        // handle doc
        console.log(doc)
      }).catch(function (err) {
        console.log(err);
      });
       
      db.allDocs({
        include_docs: true,
        attachments: true
      }).then(function (result) {
        res.send(result)
      }).catch(function (err) {
        console.log(err);
      });

})
*/

//get all votes
app.get('/getVotes', (req, res) => {
     db.allDocs({
        include_docs: true,
        attachments: true
      }).then(function (result) {
        let votes =[]
        let i = 0
        result.rows.forEach(n => {
          n.doc.votes.forEach(s => {
            votes.push(s.cand)
          })
        })
        
        res.send(votes)
      }).catch(function (err) {
        console.log(err);
      });
});

//check if user has voted before
app.post('/checkUser',(req,res,next) => {
     const hasVoted = crypto.SHA256(req.body.id).toString()
     
      db.allDocs({
        include_docs: true
      }).then(function (result) {
        result.rows.forEach(n => { 
          n.doc.votes.forEach(s => {
            if(s.hasVoted === hasVoted){
              return res.send(true)
            }
          })
        })
        res.send(false)
      }).catch(function (err) {
        console.log(err);
      });
})

//post votes
app.post('/vote', (req,res,next) => {    
    const myKey = ec.keyFromPrivate(keys.privateKey);

    // From that we can calculate your public key (which doubles as your voter address) 
    const myVoterAddress = myKey.getPublic('hex');
    const hasVoted = crypto.SHA256(req.body.hasVoted).toString()
    const tx1 = new Vote(myVoterAddress, req.body.cand, hasVoted);
    tx1.signVote(myKey);
      
    if(block.addVotes(tx1) == null){
       
       db.post(block.minePendingVotes()).then(function (response) {
         // handle response
            res.sendStatus('200')
       }).catch(function (err) {
         console.log(err);
       });
    }else{
        res.send(block.addVotes(tx1))
    }
    
})

//test get all
app.get('/testGet',(req,res) => {
  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    result.rows.forEach(n => {
      console.log(n.doc)
      
    })
    res.send('done')
  }).catch(function (err) {
    console.log(err);
  });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


