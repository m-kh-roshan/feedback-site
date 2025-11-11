var express = require('express');
const userController = require('../../controllers/userController');
const authToken = require('../../middlewares/authToken');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', userController.insert)
router.post('/login', userController.login)
router.post('/token', userController.token)
router.post('/logout', userController.logOut)
router.get('/profile', authToken.authToken, userController.profile)

module.exports = router;
