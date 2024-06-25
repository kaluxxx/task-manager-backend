const taskService = require('../services/taskService');
const taskMapper = require("../mapper/taskMapper");

const taskController = {
    async createTask(req, res, next) {
        try {
            const {name, accounts, channels, message, resendInterval} = req.body;
            const user = req.user;
            const task = await taskService
                .createTask({
                    name,
                    accounts,
                    channels,
                    message,
                    resendInterval,
                    user
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
            const user = req.user;
            const {originalname, buffer} = req.file;

            const task = await taskService.addImage(user, id, originalname, buffer);

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async updateImage(req, res, next) {
        try {
            const {id} = req.params;
            const user = req.user;
            const {originalname, buffer} = req.file;

            const task = await taskService.updateImage(user, id, originalname, buffer);
            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async startTask(req, res, next) {
        try {
            const {id} = req.params;
            const user = req.user;
            const task = await taskService.startTask(user, id);

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async stopTask(req, res, next) {
        try {
            const {id} = req.params;
            const user = req.user;
            const task = await taskService.stopTask(user, id);

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
    async getTasksByUser(req, res, next) {
        try {
            const user = req.user;

            const tasks = await taskService
                .getTasksByUser(user)
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
            const user = req.user;
            const task = await taskService
                .getTaskById(user, id)
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
            const user = req.user;
            await taskService.deleteTask(user, id);

            res.send('Tasks deleted');
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    },
    async updateTask(req, res, next) {
        try {
            const {id} = req.params;
            const user = req.user;
            const {name, accounts, channels, message, resendInterval, isRunning} = req.body;
            const taskToUpdate = taskMapper.mapDtoToModel({
                name,
                accounts,
                channels,
                message,
                resendInterval,
                isRunning,
                user
            });

            const task = await taskService
                .updateTask(user, id, taskToUpdate)
                .then(task => taskMapper.mapModelToDto(task));

            res.send(task);
        } catch (e) {
            console.log("error: ", e)
            next(e);
        }
    }
}

module.exports = taskController;