var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code4 - a platform for sharing code.' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Code4 - a platform for sharing code.' });
});

router.route('/contact')
  .get(function(req, res, next) {
    res.render('contact', { title: 'Code4 - Get in touch!' });
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.render('contact', {
        title: 'Code4 - Get in touch!',
        name: req.body.name,
        email:req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    } else {
      res.render('thank', { title: 'Code4 - Thanks for getting in touch!' });
    }   
  });


module.exports = router;
