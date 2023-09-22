const { validationResult } = require("express-validator");
const userService = require("../service/userService");
const ApiError = require("../error/ApiError");

class userController {
    async registration(req, res, next)
    {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                throw ApiError.badRequest(404, "Неверно задан e-mail или пароль", errors)
            }
            const {email, pas} = req.body;
            const userData = await userService.registration(email, pas)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(userData)
        }
        catch(e){
            return next(e)
        }
    }

    async login(req, res, next)
    {
        try{
            const {email, pas} = req.body;
            const userData = await userService.login(email, pas)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(userData)
        }
        catch(e){
            return next(e)
        }
    }

    async logout(req, res, next)
    {
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.logout(refreshToken)
            if(userData===1){
                res.clearCookie('refreshToken')
                return res.json({message:"Вы успешно вышли из своего аккаунта"})
            }
            return res.json({message:"Ошибка выхода из аккаунта"})
        }
        catch(e){
            return next(e)
        }
    }
    
    async activate(req, res, next)
    {
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        }
        catch(e){
            return next(e)
        }
    }
    
    async refresh(req, res, next)
    {
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(userData)
        }
        catch(e){
            return next(e)
        }
    }

    async users(req, res, next)
    {
        try{
            const users = await userService.getAllUser();
            res.json(users)
        }
        catch(e){
            return next(e)
        }
    }
}

module.exports = new userController()