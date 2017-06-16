var express = require('express');
var router = express.Router();
var fs = require('fs');
var Product = require('../models/product');
var User = require('../models/user');

var multer = require('multer');

var upload = multer({ dest: 'upload/' });

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  Product.find(function(err, docs) {
    productChunks = [];
    chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('index', { productChunks: productChunks });
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
    var type = '.' + file.mimetype.split(/\//)[1];
    console.log(type);
    fs.rename(file.destination+file.filename, file.destination+file.filename+type, function(err) {
      if ( err ) console.log('ERROR: ' + err);
      else {
        console.log('upload success');
        console.log(file.destination+file.filename+type);
        new Product({
          imagePath: file.destination+file.filename+type,
          title: 'Gothic',
          description: req.body.description,
          price: 10
        }).save(function(err, result) {
          if (err) {
              console.log('save error:' + err);
          } else {
              console.log('save success');
          }
        });
      }
    });
  }
  res.redirect('/upload');
});


router.get('/upload', isLoggedIn, function(req, res, next){
  res.render('upload');
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}
