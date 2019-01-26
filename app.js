const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const shortid = require('shortid');


// allow cross origin
app.use(cors());

// standard bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '/public')));

app.get('/seeall', (req,res) => {
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if (err) throw err;
    var dbo = db.db('votersapp');
    dbo.collection('votes').find({}, {projection: {_id: 0}}).toArray((err, response) => {
      res.send(response);
    });
  });
});

app.get('/seemine', (req,res) => {
  const findIp = req.headers['x-forwarded-for'] || req.headers.referer;
  const ip = req.headers['x-forwarded-for'] !== undefined ? findIp.slice(0, findIp.indexOf(',')) : findIp.slice(0, findIp.indexOf('/my-polls'));
  const myQuery = {ownerOfPoll: ip};
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if (err) throw err;
    var dbo = db.db('votersapp');
    dbo.collection('votes').find(myQuery, {projection: {_id: 0}}).toArray((err, response) => {
      res.send  (response);
    });
  });
});

app.post('/api/poll', (req,res) => {
  const findIp = req.headers.referer;
  const ip = findIp.slice(0, findIp.indexOf('/newpoll'));
  const obj = {};
  req.body['poll-options'].split(',').map( x => obj[x] = 0);
  var vote = {
    voteName: req.body['poll-name'],
    voteOptions: obj,
    uniqueId: shortid.generate(),
    usersVoted: [],
    ownerOfPoll: ip
  };
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if (err) throw err;
    var dbo = db.db('votersapp');
    dbo.collection('votes').insertOne(vote, (err, response) => {
      if (err) throw err;
      console.log(response.result);
      res.redirect('/api/poll/' + vote.uniqueId);
      db.close();
    });
  });
});


app.get('/api/poll/:id', (req,res) => {
  var id = req.params.id;
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if(err) throw err;
    var dbo = db.db('votersapp');
    dbo.collection('votes').findOne({uniqueId: id},{projection: {_id: 0}}, (err, response) => {
      if (err) throw err;
      res.sendFile(__dirname + '/public/poll.html');
      db.close();
    });
  });
});

app.get('/api/:id', (req,res) => {
  var id = req.params.id;
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if(err) throw err;
    var dbo = db.db('votersapp');
    dbo.collection('votes').findOne({uniqueId: id},{projection: {_id: 0}}, (err, response) => {
      if (err) throw err;
      res.send(response);
      db.close();
    });
  });
});

app.post('/api/vote', (req,res)=> {
  const findId = req.headers.referer;
  
  const id = findId.slice(findId.lastIndexOf('/') + 1);
  const option = req.body.option;
  
  const findIp = req.headers.referer;
  const ip = findIp.slice(0, findIp.indexOf('/api'))
  // console.log(ipVoted);
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if (err) throw err;
    var dbo = db.db('votersapp');
    
    dbo.collection('votes').findOne({uniqueId: id}, {projection: {_id:0}}, (err,response) => {
      // get the response, and find the option that was selected and update it with one
      const allOptions = response.voteOptions;
      
      for (let x in allOptions){
        if (x == option){
          allOptions[x] += 1;
        }
      }
      const updates = {$set: {voteOptions: allOptions}, $push: {usersVoted: ip}};
   dbo.collection('votes').updateOne({uniqueId: id}, updates, (err, result) => {
       if (err) throw err;
       console.log('One successfully updated');
      dbo.collection('votes').findOne({uniqueId: id}, {projection: {_id:0}}, (err,response) => {
        if (err) throw err;
        res.send(response);
      });
       db.close();
     });
    });
  });
});

app.get('/api/del/:id', (req,res) => {
  const url = req.headers.referer;
  var id = req.params.id;
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if(err) throw err;
    var dbo = db.db('votersapp');
    dbo.collection('votes').deleteOne({uniqueId: id}, (err, response) => {
      if (err) throw err;
      res.redirect(url);
      db.close();
    });
  });
});

app.post('/create-account', (req,res) => {
  var {username, password} = req.body;
  
  const obj = {username,password};
  
  MongoClient.connect(process.env.mongoURL, (err,db) => {
    if (err) throw err;
    var dbo = db.db('votersapp');
    
    dbo.collection('users').findOne({username:username},(err,response) => {
      if (err) throw err;
      if (response.length !== 0){
        res.json({success:false, status:'User already exists'})
      }
      // Remember to use this when opening the login page
      // if (username == response.username && password == response.password){
      //   res.json({success:true, status:ok});
      //   db.close();
      // } else {
      //   res.send('Username or password is incorrect!')
      //   db.close();
      // }
    })
  })
});

// Create a user array things, and setup unique ID for each user, so when they vote, we can

const port = 8080;

app.listen(port, () => console.log(`We're listening on ${port}`));