var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

// csurf middleware
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  var username = req.user.email || '';
  Product.find({username: username}, function(err, docs) {
    productChunks = [];
    for (var i = 0; i < docs.length ; i ++) {
      productChunks.push(docs.slice(i, i+1));
    }
    console.log(productChunks);

    productChunks.sort(function (a, b) {
      return parseInt(b[0].timeStamp) - parseInt(a[0].timeStamp);
    });
    res.render('user/profile', { productChunks: productChunks, username: username, header: true});
  });
});

router.get('/logout', isLoggedIn, function (req, res, next){
  console.log('loggingout');
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, header: true});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, header: true});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

// protect the users and check it, middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// add time in the array; input an array
function addTime(array) {
  array.forEach(function(ele) {
    var date =  new Date(ele.timeStamp*1000);
    var datevalues = [
      date.getFullYear(),
      date.getMonth()+1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];
    console.log(datevalues[0]+'-'+datevalues[1]+'-'+ datevalues[2]+'  '+datevalues[3]+':'+datevalues[4]); // 2017-3-12 12:28

  });
}
