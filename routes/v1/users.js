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
 * /users/resendEmail:
 *   post:
 *     summary: Resend Email confirming
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserResendEmail'
 *     responses:
 *       200:
 *         description: Email Resend successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error
 */
router.post('/resendEmail', validateBody(validations.resendEmail), userController.resendEmailVerify)

/**
 * @swagger
 * /users/confirmEmail:
 *   get:
 *     summary: Confirm Email
 *     tags: [Users]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: confirm email token
 *     responses:
 *       200:
 *         description: User email successfully confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error(user not found & user verified)
 */
router.get('/confirmEmail', userController.emailVerify)

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

/**
 * @swagger
 * /users/resetPasswordEmail:
 *   post:
 *     summary: Reset password email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserResendEmail'
 *     responses:
 *       200:
 *         description: Email Resend successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error
 */
router.post('/resetPasswordEmail', validateBody(validations.resendEmail), userController.resetPasswordEmail)

/**
 * @swagger
 * /users/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error
 */
router.post('/resetPassword', validateBody(validations.resetPassword), userController.resetPassword)

module.exports = router;
