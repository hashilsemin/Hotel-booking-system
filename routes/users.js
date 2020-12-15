
var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
const userHelpers = require('../helpers/user-helpers')
const nodemailer = require("nodemailer");
const passport = require('passport');
require('../helpers/passport-setup')
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}
const verifyuserLogin=(req,res,next)=>{
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/userLogin') 
  }
}
/* GET users listing. */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/',async(req, res)=> {
  let gUser=req.user
  let user=req.session.user
  if(gUser){
    let cities=await adminHelpers.getCities()
    let gMail=req.user.emails[0].value
 let gName=req.user.displayName
 userHelpers.addGmail(gMail,gName).then((response)=>{
  res.render('user/homepage',{cities,gUser,name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})

 })
  }else if (user){
        let cities=await adminHelpers.getCities()
    let userId = req.session.user
    let userName = await userHelpers.getUserName(userId)
    res.render('user/homepage',{user,userName,cities}) 
  }else{
  
    let cities=await adminHelpers.getCities()
  console.log(cities);
    res.render('user/homepage',{cities})
  }
  
})

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    req.session.userLoggedIn = true
    // Successful authentication, redirect home. 
    res.redirect('/');
  }
);

router.get('/googleLogout', (req, res) => {
  req.session.destroy()
  req.logout();
  res.redirect('/');
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

router.get('/updateProfile/:id', async (req, res) => {
  let userId = req.params.id
  let user = await userHelpers.getUserdata(userId)
  console.log(user);
  res.render('user/updateProfile', {user })
})
router.post('/updateProfile', (req, res) => {

  console.log(req.body);

  userHelpers.updateUser(req.body).then(() => {

    res.redirect("/")
  })

})
router.get('/city/:id', async(req, res) => {
  let city = req.params.id
  console.log(city);
  let hotels=await userHelpers.getHotels(city)
  console.log(hotels);
 res.render('user/city',{hotels,city})
   

})
router.get('/rooms/:id', async(req, res) => {
  let room = req.params.id
 
  let hotel = await adminHelpers.getHoteldata(room)
  let rooms=await userHelpers.getRoom(room)
  console.log(hotel);
  console.log(rooms);
 res.render('user/rooms',{rooms,hotel})
   

})
module.exports = router;