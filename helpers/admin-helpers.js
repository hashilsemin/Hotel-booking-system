var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ObjectID } = require('mongodb')
var objectId = require('mongodb').ObjectID

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
            hotelData.Password = await bcrypt.hash(hotelData.Password, 10)
            db.get().collection(collection.HOTEL_COLLECTION).updateOne({ Mobile: hotelData.Mobile },
                {
                    $set: {
                        Name: hotelData.Name,
                        Mobile: hotelData.Mobile,
                        Status: "accepted",
                        City: hotelData.City,
                        Password: hotelData.Password
                    }
                }
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
  
    deleteProduct:(hotelId)=>{
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
}
