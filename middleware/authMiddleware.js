const tokenService = require("../service/tokenService");
const ApiError = require('../error/ApiError');

module.exports = function(req, res, next){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            throw ApiError.unAuthError();
        }
        const accessToken = authHeader.split(' ')[1];
        if(!accessToken){
            throw ApiError.unAuthError();
        }
        const isAccess = tokenService.validationAccessToken(accessToken);
        if(!isAccess){
            throw ApiError.unAuthError();
        }
        req.user = isAccess;
        next();
    }
    catch(e){
        return next(e)
    }
}