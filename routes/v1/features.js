const asyncRouter = require('../../helpers/asyncRouter')
const featureController = require('../../controllers/featureController');
const authToken = require('../../middlewares/authToken');
const commentRouter = require('./comments')
const validations = require('../../validations/featureValidations')
const validateBody = require('../../middlewares/validateBody')

const router = asyncRouter();



router.get('/', authToken.optionalAuth, featureController.getAll)
router.get('/:id', featureController.get)
router.post('/', authToken.authToken, validateBody(validations.createFeature), featureController.create)
router.patch('/:id', authToken.authToken, validateBody(validations.updateFeature), featureController.update)
router.delete('/:id', authToken.authToken, featureController.destroy)
router.post('/:id/vote', authToken.authToken, featureController.vote)

router.use('/:id/comments', commentRouter)

module.exports = router;
