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
  admin=req.session.admin
console.log(admin);
  res.render('admin/admin',{admin});
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
router.get('/hotels', async(req, res) => {
  let hotels=await adminHelpers.getHotels()

  res.render('admin/hotels',{hotels})
})
router.get('/add-hotel/:id',async(req, res) => {
  let hotelId=req.params.id
let hotel = await adminHelpers.getHoteldata(hotelId)

  res.render('admin/add-hotel',{hotel})
})
router.post('/add-hotel',(req,res)=>{
 
console.log(req.body);
  
  adminHelpers.addHotel(req.body).then(()=>{

    res.redirect("/admin/hotels")
  })
  
  })
  router.get('/requests',async(req, res) => {
    let hotels=await adminHelpers.getrequestHotels()
    res.render('admin/hotelRequests',{hotels})
  })
  router.get('/delete-hotel/:id',(req,res)=>{
    let hotelId=req.params.id
   console.log(hotelId);
    adminHelpers.deleteProduct(hotelId).then((response)=>{
      res.redirect('/admin/hotels')
    })
  })
module.exports = router;
