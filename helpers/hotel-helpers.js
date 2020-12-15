var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { promise } = require('bcrypt/promises')
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
    
    registerHotel: (hotelData) => {
        return new Promise(async (resolve, reject) => {
       
            db.get().collection(collection.HOTEL_COLLECTION).insertOne(hotelData).then(() => {
                
                resolve()
            })
        }
        )
    },
  
    getHoteldata: (hotelId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.HOTEL_COLLECTION).findOne({ _id: objectId(hotelId) }).then((hotel) => {
                resolve(hotel)

            })

        })
    },
   
    updateHotel: (hotelData) => {

        return new Promise(async (resolve, reject) => {
       
            db.get().collection(collection.HOTEL_COLLECTION).updateOne({ _id: objectId(hotelData._id) },
                {
                    $set: {
                        Name: hotelData.Name,
                        Mobile: hotelData.Mobile,
                        City: hotelData.City,
                        Email: hotelData.Email,
                        Address: hotelData.Address,
                        Description: hotelData.Description,
                        Nearby: hotelData.Nearby,
                        Transport: hotelData.Transport,
                        Airport: hotelData.Airport,
                    }
                }
            ).then(() => {


                resolve()
            })
        })

    },
    getHotelName:(hotelId)=>{
            return new Promise(async(resolve,reject)=>{
                let id=hotelId._id
               let hotel= db.get().collection(collection.HOTEL_COLLECTION).findOne({_id:objectId(id)})
                 
                    resolve(hotel)
                })
      
    },
   
    getRooms: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            let rooms = await db.get().collection(collection.ROOM_COLLECTION).find({ hotelId: hotelData._id}).toArray()
            resolve(rooms)
        })

    },
    addRoom: (roomData)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.ROOM_COLLECTION).insertOne(roomData).then((data)=>{
        resolve(data.ops[0]._id)
            })
        })
    },
 
    deleteRoom:(roomId)=>{
        return new Promise((resolve,reject)=>{
            
            
            db.get().collection(collection.ROOM_COLLECTION).removeOne({_id:objectId(roomId)}).then((response)=>{
                //console.log(response)
                resolve(response)
            })
        })
    },
  
    getRoomdata: (roomId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ROOM_COLLECTION).findOne({ _id: objectId(roomId) }).then((room) => {
                resolve(room)

            })

        })
    },
   
    editRoom: (roomData,roomId) => {

        return new Promise(async (resolve, reject) => {
       
            db.get().collection(collection.ROOM_COLLECTION).updateOne({ _id: objectId(roomId) },
                {
                    $set: {
                        Description:roomData.Description,
                        Type: roomData.Type,
                        Available: roomData.Available,
                        Price: roomData.Price,
                        Features: roomData.Features,
                        AC: roomData.AC,
                        Balcony: roomData.Balcony,
                        Freewifi: roomData.Freewifi,
                        Heater: roomData.Heater,
                        Smokingroom: roomData.Smokingroom,
                        TV: roomData.TV,
                        Newspaper: roomData.Newspaper,
                        Slippers: roomData.Slippers,
                        Minibar: roomData.Minibar,
                        Airpurifier: roomData.Airpurifier,
                        Telephone: roomData.Telephone,
                        Ironbox: roomData.Ironbox,
                        Housekeeping: roomData.Housekeeping,
                        Snackbasket: roomData.Snackbasket,
                        Smokealarm: roomData.Smokealarm,
                        Toiletpaper: roomData.Toiletpaper,

                    }
                }
            ).then(() => {


                resolve()
            })
        })

    },
}