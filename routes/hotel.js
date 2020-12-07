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
router.get('/',async (req, res, ) =>{
  let hotelId=req.session.hotel
  console.log(hotelId);
  let hotel=req.session.hotel
   let hotelName=await hotelHelpers.getHotelName(hotelId)
   console.log(hotelName);
      res.render('hotel/hotel',{hotel,hotelName});
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
  router.get('/registerHotel',(req,res)=>{
    res.render('hotel/registerHotel')
  })
  router.post('/registerHotel',(req,res)=>{
    hotelHelpers.registerHotel(req.body).then((response) => { 
      console.log(req.body);
      res.render('hotel/registered')
  })
})
router.get('/updateProfile/:id',async(req,res)=>{
 let hotelId=req.params.id
 let hotel = await hotelHelpers.getHoteldata(hotelId)
console.log(hotel);
  res.render('hotel/index',{hotel})
})
router.post('/updateProfile',(req,res)=>{
 
  console.log(req.body);
    
    hotelHelpers.updateHotel(req.body).then(()=>{ 
  
      res.redirect("/hotel")
    })
    
    })