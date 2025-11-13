/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     InsertComment:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         body:
 *           type: string
 *           example: body of feature
 *         commet_id:
 *           type: integer
 *           example: 3
 * 
 *     UpdateComment:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         body:
 *           type: string
 *           example: body of feature

 *     UserCodeMessageResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string

 *     GetAllFeaturesData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *         user_id:
 *           type: integer
 *         status:
 *           type: string
 *         document:
 *           type: string
 *         category:
 *           type: string
 *         body:
 *           type: string
 *         createdAt:
 *           type: string
 *         vote_count:
 *           type: string
 *         user-username:
 *           type: string
 * 
 *     GetAllFeaturesResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/GetAllFeaturesData'
 * 
 *     CommentsFeatureData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         comment_id:
 *           type: string
 *         body:
 *           type: string
 *         likes_count:
 *           type: integer
 * 
 *     VotersFeatureData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 * 
 *     FeatureData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         user_id:
 *           type: integer
 *         status:
 *           type: string
 *         image:
 *           type: string
 *         category:
 *           type: string
 *         createdAt:
 *           type: string
 *         vote_count:
 *           type: string
 * 
 *     FeatureResponseData:
 *       type: object
 *       properties:
 *         features:
 *           $ref: '#/components/schemas/FeatureData'
 *         comments:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/CommentsFeatureData'
 *         voters:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/VotersFeatureData'
 * 
 *     GetFeatureResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/FeatureResponseData'
 * 
 * 
 * 
 */