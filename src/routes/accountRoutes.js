const express = require('express');
const accountController = require('../controllers/accountController');

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
router.post('/', accountController.createAccount);

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
router.put('/disable/:id', accountController.disableAccount);

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
router.get('/', accountController.getAccounts);

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
router.get('/:id', accountController.getAccountById);

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
router.put('/:id', accountController.updateAccount)

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
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
