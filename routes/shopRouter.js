const Router = require('express')
const shopController = require('../controllers/shopController');
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addtovar', authMiddleware, shopController.addTovar)
router.get('/catalog', shopController.getCatalog)

module.exports = router;