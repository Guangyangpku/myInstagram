var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');

// csurf middleware
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    productChunks = [];
    chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('index', { title: 'Express', productChunks: productChunks });
  });
});

router.get('/user/signup', function(req, res, next) {
  res.render('user/signup', {title: 'login', csrfToken: req.csrfToken()});
});

module.exports = router;
