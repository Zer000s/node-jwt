const uuid = require('uuid');
const path = require('path');
const ApiError = require("../error/ApiError");
const shopService = require("../service/shopService");

class shopController {
    async addTovar (req, res, next){
        try{
            const {name, price, discription} = req.body;
            const {image} = req.files;
            let fileName = uuid.v4()+".jpg";
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
            const tovarData = await shopService.addTovar(name, price, fileName, discription)
            return res.json(tovarData)
        }
        catch(e){
            return next(e)
        }
    }

    async getCatalog(req, res, next)
    {
        try{
            const catalog = await shopService.getAllCatalog();
            res.json({catalog:catalog})
        }
        catch(e){
            return next(e)
        }
    }
}

module.exports = new shopController()