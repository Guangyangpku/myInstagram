var express = require('express');
var router = express.Router();
var fs = require('fs');
var Product = require('../models/product');
var User = require('../models/user');

var multer = require('multer');

var upload = multer({ dest: 'public/images/' });

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  Product.find(function(err, docs) {
    productChunks = [];
    chunkSize = 1;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('index', { productChunks: productChunks, username: req.user.email });
  });
});

router.get('/mail', isLoggedIn, function(req, res, next) {
  var id = req.session.passport.user;
  User.findById(id, function(err, user) {
    if (!err) {
      res.render('chat', {username : user.email});
    }
  })
});

/* file upload */
router.post('/upload', upload.single('imgInp'), function(req, res, next){
  var file = req.file;
  if (file) {
    console.log('/upload')
    console.log(req.body);
    var filename = file.destination + file.filename;
    console.log(filename);
    var newFilename = filename + '.' + file.mimetype.split(/\//)[1];
    fs.rename( filename, newFilename, function(err) {
      if ( err ) console.log('ERROR: ' + err);
      else {
        console.log('upload success');
        console.log(newFilename);
        var id = req.session.passport.user;
        User.findById(id, function(err, user) {
          if (!err) {
            new Product({
              imagePath: 'images/' + file.filename + '.' + file.mimetype.split(/\//)[1],
              username: user.email,
              description: req.body.description,
            }).save(function(err, result) {
              if (err) {
                  console.log('save error:' + err);
              } else {
                  console.log('save success');
              }
            });
          }
        })
      }
    });
  }
  res.redirect('/');
});

router.get('/upload', isLoggedIn, function(req, res, next){
  res.render('upload');
});

router.get('/getallusers', function(req, res, next){
  User.find(function(err, docs){
  docs.forEach(function(ele){
    console.log(ele);
  });
  res.send(docs);
});
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}
