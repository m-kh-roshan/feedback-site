const asyncRouter = require('../../helpers/asyncRouter')
const featureController = require('../../controllers/featureController');
const authToken = require('../../middlewares/authToken');
const commentRouter = require('./comments')
const validations = require('../../validations/featureValidations')
const validateBody = require('../../middlewares/validateBody')

const router = asyncRouter();


/**
 * @swagger
 * /features:
 *   get:
 *     summary: Get all features info
 *     tags: [Feature]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: search statement on title and body of features
 *         example: feat
 *       - name: filter
 *         in: query
 *         schema:
 *           type: string
 *         description: type of filter(if = my it's need authirization)
 *         example: my
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *         description: Type of sort features
 *         example: top
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *         description: features with a special category
 *         example: category1
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: features with a special status
 *         example: under_review
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Features fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllFeaturesResponse'
 *       400:
 *         description: Validation error
 */
router.get('/', authToken.optionalAuth, featureController.getAll)


/**
 * @swagger
 * /features/{id}:
 *   get:
 *     summary: Get feature
 *     tags: [Feature]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5 
 *     responses:
 *       200:
 *         description: Feature fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetFeatureResponse'
 *       400:
 *         description: Validation error
 */
router.get('/:id', featureController.get)

/**
 * @swagger
 * /features:
 *   post:
 *     summary: Create feature
 *     tags: [Feature]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertFeature'
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Feature created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.post('/', authToken.authToken, validateBody(validations.createFeature), featureController.create)


/**
 * @swagger
 * /features/{id}:
 *   patch:
 *     summary: Update feature
 *     tags: [Feature]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertFeature'
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Feature updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.patch('/:id', authToken.authToken, validateBody(validations.updateFeature), featureController.update)


/**
 * @swagger
 * /features/{id}:
 *   delete:
 *     summary: Delete feature
 *     tags: [Feature]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Feature deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.delete('/:id', authToken.authToken, featureController.destroy)


/**
 * @swagger
 * /features/{id}/vote:
 *   post:
 *     summary: Vote feature
 *     tags: [Feature]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Feature voted/unvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.post('/:id/vote', authToken.authToken, featureController.vote)

router.use('/:id/comments', commentRouter)

module.exports = router;
