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

}