const asyncRouter = require('../../helpers/asyncRouter')
const userController = require('../../controllers/userController');
const authToken = require('../../middlewares/authToken');
const validations = require('../../validations/userValidation')
const validateBody = require('../../middlewares/validateBody')

const router = asyncRouter();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error
 */
router.post('/', validateBody(validations.createUser), userController.insert)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       400:
 *         description: Validation error (user nout found)
 */
router.post('/login', userController.login)

/**
 * @swagger
 * /users/token:
 *   post:
 *     summary: Token user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserToken'
 *     responses:
 *       200:
 *         description: User tokens generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.post('/token', userController.token)


/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: logout user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserToken'
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.post('/logout', authToken.authToken, userController.logOut)


/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: User profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.get('/profile', authToken.authToken, userController.profile)

module.exports = router;
