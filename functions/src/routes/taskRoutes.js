const express = require('express');
const taskController = require('../controllers/taskController');
const upload = require("../middleware/uploadMiddleware");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/test', taskController.getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crée une nouvelle tâche
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: La tâche a été créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 */
router.post('/', authenticateToken, taskController.createTask);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Ajoute une image à une tâche
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: L'image a été ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 */
router.post('/image/:id', upload.single('image'), taskController.addImage);

router.put('/image/:id', upload.single('image'), taskController.updateImage);
/**
 * @swagger
 * /tasks/start/{id}:
 *   post:
 *     summary: Démarre une tâche pour l'envoi de messages
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tâche à démarrer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: La tâche a été démarrée avec succès
 */
router.post('/start/:id', authenticateToken, taskController.startTask);

/**
 * @swagger
 * /tasks/stop/{id}:
 *   post:
 *     summary: Arrête une tâche en cours d'exécution
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tâche à arrêter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: La tâche a été arrêtée avec succès
 */
router.post('/stop/:id', authenticateToken, taskController.stopTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupère toutes les tâches
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: La liste des tâches a été récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tasks'
 */
router.get('/', authenticateToken, taskController.getTasksByUser);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Récupère une tâche par son ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tâche
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: La tâche a été récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 */
router.get('/:id',  taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprime une tâche par son ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tâche
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: La tâche a été supprimée avec succès
 */
router.delete('/:id', authenticateToken, taskController.deleteTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Met à jour une tâche par son ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tâche
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tasks'
 *     responses:
 *       200:
 *         description: La tâche a été mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 */
router.put('/:id', authenticateToken, taskController.updateTask);


module.exports = router;