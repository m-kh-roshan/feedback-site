var express = require('express');
const featureController = require('../../controllers/featureController');
const authToken = require('../../middlewares/authToken');
var router = express.Router();

const commentRouter = require('./comments')


router.get('/', authToken.optionalAuth, featureController.getAll)
router.get('/:id', featureController.get)
router.post('/', authToken.authToken, featureController.create)
router.patch('/:id', authToken.authToken, featureController.update)
router.delete('/:id', authToken.authToken, featureController.destroy)
router.post('/:id/vote', authToken.authToken, featureController.vote)

router.use('/:id/comments', commentRouter)

module.exports = router;
