const express = require('express');
const accountController = require('../controllers/accountController');
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Crée un nouveau compte
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Le compte a été créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
router.post('/', authenticateToken, accountController.createAccount);

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Désactive un compte
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Le compte a été désactivé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
router.put('/disable/:id', authenticateToken, accountController.disableAccount);

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Récupère tous les comptes
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: La liste des comptes a été récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 */
router.get('/', authenticateToken, accountController.getAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Récupère un compte par son ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du compte
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Le compte a été récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
router.get('/:id', authenticateToken, accountController.getAccountById);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Met à jour un compte par son ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du compte
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Le compte a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
router.put('/:id', authenticateToken, accountController.updateAccount)

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Supprime un compte par son ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du compte
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Le compte a été supprimé avec succès
 */
router.delete('/:id', authenticateToken, accountController.deleteAccount);

module.exports = router;
