var express = require('express');
var router = express.Router();

/* GET flavourlist */
router.get('/flavourlist', function(req, res) {
  req.db.get('flavourlist').find(                 // in the flavourlist collection of our database, find a document
    {},                                           // indicate that we want all of the documents
    {},                                           
    function(e,docs){
      res.json(docs);
    });
});

/* GET tubHistory */
router.get('/tubHistory', function(req, res) {
  req.db.get('tubHistory').find(                 // in the tubHistory collection of our database, find a document
    {},                                           // indicate that we want all of the documents
    {},                                           
    function(e,docs){
      res.json(docs);
    });
});

/* POST to addflavour */
router.post('/addflavour', function(req, res) {
  req.db.get('flavourlist').insert(                 // in the flavourlist collection of our database, perform an insert of a document
    req.body,                                       // insert the document information
    function(err, result){                          // send an error if anything goes wrong
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
});

/* POST to addtub */
router.post('/addtub', function(req, res) {
  req.db.get('tubHistory').insert(                 // in the tubHistory collection of our database, perform an insert of a document
    req.body,                                       // insert the document information
    function(err, result){                          // send an error if anything goes wrong
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
});

/* PUT to editflavour */
router.put('/editflavour/:id', function(req, res) {
  req.db.get('flavourlist').update(                 // in the flavourlist collection of our database, perform an update of a document
    { '_id' : req.params.id },                      // find the document in the collection using the document's ID
    req.body,                                       // update the document with the new information
    function(err, result){                          // send an error if anything goes wrong
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    }
  );
});

/* DELETE to deleteflavour */
router.delete('/deleteflavour/:id', function(req, res) {
  req.db.get('flavourlist').remove({ '_id' : req.params.id }, function(err) {   // in the flavourlist collection of our database, perform a removal of a document
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });           // 
  });
});

/* DELETE to deletetub */
router.delete('/deletetub/:id', function(req, res) {
  req.db.get('tubHistory').remove({ '_id' : req.params.id }, function(err) {   // in the tubHistory collection of our database, perform a removal of a document
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;
