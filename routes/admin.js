var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
const verifyAdminLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/Login')
  }
}

router.get('/',verifyAdminLogin, function (req, res, next) {

  res.render('admin');
});

router.get('/login', async (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect('/admin')

  } else {
    let status = await adminHelpers.checkAdmin()

    res.render('adminLogin', { status,error:req.session.adminLoginErr })
    req.session.adminLoginErr=false
  }
})
router.post('/login', (req, res) => {
  console.log(req.body);
  adminHelpers.adminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminLoggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin/')
    } else {
      req.session.adminLoginErr="Invalid Email or password"
      res.redirect('/admin/login')
    }
  })
})
router.get('/signup', (req, res) => {
  res.render('adminSignup')
})
router.post('/signup', (req, res) => {
  console.log(req.body)
  adminHelpers.adminSignup(req.body).then((response) => {

    res.redirect('/admin/login')
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin/login')
})

module.exports = router;
