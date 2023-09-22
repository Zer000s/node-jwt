const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email:{type:DataTypes.STRING, unique:true, require: true},
    pas:{type:DataTypes.STRING, require: true},
    isActivated:{type:DataTypes.BOOLEAN, defaultValue:false},
    isActivatedLink:{type:DataTypes.STRING},
})

const Token = sequelize.define('token', {
    id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user:{type:DataTypes.INTEGER},
    refreshToken:{type:DataTypes.STRING, require: true},
})

const Catalog = sequelize.define('catalog', {
    id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    names:{type:DataTypes.STRING, require: true},
    price:{type:DataTypes.STRING, require: true},
    image:{type:DataTypes.STRING},
    discription:{type:DataTypes.STRING},
})

module.exports = {
    User,
    Token,
    Catalog
}