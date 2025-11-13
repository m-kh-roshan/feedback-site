/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirm_password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: strongpassword123
 *         confirm_password:
 *           type: string
 *           example: strongpassword123

 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: reza@gmail.com
 *         password:
 *           type: string
 *           example: adminadmin

 *     UserRegisterResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: USER_CREATED
 *         message:
 *           type: string
 *           example: Your account has been created successfully.
 

 *     LoginResponseData:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refresh_token:
 *           type: string
 *           description: JWT refresh token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/LoginResponseData'
 * 
 *     UserToken:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * 
 * 
 */