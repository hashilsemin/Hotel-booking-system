var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
var objectId = require('mongodb').ObjectID

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

addBooking: (bookingData) => {

    return new Promise(async (resolve, reject) => {
    
    
        db.get().collection(collection.BOOKING_COLLECTION).insertOne(bookingData).then(() => {


           resolve()
        })
    })

},



getBooking: (Email) => {
    return new Promise(async (resolve, reject) => {
       let booking= await db.get().collection(collection.BOOKING_COLLECTION).find({ Email: Email}).toArray()
            
       resolve(booking)

    

    })
},
}