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

router.get('/',verifyAdminLogin,async (req, res)=> {
  admin=req.session.admin
let reqCount=await adminHelpers.getreqCount()
  res.render('admin/admin',{admin,reqCount});
});

router.get('/login', async (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect('/admin')

  } else {
    let status = await adminHelpers.checkAdmin()

    res.render('admin/adminLogin', { status,error:req.session.adminLoginErr })
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
  res.render('admin/adminSignup')
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
router.get('/hotels',verifyAdminLogin, async(req, res) => {
  admin=req.session.admin
  let reqCount=await adminHelpers.getreqCount()
  let hotels=await adminHelpers.getHotels()

  res.render('admin/hotels',{hotels,admin,reqCount})
})
router.get('/add-hotel/:id',verifyAdminLogin,async(req, res) => {
  let admin=req.session.admin
  let reqCount=await adminHelpers.getreqCount()
  let hotelId=req.params.id
let hotel = await adminHelpers.getHoteldata(hotelId)

  res.render('admin/add-hotel',{hotel,admin,reqCount})
})
router.post('/add-hotel',(req,res)=>{
 
console.log(req.body);
  
  adminHelpers.addHotel(req.body).then(()=>{

    res.redirect("/admin/hotels")
  })
  
  })
  router.get('/requests',verifyAdminLogin,async(req, res) => {
    admin=req.session.admin
    let reqCount=await adminHelpers.getreqCount()
    let hotels=await adminHelpers.getrequestHotels()
    res.render('admin/hotelRequests',{hotels,admin,reqCount})
  })
  router.get('/delete-hotel/:id',(req,res)=>{
    let hotelId=req.params.id
   console.log(hotelId);
    adminHelpers.deleteHotel(hotelId).then((response)=>{
      res.redirect('/admin/hotels')
    })
  })
  router.get('/delete-hotelreq/:id',(req,res)=>{
    let hotelId=req.params.id
   console.log(hotelId);
    adminHelpers.deleteProduct(hotelId).then((response)=>{
      res.redirect('/admin/requests')
    })
  })
  router.get('/cities',verifyAdminLogin, async(req, res) => {
    admin=req.session.admin
    let reqCount=await adminHelpers.getreqCount()
    let cities=await adminHelpers.getCities()
  console.log(cities);
    res.render('admin/cities',{cities,admin,reqCount})
  })
  router.get('/add-city',verifyAdminLogin,async(req, res) => {
    let admin=req.session.admin
    let reqCount=await adminHelpers.getreqCount()
  
    res.render('admin/add-city')
  })
  router.post('/add-city',(req,res)=>{
 
    console.log(req.body);
      
      adminHelpers.addCity(req.body).then(()=>{
    
        res.redirect("/admin/cities")
      })
      
      })
      router.get('/delete-city/:id',(req,res)=>{
        let cityId=req.params.id
       console.log(cityId);
        adminHelpers.deleteCity(cityId).then((response)=>{
          res.redirect('/admin/cities')
        })
      })

module.exports = router;
