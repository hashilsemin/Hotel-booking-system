var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
const Razorpay=require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_4oASb9KdHLZimd',
    key_secret: 'T7RwDK53HjUjORrTnYkJcPSJ',
  });
module.exports = {
    userSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        }
        )
    },
    userLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let status = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }

                })
            } else {
                resolve({ status: false })
            }
        })
    },
    addGmail:(mail,name)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne(
                { Email: mail },   // Query parameter
                {    
                    $set:{
                        Email: mail,
                        Name: name 
                    }                 // Replacement document
                 
                
                },
                { upsert: true }      // Options
             )
             resolve()
        })
    },
    
    getUserdata: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((user) => {
                resolve(user)

            })

        })
    },
    
    updateUser: (userData) => {

        return new Promise(async (resolve, reject) => {
       
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userData._id) },
                {
                    $set: {
                        Name: userData.Name,
                     Mobile: userData.Mobile
                    }
                }
            ).then(() => {


                resolve()
            })
        })

    },
    
    getUserName:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let id=userId._id
           let hotel= db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)})
             
                resolve(hotel)
            })
  
},

getHotels: (city) => {
    return new Promise(async (resolve, reject) => {
        let hotels = await db.get().collection(collection.HOTEL_COLLECTION).find({ City: city }).toArray()
        resolve(hotels)
    })

},

getRoom: (hotelId) => {
    return new Promise(async (resolve, reject) => {
        let hotels = await db.get().collection(collection.ROOM_COLLECTION).find({ hotelId: hotelId }).toArray()
        resolve(hotels)
    })

},
getDates:(dates)=>{
    
    return new Promise(async (resolve, reject) => {
let start=dates.checkIn
let end=dates.checkOut

        resolve(getDaysArray)
    })

},
bookRoom: (roomId) => {
    return new Promise(async (resolve, reject) => {
       db.get().collection(collection.ROOM_COLLECTION).findOne({ _id: objectId(roomId) }).then((data)=>{
            resolve(data)
        })
       
    })

},

addBooking: (bookingData,bookTime,price) => {

    return new Promise(async (resolve, reject) => {
    
   


        db.get().collection(collection.BOOKING_COLLECTION).insertOne(bookingData).then((response) => {


           resolve(response.ops[0]._id)
        })
        
    })

},

addWalletBooking: (bookingData,Price) => {

    return new Promise(async (resolve, reject) => {
    let wallet= await db.get().collection(collection.USER_COLLECTION).find({ Email: bookingData.Email }).toArray()
    console.log("hiiiiiiiiiiiiiiiii");
    let money=wallet[0].price
   
    console.log(money);
 if(money>=Price){
    db.get().collection(collection.USER_COLLECTION).updateOne( { $and: [ { Email: bookingData.Email }, { price: { $gte: Price } } ] } ,
        {
            $inc: {  price: -Price}
          
        }
       
).then(()=>{
    db.get().collection(collection.BOOKING_COLLECTION).insertOne(bookingData).then((response) => {


        resolve(response.ops[0]._id)
     })
   
    resolve(money)
})
 }else{
     let money=false
     resolve(money)
 }
       

   


      
        
    })

},


getBooking: (Email,currentTime) => {
    return new Promise(async (resolve, reject) => {

       await db.get().collection(collection.BOOKING_COLLECTION).updateMany({},
        
        { $set: {canCancel:"" } }
        ).then(async()=>{

          await  db.get().collection(collection.BOOKING_COLLECTION).updateMany({"Time" : {  $gte: new Date(new Date().getTime()-60*1*1000).toISOString() }},
        
            { $set: {
                canCancel:"yes" 
            } }
            )
        }).then(async()=>{

            let booking= await db.get().collection(collection.BOOKING_COLLECTION).find({ Email: Email}).toArray()
            
            resolve(booking)
        })


        
// db.getCollection('booking').find({"Time" : { $gte: new Date().toISOString() }});


    

    })
},

cancelBooking:(bookingId)=>{
    return new Promise((resolve,reject)=>{
        
        
        db.get().collection(collection.BOOKING_COLLECTION).removeOne({_id:objectId(bookingId)}).then((response)=>{
            //console.log(response)
            resolve(response)
        })
    })
},
changestatus:(details)=>{
    return new Promise(async(resolve,reject)=>{
       let id=details.user
        if(details.status=="check in"){
console.log(id);

         db.get().collection(collection.BOOKING_COLLECTION).updateOne({_id:objectId(id)},
            {
                $set:{
                    Status:"Check in"
                }
            })
                resolve() 
          
            
                
          
            
        }else{
         db.get().collection(collection.BOOKING_COLLECTION).updateOne({_id:objectId(details.user)},
            {
                $set:{
                    Status:"Check out"
                }
            })
                resolve()
          
          
        }
    })
},
getStatus:(details)=>{

return new Promise(async(resolve,reject)=>{
   let Status=await db.get().collection(collection.BOOKING_COLLECTION).findOne({_id:objectId(details.user)})
   resolve(Status)
})
},





getPayment: (Email) => {
    return new Promise(async (resolve, reject) => {

        let payment= await db.get().collection(collection.BOOKING_COLLECTION).find({ $and:[{ Reason: { $exists: true}},{Email:Email}] }).toArray()
     
            resolve(payment)
 } )
        },
    
    
  
    doPayment: (bookingId) => {
        return new Promise(async (resolve, reject) => {
 db.get().collection(collection.BOOKING_COLLECTION).updateOne({ _id: objectId(bookingId)},
 {
     $unset:{
         Reason:"",
         additionalCharge:""
     }
 }
 
 )
                
                resolve()
            })
        },

        generateRazorpay:(orderId,total)=>{
            return new Promise((resolve,reject)=>{
                var options = {
                    amount: total*100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt:""+orderId
                  };
                  instance.orders.create(options, function(err, order) {
                      if(err){
                          console.log(err);
                      }else{
                  console.log(order);
                    resolve(order)
                      }
                  });
            })
        },
        verifyPayment:(details)=>{
            return new Promise((resolve,reject)=>{
                console.log(details);
                const crypto= require('crypto')
                let hmac=crypto.createHmac('sha256','T7RwDK53HjUjORrTnYkJcPSJ')
                hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
                hmac=hmac.digest('hex')
                if(hmac==details['payment[razorpay_signature]']){
                    resolve()
                }else{
                    reject()
                
                }
            })
        },
        changePaymentStatus:(orderId)=>{
            console.log(orderId);
            return new Promise((resolve,reject)=>{
                console.log(orderId);
                db.get().collection(collection.BOOKING_COLLECTION).updateOne({_id:objectId(orderId)},
                {
                    $set:{
                       Rstatus:'placed'
                    }
                }).then(()=>{
                    resolve()
                })
            })
        },
       
        addReview: (userData) => {
            return new Promise(async (resolve, reject) => {
              
                db.get().collection(collection.REVIEW_COLLECTION).insertOne(userData).then((data) => {
                    resolve(data.ops[0])
                })
            }
            )
        },
    
        getReviews: (hotelName) => {
            return new Promise(async (resolve, reject) => {
                console.log(hotelName);
              let review=await  db.get().collection(collection.REVIEW_COLLECTION).find({hotelName:hotelName}).toArray()
                    resolve(review)
    
              
    
            })
        },
        addWallet:(mail,price)=>{
            return new Promise(async(resolve,reject)=>{
                console.log(price);
                db.get().collection(collection.USER_COLLECTION).updateOne(
                    { Email: mail },   // Query parameter
                    {    
                        $inc: { price: +price}
                    
                    },
                  
                 )
                 resolve()
            })
        },
}
