var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
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
    addHotel:(hotelData)=>{
     console.log(hotelData);
        return new Promise(async(resolve,reject)=>{
            hotelData.Password = await bcrypt.hash(hotelData.Password, 10)
            db.get().collection(collection.HOTEL_COLLECTION).insertOne(hotelData).then(()=>{
       resolve()
            })
        })
    },

    getHotels:()=>{
        return new Promise (async(resolve,reject)=>{
           let hotels= await db.get().collection(collection.HOTEL_COLLECTION).find().toArray()
              resolve(hotels)
            })
       
    }

}
