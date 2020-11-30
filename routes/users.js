var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const verifyuserLogin=(req,res,next)=>{
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/userLogin')
  }
}
/* GET users listing. */
router.get('/',(req, res)=> {
  res.render('user/homepage')
})
router.get('/userLogin',(req, res)=> {
  if (req.session.userLoggedIn) {
    res.redirect('/')

  } else {
  

    res.render('user/userLogin', {error:req.session.userLoginErr })
    req.session.userLoginErr=false
  }
})

router.post('/userLogin', (req, res) => {
  console.log(req.body);
  userHelpers.userLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userLoggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.userLoginErr="Invalid Email or password"
      res.redirect('/userLogin')
    }
  })
})

router.get('/userSignup', (req, res) => {
  res.render('user/userSignup')
})
router.post('/signup', (req, res) => {
 console.log(req.body);
  userHelpers.userSignup(req.body).then((response) => {

    res.redirect('/userLogin')
  })
})
router.get('/userLogout', (req, res) => {
  req.session.destroy()
  res.redirect('/userLogin')
})
module.exports = router;