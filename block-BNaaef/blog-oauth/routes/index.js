var express = require('express');
var router = express.Router();

var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github',
 {failureRedirect : '/users/login'}), (req, res) => {
  res.redirect('/')
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', 
{failureRedirect : '/users/login'}), (req, res) => {
  res.redirect('/')
})



module.exports = router;
