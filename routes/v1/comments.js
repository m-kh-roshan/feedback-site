var express = require('express');
const commentController = require('../../controllers/commentController');
const authToken = require('../../middlewares/authToken');
var router = express.Router({ mergeParams: true });


// router.get('/', authToken.optionalAuth, commentController.)
router.post('/', authToken.authToken, commentController.create)
router.patch('/:id', authToken.authToken, commentController.update)
router.delete('/:id', authToken.authToken, commentController.deleteComment)
router.post('/:id/like', authToken.authToken, commentController.like)



module.exports = router;