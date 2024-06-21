const taskService = require('../services/taskService');
const taskMapper = require("../mapper/taskMapper");

const taskController = {
    async createTask(req, res, next) {
        try {
            const {name, accounts, channels, message, resendInterval} = req.body;
            const task = await taskService
                .createTask({
                    name,
                    accounts,
                    channels,
                    message,
                    resendInterval,
                })
                .then(task => taskMapper.mapModelToDto(task));

            res.status(201).send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async addImage(req, res, next) {
        try {
            const {id} = req.params;
            const {originalname, buffer} = req.file;

            const task = await taskService.addImage(id, originalname, buffer);

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async updateImage(req, res, next) {
        try {
            const {id} = req.params;
            const {originalname, buffer} = req.file;

            const task = await taskService.updateImage(id, originalname, buffer);
            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async startTask(req, res, next) {
        try {
            const {id} = req.params;
            const task = await taskService.startTask(id);

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async stopTask(req, res, next) {
        try {
            const {id} = req.params;
            const task = await taskService.stopTask(id);

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async getTasks(req, res, next) {
        try {
            const tasks = await taskService
                .getTasks()
                .then(tasks => taskMapper.mapModelsToDtos(tasks));

            res.send(tasks);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async getTaskById(req, res, next) {
        try {
            const {id} = req.params;
            const task = await taskService
                .getTaskById(id)
                .then(task => taskMapper.mapModelToDto(task));

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async deleteTask(req, res, next) {
        try {
            const {id} = req.params;
            await taskService.deleteTask(id);

            res.send('Tasks deleted');
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async updateTask(req, res, next) {
        try {
            const {id} = req.params;
            const {name, accounts, channels, message, resendInterval, isRunning} = req.body;
            const taskToUpdate = taskMapper.mapDtoToModel({
                name,
                accounts,
                channels,
                message,
                resendInterval,
                isRunning
            });

            const task = await taskService
                .updateTask(id, taskToUpdate)
                .then(task => taskMapper.mapModelToDto(task));

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    }
}

module.exports = taskController;