var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ObjectID } = require('mongodb')
var objectId = require('mongodb').ObjectID
var generator = require('generate-password');
const nodemailer = require("nodemailer");

module.exports = {

    adminSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
            adminData.Password = await bcrypt.hash(adminData.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                resolve(data.ops[0])
            })
        }
        )
    },
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {

            let status = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        response.admin = admin
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
    checkAdmin: () => {
        return new Promise(async (resolve, reject) => {
            count = await db.get().collection(collection.ADMIN_COLLECTION).count().then((count) => {
                if (count <= 0) {
                    status = true
                    resolve(status)
                } else {
                    status = false
                    resolve(status)
                }

            })

        })


    },
    addHotel: (hotelData) => {

        return new Promise(async (resolve, reject) => {
            var password = generator.generate({
                length: 10,
                numbers: true
            });
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'hashilsemin2@gmail.com',
                  pass: ''
                }
              });
              var mailOptions = {
                from: 'hashilsemin2@gmail.com',
                to: hotelData.Email,
                subject: 'Use the given password to sign to your travelix account',
                text: 'We are so happy to partner up with you, your password is '+password 
              };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
            });
            password = await bcrypt.hash(password, 10)
            db.get().collection(collection.HOTEL_COLLECTION).updateOne({ Mobile: hotelData.Mobile },
                {
                    $set: {
                        Name: hotelData.Name,
                        Mobile: hotelData.Mobile,
                        Status: "accepted",
                        City: hotelData.City,
                        Password: password
                    }
                },
             
            ).then(() => {


                resolve()
            })
        })

    },

    getHotels: () => {
        return new Promise(async (resolve, reject) => {
            let hotels = await db.get().collection(collection.HOTEL_COLLECTION).find({ Status: "accepted" }).toArray()
            resolve(hotels)
        })

    },

    getrequestHotels: () => {
        return new Promise(async (resolve, reject) => {
            let hotels = await db.get().collection(collection.HOTEL_COLLECTION).find({ Status: "pending" }).toArray()
            resolve(hotels)
        })

    },
    getHoteldata: (hotelId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.HOTEL_COLLECTION).findOne({ _id: objectId(hotelId) }).then((hotel) => {
                resolve(hotel)

            })

        })
    },
  
    deleteHotel:(hotelId)=>{
        return new Promise((resolve,reject)=>{
            
            
            db.get().collection(collection.HOTEL_COLLECTION).removeOne({_id:objectId(hotelId)}).then((response)=>{
                //console.log(response)
                resolve(response)
            })
        })
    },
    getreqCount: () => {
        return new Promise(async (resolve, reject) => {
        let count = 0
        let request = await db.get().collection(collection.HOTEL_COLLECTION).count({ Status: "pending" })
            if (request) {
                count = request
            }
            resolve(count)
        })
    },
   
    getCities: () => {
        return new Promise(async (resolve, reject) => {
            let cities = await db.get().collection(collection.CITY_COLLECTION).find({}).toArray()
            resolve(cities)
        })

    },
   
    addCity: (cityData) => {

        return new Promise(async (resolve, reject) => {
        
        
            db.get().collection(collection.CITY_COLLECTION).insertOne(cityData).then((data) => {


               resolve(data.ops[0]._id)
            })
        })

    },
    
    deleteCity:(cityId)=>{
        return new Promise((resolve,reject)=>{
            
            
            db.get().collection(collection.CITY_COLLECTION).removeOne({_id:objectId(cityId)}).then((response)=>{
                //console.log(response)
                resolve(response)
            })
        })
    },
  
    getBooking: () => {
        return new Promise(async (resolve, reject) => {
            let booking = await db.get().collection(collection.BOOKING_COLLECTION).find({}).toArray()
            resolve(booking)
        })

    },

}
