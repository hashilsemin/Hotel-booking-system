var express = require('express');
var router = express.Router();
const hotelHelpers = require('../helpers/hotel-helpers')
module.exports = router;
const verifyHotelLogin=(req,res,next)=>{
    if(req.session.hotelLoggedIn){
      next()
    }else{
      res.redirect('/hotel/Login')
    }
  }
router.get('/',function (req, res, next) {
    hotel=req.session.hotel
   
      res.render('hotel/hotel',{hotel});
    }); 
router.get('/Login',(req, res)=> {
    if (req.session.hotelLoggedIn) {
      res.redirect('/hotel')
  
    } else {
    
  
      res.render('hotel/hotelLogin', {error:req.session.hotelLoginErr })
      req.session.hotelLoginErr=false
    }
  }) 
  router.post('/hotelLogin', (req, res) => {
    console.log(req.body);
    hotelHelpers.hotelLogin(req.body).then((response) => {
      if (response.status) {
        req.session.hotelLoggedIn = true
        req.session.hotel = response.hotel
        res.redirect('/hotel')
      } else {
        req.session.hotelLoginErr="Invalid Email or password"
        res.redirect('/hotel/Login')
      }
    })
  })
  router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/hotel/Login')
  })