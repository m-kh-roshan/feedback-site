const asyncRouter = require('../../helpers/asyncRouter')
const userController = require('../../controllers/userController');
const authToken = require('../../middlewares/authToken');
const validations = require('../../validations/userValidation')
const validateBody = require('../../middlewares/validateBody')

const router = asyncRouter();

router.post('/', validateBody(validations.createUser), userController.insert)
router.post('/login', userController.login)
router.post('/token', userController.token)
router.post('/logout', userController.logOut)
router.get('/profile', authToken.authToken, userController.profile)

module.exports = router;
