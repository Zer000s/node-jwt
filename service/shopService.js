const {Catalog} = require('../models/models');
const ApiError = require('../error/ApiError');

class shopService{
    async addTovar (name, price, fileName, discription){
        const tovar = await Catalog.create({names:name, price:price, image:fileName, discription:discription});
        return{
            tovar
        }
    }
    
    async getAllCatalog(){
        const catalog = await Catalog.findAll();
        return catalog;
    }
}

module.exports = new shopService();