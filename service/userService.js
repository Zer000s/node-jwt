const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jsonwebtoken = require('jsonwebtoken');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../error/ApiError');
const {User} = require('../models/models');

class userService{
    async registration (email, pas){
        const candidate = await User.findOne({where:{email}});
        if(candidate){
            throw ApiError.badRequest(404, `Пользователь ${email} уже зарегистрирован`);
        }
        const hashPas = await bcrypt.hash(pas,3);
        const activationLink = await uuid.v4();
        const user = await User.create({email:email, pas:hashPas, isActivatedLink:activationLink});
        await mailService.sendActivationMail(email, `${process.env.URL}/api/user/activate/${activationLink}`);
        const userDTO = new UserDto(user);
        const tokens = tokenService.createJWT({...userDTO});
        const test = await tokenService.saveToken(userDTO.id, tokens.refreshToken);

        return{
            ...tokens,
            user:userDTO,
            test
        }
    }

    async activate (activationLink){
        const user = await User.findOne({activationLink});
        if(!user){
            throw ApiError.badRequest(404, 'Некорректная ссылка');
        }
        user.isActivated = true;
        await user.save();
    }

    async login (email, pas){
        const candidate = await User.findOne({where:{email}});
        if(!candidate){
            throw ApiError.badRequest(404, `Пользователь ${email} не найден`);
        }
        const isPass = await bcrypt.compare(pas, candidate.pas);
        if(!isPass){
            throw ApiError.badRequest(404, 'Неверный пароль');
        }
        const userDTO = new UserDto(candidate);
        const tokens = tokenService.createJWT({...userDTO});
        const test = await tokenService.saveToken(userDTO.id, tokens.refreshToken);
        return{
            ...tokens,
            user:userDTO,
            test
        }
    }

    async logout (refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh (refreshToken){
        if(!refreshToken){
            throw ApiError.unAuthError();
        }
        const userData = await tokenService.validationRefreshToken(refreshToken);
        const tokenisDB = await tokenService.tokenIsDB(refreshToken);
        if(!userData||!tokenisDB){
            throw ApiError.unAuthError();
        }
        const user = await User.findOne({where:{id:userData.id}});
        const userDTO = new UserDto(user);
        const tokens = tokenService.createJWT({...userDTO});
        const test = await tokenService.saveToken(userDTO.id, tokens.refreshToken);
        return{
            ...tokens,
            user:userDTO,
            test
        }
    }

    async getAllUser(){
        const users = await User.findAll();
        return users;
    }
}

module.exports = new userService();