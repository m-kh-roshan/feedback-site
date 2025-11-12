const asyncRouter = require('../../helpers/asyncRouter')
const commentController = require('../../controllers/commentController');
const authToken = require('../../middlewares/authToken');
const validations = require('../../validations/commentValidation')
const validateBody = require('../../middlewares/validateBody')
const router = asyncRouter({ mergeParams: true });


// router.get('/', authToken.optionalAuth, commentController.)
router.post('/', authToken.authToken, validateBody(validations.createComment), commentController.create)
router.patch('/:id', authToken.authToken, validateBody(validations.updateComment), commentController.update)
router.delete('/:id', authToken.authToken, commentController.deleteComment)
router.post('/:id/like', authToken.authToken, commentController.like)



module.exports = router;