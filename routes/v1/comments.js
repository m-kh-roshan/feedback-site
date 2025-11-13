const asyncRouter = require('../../helpers/asyncRouter')
const commentController = require('../../controllers/commentController');
const authToken = require('../../middlewares/authToken');
const validations = require('../../validations/commentValidation')
const validateBody = require('../../middlewares/validateBody')
const router = asyncRouter({ mergeParams: true });



/**
 * @swagger
 * /features/{id}/comments:
 *   post:
 *     summary: Create comment on a feature
 *     tags: [Comment]
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
 *             $ref: '#/components/schemas/InsertComment'
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.post('/', authToken.authToken, validateBody(validations.createComment), commentController.create)


/**
 * @swagger
 * /features/{id}/comments/{commentId}:
 *   patch:
 *     summary: Update comment on a feature
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComment'
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.patch('/:commentId', authToken.authToken, validateBody(validations.updateComment), commentController.update)


/**
 * @swagger
 * /features/{id}/comments/{commentId}:
 *   delete:
 *     summary: delete comment on a feature
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *         example: 2
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.delete('/:commentId', authToken.authToken, commentController.deleteComment)


/**
 * @swagger
 * /features/{id}/comments/{commentId}/like:
 *   post:
 *     summary: like comment on a feature
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the feature
 *         example: 5
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment
 *         example: 2
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: Comment liked/unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCodeMessageResponse'
 *       400:
 *         description: Validation error (user nout found & No token)
 */
router.post('/:commentId/like', authToken.authToken, commentController.like)



module.exports = router;