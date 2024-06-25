const mongoose = require('mongoose');
const File = require("../models/file");

/**
 * @swagger
 * components:
 *   schemas:
 *     Tasks:
 *       type: object
 *       required:
 *         - name
 *         - accounts
 *         - channels
 *         - message
 *         - resendInterval
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de la tâche
 *         accounts:
 *           type: array
 *           description: Les comptes associés à la tâche
 *         channels:
 *           type: array
 *           description: Les comptes associés à la tâche
 *         imageId:
 *           type: string
 *           description: L'ID de l'image de la tâche
 *         message:
 *           type: string
 *           description: Le message de la tâche
 *         resendInterval:
 *           type: number
 *           description: L'intervalle de renvoi de la tâche
 *       example:
 *         accounts: ["account1", "account2"]
 *         channels: ["channel1", "channel2"]
 *         message: "This is a task message"
 *         resendInterval: 3000
 *     TaskInput:
 *       type: object
 *       required:
 *         - accounts
 *         - message
 *         - resendInterval
 *       properties:
 *         accounts:
 *           type: array
 *           description: Les comptes associés à la tâche
 *         channels:
 *           type: array
 *           description: Les comptes associés à la tâche
 *         message:
 *           type: string
 *           description: Le message de la tâche
 *         resendInterval:
 *           type: number
 *           description: L'intervalle de renvoi de la tâche
 *       example:
 *         accounts: ["account1", "account2"]
 *         channels: ["channel1", "channel2"]
 *         message: "This is a task message"
 *         resendInterval: 3000
 */
const taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    accounts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true}],
    channels: {type: Array, required: true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
    message: {type: String, required: true},
    isRunning: {
        type: Boolean,
        default: false
    },
    resendInterval: {type: Number, required: true},
    jobId: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

taskSchema.pre('findOneAndDelete', async function (next) {
    const task = await this.model.findOne(this.getFilter());
    if (task.image) {
        await File.findOneAndDelete({_id: task.image});
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);