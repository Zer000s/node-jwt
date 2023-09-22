const Router = require('express')
const userController = require('../controllers/userController');
const router = new Router()
const {body} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration',
    body('email').isEmail(),
    body('pas').isLength({min:3, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.users)

module.exports = router;