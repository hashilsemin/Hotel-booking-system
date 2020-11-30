var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
module.exports = {
    hotelLogin: (hotelData) => {
        return new Promise(async (resolve, reject) => {

            let status = false
            let response = {}
            let hotel = await db.get().collection(collection.HOTEL_COLLECTION).findOne({ Name: hotelData.username })
            if (hotel) {
                bcrypt.compare(hotelData.Password, hotel.Password).then((status) => {
                    if (status) {
                        response.hotel = hotel
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


}