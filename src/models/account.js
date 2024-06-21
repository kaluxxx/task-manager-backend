const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - apiId
 *         - apiHash
 *         - session
 *         - userId
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Le numéro de téléphone associé au compte
 *         apiId:
 *           type: number
 *           description: L'ID de l'API associé au compte
 *         apiHash:
 *           type: string
 *           description: Le hash de l'API associé au compte
 *         isActivated:
 *           type: boolean
 *           description: L'état d'activation du compte
 *         session:
 *           type: string
 *           description: La session associée au compte
 *         userId:
 *           type: number
 *           description: L'ID de l'utilisateur associé au compte
 *         username:
 *           type: string
 *           description: Le nom d'utilisateur associé au compte
 */
const accountSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    apiId: { type: Number, required: true },
    apiHash: { type: String, required: true },
    isActivated: { type: Boolean, required: false, default: false },
    session: { type: String, required: false },
    userId: { type: Number, required: false },
    username: { type: String, required: false }
});

module.exports = mongoose.model('Account', accountSchema);
