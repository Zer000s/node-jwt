const jsonwebtoken = require('jsonwebtoken');
const {Token} = require('../models/models')

class tokenService{
    createJWT (payload){
        const accessToken = jsonwebtoken.sign(payload, process.env.SECRET_KEY_ACCESS, {expiresIn:'15s'})
        const refreshToken = jsonwebtoken.sign(payload, process.env.SECRET_KEY_REFRESH, {expiresIn:'30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validationAccessToken(token){
        try{
            const userData = jsonwebtoken.verify(token, process.env.SECRET_KEY_ACCESS);
            return userData;
        }
        catch(e){
            return null;
        }
    }

    validationRefreshToken(token){
        try{
            const userData = jsonwebtoken.verify(token, process.env.SECRET_KEY_REFRESH);
            return userData;
        }
        catch(e){
            return null;
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await Token.findOne({where:{user:userId}});
        if(tokenData){
            tokenData.refreshToken=refreshToken;
            return await tokenData.save();
        }
        const token = await Token.create({user:userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken){
        const tokenData = await Token.destroy({where:{refreshToken:refreshToken}});
        return tokenData;
    }

    async tokenIsDB(refreshToken){
        const tokenData = await Token.findOne({where:{refreshToken:refreshToken}});
        return tokenData;
    }
}

module.exports = new tokenService();