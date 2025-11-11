var express = require('express');
const featureController = require('../../controllers/featureController');
const authToken = require('../../middlewares/authToken');
var router = express.Router();


router.get('/', authToken.optionalAuth, featureController.getAll)
router.post('/', authToken.authToken, featureController.create)
router.patch('/:id', authToken.authToken, featureController.update)
router.delete('/:id', authToken.authToken, featureController.destroy)
router.post('/:id/vote', authToken.authToken, featureController.vote)
// router.post('/login', userController.login)
// router.post('/token', userController.token)
// router.post('/logout', userController.logOut)
// router.get('/profile', authToken.authToken, userController.profile)

module.exports = router;
